import { Alert, Avatar, Button, Card, Icon, List, message, Select, Spin, Tag } from 'antd';
import * as moment from "moment";
import * as React from "react";
import * as InfiniteScroll from 'react-infinite-scroller';

import config from "../../config";

import { getBrick, getBricks, watchEvents } from "../../services/BrickService";
import { BrickStatus, IBrick } from "../../types";
import Brick from "./_shared/Brick";

import "./style.css";

const pageSize = 10;

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

    this.state.hash = (this.props as any).match.params.hash;
    this.dismiss = this.dismiss.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  public componentDidMount() {
    this.loadMore();
  }

  public closeAlert() {
    this.props.removeHash();
    this.dismiss();
  }

  public renderItem(brick: any) {

    const started = moment((brick.dateCreated as any) * 1000).fromNow();
    let expired = brick.expired > 0 ? moment((brick.expired as any) * 1000).fromNow() : '';
    expired = expired ? (" • Expired " + expired) : "";
    const detailUrl = "/brick/" + brick.id;
    const desc = "Status " + BrickStatus[brick.status] + " • " + "Opened "
      + started + expired;

    return (
      <List.Item
        key={brick.id}
        extra={
          <Tag color="#2db7f5">{brick.value} ETH <i className="fab fa-ethereum" /></Tag>
        }
      >
        <List.Item.Meta
          avatar={<Avatar src="https://avatars1.githubusercontent.com/u/5743338?v=4" />}
          title={<a href={detailUrl}>{brick.title}</a>}
          description={desc}
        />

        <div>
          {brick.tags &&
            brick.tags.map((tag: string) => (
              <Tag key={tag} color="#87d068">{tag}</Tag>
            ))}
        </div>

      </List.Item>
    )
  }


  public loadMore() {
    let items = this.state.items || [];
    let start = this.state.start;

    this.setState({
      loading: true,
    });

    getBricks(start, pageSize).then((res) => {

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

  public filterChanged() {
    //
  }

  public render() {

    if (this.state.items.length <= 0) {
      return this.renderNothing();
    }

    const { filters } = this.state;

    return (
      <div className="bricks-infinite-container">
        {this.state.hash && this.renderNotification(this.state.hash!)}

        <div className="search-bar">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={this.filterChanged}
            tokenSeparators={[',']}
            placeholder="select tags"
          >
            {filters}
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
