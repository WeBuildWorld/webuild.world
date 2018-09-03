import { Alert, Avatar, Button, Card, Icon, List, message, Select, Spin, Tag } from 'antd';
import * as moment from "moment";
import * as React from "react";
import * as InfiniteScroll from 'react-infinite-scroller';

import parser from 'parse-github-url';
import config from "../../config";

import { getBrick, getBricks, getBricksByBuilder, getBricksByOwner, watchEvents } from "../../services/BrickService";
import { BrickStatus, IBrick, RoleType } from "../../types";

import "./BrickList.css";

const pageSize = 5;
const { Option } = Select;

export default class Bricks extends React.Component<any, any> {

  public state: any = {
    filters: [],
    hasMore: true,
    items: [],
    loading: false,
    start: 0,
  }

  constructor(props: any) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    setTimeout(() => {
      this.refresh([]);
    }, 200); 
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


  public refresh(tags: string[]) {
    this.setState({
      hasMore: true,
      loading: true,
      start: 0
    });

    if (this.props.role === RoleType.Owner) {

      getBricksByOwner().then((res) => {
        const items = res.bricks;
        const start = pageSize;
        this.setState({
          items,
          loading: false,
          start,
        })
      });

    } else if (this.props.role === RoleType.Builder) {
      getBricksByBuilder().then((res) => {
        const items = res.bricks;
        const start = pageSize;
        this.setState({
          items,
          loading: false,
          start,
        })
      });

    } else {
      getBricks(0, pageSize, tags).then((res) => {
        const items = res.bricks;
        const start = pageSize;
        this.setState({
          items,
          loading: false,
          start,
        })
      });
    }
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
      <List
        size="large"
        rowKey="id"
        itemLayout="vertical"
        dataSource={this.state.items}
        renderItem={this.renderItem}
      >
        {this.state.loading && this.state.hasMore && (
          <div className="bricks-loading-container">
            <Spin />
          </div>
        )}
      </List>
    );
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
}
