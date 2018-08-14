import { Alert, Button, Card, Icon, List } from 'antd';
import * as React from "react";
import config from "../../config";
import { IBrick } from "../../types";
import Brick from "./_shared/Brick";

import "./style.css";
export interface IProps {
  brickCount: number;
  bricks?: IBrick[];
  getBricks?: () => void;
  startWork?: (brickId: number) => Promise<any>;
  acceptWork?: (brickId: number, winner: string) => Promise<any>;
  cancelBrick?: (brickId: number) => Promise<void>;
}

export default class Bricks extends React.Component<IProps, any> {


  constructor(props: IProps) {
    super(props);

    this.state = {
      hash: (this.props as any).match.params.hash,
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
    };

    this.dismiss = this.dismiss.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
  }

  public componentWillMount() {
    setInterval(this.props.getBricks!, 1000);
  }

  public fetchMore() {

    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'list/appendFetch',
    //   payload: {
    //     count: pageSize,
    //   },
    // });
  };

  public renderItem(item: any) {


    // const ListContent = ({ data: { content, updatedAt, avatar, owner, href } }: any) => (
    //   <div >
    //     <div>{content}</div>
    //     <div>
    //       <Avatar src={avatar} size="small" />
    //       <a href={href}>{owner}</a> 发布在
    //       <a href={href}>{href}</a>
    //     </div>
    //   </div>
    // );

    // const IconText = ({ type, text }: any) => (
    //   <span>
    //     <Icon type={type} style={{ marginRight: 8 }} />
    //     {text}
    //   </span>
    // );

    return (
      <List.Item
        column=""
        xs=""
        sm=""
        md=""
        lg=""
        xl=""
        xxl=""
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
              cancelBrick = {id => this.props.cancelBrick!(id)}
            />
          }
        />
        {/* <ListContent data={item} /> */}
      </List.Item>
    )
  }

  public render() {
    const { brickCount, bricks } = this.props;

    if (brickCount <= 0) {
      return this.renderNothing();
    }
    const items = bricks || [];
    const loading = false;
    const loadMore =
      items.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button htmlType="button" onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> loading...
            </span>
            ) : (
                'load more'
              )}
          </Button>
        </div>
      ) : null;

    return (
      <Card>

        {this.state.hash && this.renderNotification(this.state.hash!)}
        <List
          size="large"
          rowKey="id"
          itemLayout="vertical"
          // loadMore={loadMore}
          dataSource={bricks}
          renderItem={this.renderItem}
        />
      </Card>
    );
  }

  private renderNotification(hash: string) {

    const link = <p>Your brick is being added to the network, click <a target="_blank" className="is-link" href={this.getTxLink(hash)}> here </a> for more info </p>;

    return (
      <Alert
        message=""
        description={link}
        type="success"
        showIcon={true}
        closable={true}
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
