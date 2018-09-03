import { Alert, Avatar, Button, Card, Icon, List, message, Select, Spin, Tag } from 'antd';
import * as moment from "moment";
import * as React from "react";
import * as InfiniteScroll from 'react-infinite-scroller';

import parser from 'parse-github-url';
import config from "../../config";

import { getBrick, getBricks, watchEvents } from "../../services/BrickService";
import { BrickStatus, IBrick } from "../../types";
import Brick from "./_shared/Brick";

import "./style.css";

const pageSize = 5;
const { Option } = Select;

export interface IProps {
  brickCount: number;
  bricks?: IBrick[];
  getBricks?: (start?: number, length?: number) => void;
  getMoreBricks?: (start?: number, length?: number) => void;
  onBricksChanged?: (bricks: IBrick[]) => void;
  startWork?: (brickId: number) => Promise<any>;
  acceptWork?: (brickId: number, winner: string) => Promise<any>;
  cancelBrick?: (brickId: number) => Promise<void>;
  removeHash?: () => Promise<void>;
}

export default class Bricks extends React.Component<IProps, any> {

  public state: any = {
    filters: [],
    hasMore: true,
    items: [],
    loading: false,
    start: 0,
  }

  constructor(props: IProps) {
    super(props);

    if((this.props as any).match){
      this.state.hash = (this.props as any).match.params.hash;
    }
    this.dismiss = this.dismiss.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    this.loadMore();
  }

  public closeAlert() {
    this.props.removeHash();
    this.dismiss();
  }

  public addFilter(tag: string) {
    this.setState((prevState: any) => {
      const tags = prevState.filters;
      if (!tags.includes(tag)) {
        tags.push(tag);
      }

      this.refresh(tags);
      return { filters: tags };
    });
  }

  public onDeselect(event: any) {
    this.setState((prevState: any) => {
      const tags = prevState.filters;
      const index = tags.indexOf(event);
      if (index !== -1) {
        tags.splice(index, 1);
      }
      this.refresh(tags);
      return { filters: tags };
    });
  }

  public renderItem(brick: any) {

    const started = moment((brick.dateCreated as any) * 1000).fromNow();
    const expireLabel = ((brick.expired as any) * 1000 > new Date().getTime()) ? ' Expires ' : ' Expired ';
    let expired = brick.expired > 0 ? moment((brick.expired as any) * 1000).fromNow() : '';
    expired = expired ? (" • " + expireLabel + expired) : "";
    const detailUrl = "/brick/" + brick.id;
    const desc = "Status " + BrickStatus[brick.status] + " • " + "Opened "
      + started + expired;
    let avatar;
    const uriObj = parser(brick.url);
    if (uriObj && uriObj.owner && uriObj.host === 'github.com') {
      const src = "https://avatars.githubusercontent.com/" + uriObj.owner;
      avatar = <Avatar src={src} />;
    }

    return (
      <List.Item
        key={brick.id}
        extra={
          <Tag className="unclickable" color="#2db7f5">{brick.value} ETH <i className="fab fa-ethereum" /></Tag>
        }
      >
        <List.Item.Meta
          avatar={avatar}
          title={<a href={detailUrl}>{brick.title}</a>}
          description={desc}
        />

        <div>
          {brick.tags &&
            brick.tags.map((tag: string) => (
              // tslint:disable-next-line:jsx-no-lambda
              <Tag key={tag} onClick={() => { this.addFilter(tag) }} color="#87d068">{tag}</Tag>
            ))}
        </div>

      </List.Item>
    )
  }

  public loadMore() {
    let items = this.state.items || [];
    let start = this.state.start;
    const tags = this.state.filters;

    this.setState({
      loading: true,
    });

    getBricks(start, pageSize, tags).then((res) => {

      if (!res.bricks.length) {
        message.warning('No more bricks');
        this.setState({
          hasMore: false,
          loading: false,
        });
        return;
      }

      items = items.concat(res.bricks);
      start = start + pageSize;

      this.props.onBricksChanged(items);
      this.setState({
        items,
        loading: false,
        start,
      })
    });

  }

  public refresh(tags: string[]) {
    this.setState({
      hasMore: true,
      loading: true,
      start: 0
    });

    getBricks(0, pageSize, tags).then((res) => {

      const items = res.bricks;
      const start = pageSize;

      this.props.onBricksChanged(items);
      this.setState({
        items,
        loading: false,
        start,
      })
    });
  }

  public render() {

    if (this.state.items.length <= 0) {
      return this.renderNothing();
    }

    const { filters } = this.state;
    const children = filters.map((item: any) => {
      return (<Option key={item}>{item}</Option>);
    });

    return (
      <div className="main-container">
        <div className="bricks-infinite-container">
          {this.state.hash && this.renderNotification(this.state.hash!)}

          <div className="search-bar">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              onDeselect={this.onDeselect}
              onSelect={this.addFilter}
              value={filters}
              tokenSeparators={[',']}
              placeholder="select tags"
            >
              {children}
            </Select>
          </div>

          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <List
              size="large"
              rowKey="id"
              itemLayout="vertical"
              dataSource={this.props.bricks}
              renderItem={this.renderItem}
            >
              {this.state.loading && this.state.hasMore && (
                <div className="bricks-loading-container">
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
      </div>
    );
  }

  private renderNotification(hash: string) {

    const link = <p>Your brick is being added to the network, you will see it at list after a while, click <a target="_blank" className="is-link" href={this.getTxLink(hash)}> here </a> for more info </p>;

    return (
      <Alert
        message=""
        description={link}
        type="success"
        showIcon={true}
        closable={true}
        afterClose={this.closeAlert}
      />
    );
  }

  private getTxLink(hash: string): string | undefined {
    return "https://" + config.networkName + ".etherscan.io/tx/" + hash;
  }

  private renderNothing() {
    return (

      <div className="greeting">
        <Button type="primary" loading={true}>
          No bricks has been added yet or it's being loaded.
        </Button>
      </div>
    );
  }

  private dismiss() {
    this.setState({ hash: null });
    (this.props as any).history.push("/");
  }
}
