import { Alert, Avatar, Button, Card, Icon, List, message, Spin } from 'antd';
import * as React from "react";
import * as InfiniteScroll from 'react-infinite-scroller';

import config from "../../config";
import { IBrick } from "../../types";
import Brick from "./_shared/Brick";

import update from 'react-addons-update';

import { getBrick, getBricks } from "../../services/BrickService";
import "./style.css";

const pageSize = 10;

export interface IProps {
  brickCount: number;
  bricks?: IBrick[];
  getBricks?: (start?: number, length?: number) => void;
  startWork?: (brickId: number) => Promise<any>;
  acceptWork?: (brickId: number, winner: string) => Promise<any>;
  cancelBrick?: (brickId: number) => Promise<void>;
  removeHash?: () => Promise<void>;
}

export default class Bricks extends React.Component<IProps, any> {

  public state: any = {
    hasMore: true,
    items: [],
    loading: false,
    start: 0,
  }

  constructor(props: IProps) {
    super(props);

    this.state.hash = (this.props as any).match.params.hash;
    this.props.removeHash();
    this.dismiss = this.dismiss.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.pullBrick = this.pullBrick.bind(this);
  }

  public componentWillMount() {
    // const interval = setInterval(this.props.getBricks!, 1000);
    // this.setState({ interval });
    // this.props.getBricks(0, pageSize);
    // this.handleInfiniteOnLoad();
  }

  public componentDidMount() {
    this.loadMore();
  }

  public componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  public closeAlert() {
    this.props.removeHash();
    this.dismiss();
  }

  public async pullBrick(id: any): Promise<void> {
    const brick = await getBrick(id);
    const newItems = [...this.state.items];
    const index = this.state.items.findIndex((item: IBrick) => item.id === brick.id);
    newItems[index] = brick;

    // tslint:disable-next-line:no-console
    // console.log('brick', brick.id);

    this.setState({
      items: newItems
    })
  }

  public renderItem(item: any) {

    return (
      <List.Item
        key={item.id}
        extra={<div />}
      >
        <List.Item.Meta
          description={
            <Brick
              brick={item}
              key={item.id}
              // tslint:disable-next-line:jsx-no-lambda
              startWork={id => this.props.startWork!(id)}
              // tslint:disable-next-line:jsx-no-lambda
              acceptWork={(id, winner) => this.props.acceptWork!(id, winner)}
              // tslint:disable-next-line:jsx-no-lambda
              cancelBrick={id => this.props.cancelBrick!(id)}
              // tslint:disable-next-line:jsx-no-lambda
              pullBrick={id => this.pullBrick(id)}
            />
          }
        />
        {/* <ListContent data={item} /> */}
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

    return (
      <div className="bricks-infinite-container">
        {this.state.hash && this.renderNotification(this.state.hash!)}

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
            dataSource={this.state.items}
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
      <p className="greeting">
        No bricks has been added yet or it's being loaded.
      </p>
    );
  }

  private dismiss() {
    this.setState({ hash: null });
    (this.props as any).history.push("/");
  }
}
