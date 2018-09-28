import { Alert, Avatar, Button, Col, List, message, Radio, Row, Select, Spin, Tag, Tabs } from 'antd';
import * as moment from 'moment';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';

import parser from 'parse-github-url';
import RpcService from '../../services/RpcService';

import { getBricks } from '../../services/BrickService';
import { BrickStatus, IBrick } from '../../types';

import { loadJSONP } from '../../utils';

import './style.css';

const pageSize = 5;
const { Option } = Select;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

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
    empty: false,
    filterStatus: BrickStatus.Open,
    filters: [],
    hasMore: true,
    items: [],
    loading: false,
    start: 0,
    issues: [],
  };

  constructor(props: IProps) {
    super(props);

    if ((this.props as any).match) {
      this.state.hash = (this.props as any).match.params.hash;
    }
    this.dismiss = this.dismiss.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.refresh = this.refresh.bind(this);
    this.changeBrickStatus = this.changeBrickStatus.bind(this);
    this.renderList = this.renderList.bind(this);
    this.loadGitIssues = this.loadGitIssues.bind(this);
  }

  public componentDidMount() {
    setTimeout(() => {
      this.loadMore();
    }, 500);
    this.loadGitIssues();
  }

  public closeAlert() {
    this.props.removeHash();
    this.dismiss();
  }

  public loadGitIssues() {
    loadJSONP('https://api.github.com/repos/WeBuildWorld/webuild.world/issues?state=all', (res) => {
      // console.log('res:', res.data);
      this.setState({
        issues: res.data,
      });
      console.log('res:', res.data);
    });
  }

  public addFilter(tag: string) {
    this.setState((prevState: any) => {
      const tags = prevState.filters;
      const status = prevState.filterStatus;
      if (!tags.includes(tag)) {
        tags.push(tag);
      }

      this.refresh(tags, status);
      return { filters: tags };
    });
  }

  public onDeselect(event: any) {
    this.setState((prevState: any) => {
      const tags = prevState.filters;
      const status = prevState.filterStatus;
      const index = tags.indexOf(event);
      if (index !== -1) {
        tags.splice(index, 1);
      }
      this.refresh(tags, status);
      return { filters: tags };
    });
  }

  public renderItem(brick: any) {

    const started = moment((brick.dateCreated as any) * 1000).fromNow();
    const expireLabel = ((brick.expired as any) * 1000 > new Date().getTime()) ? ' Expires ' : ' Expired ';
    let expired = brick.expired > 0 ? moment((brick.expired as any) * 1000).fromNow() : '';
    expired = expired ? (' • ' + expireLabel + expired) : '';
    const detailUrl = '/brick/' + brick.id;
    const desc = 'Status ' + BrickStatus[brick.status] + ' • ' + 'Opened '
      + started + expired;
    let avatar;
    const uriObj = parser(brick.url);
    if (uriObj && uriObj.owner && uriObj.host === 'github.com') {
      const src = 'https://avatars.githubusercontent.com/' + uriObj.owner;
      avatar = <Avatar src={src} />;
    }

    return (
      <List.Item
        key={brick.id}
        extra={
          <Tag className="unclickable" color="#2db7f5">{brick.value} ETH <i className="fab fa-ethereum" /></Tag>}
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
              <Tag key={tag} onClick={() => { this.addFilter(tag); }} color="#87d068">{tag}</Tag>
            ))}
        </div>

      </List.Item>
    );
  }

  public loadMore() {
    let items = this.state.items || [];
    let start = this.state.start;
    const tags = this.state.filters;
    const status = this.state.filterStatus;

    this.setState({
      loading: true,
    });

    getBricks(start, pageSize, tags, status).then((res) => {

      if (!res.bricks.length) {
        message.warning('No more bricks');
        this.setState({
          empty: true,
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
      });
    });

  }

  public refresh(tags: string[], status: number) {
    this.setState({
      hasMore: true,
      loading: true,
      start: 0,
    });

    getBricks(0, pageSize, tags, status).then((res) => {

      const items = res.bricks;
      const start = pageSize;
      const empty = res.brickCount === 0;
      this.props.onBricksChanged(items);
      this.setState({
        empty,
        items,
        loading: false,
        start,
      });
    });
  }

  public changeBrickStatus(e: any) {

    this.setState((prevState: any) => {
      const tags = prevState.filters;
      const status = e.target.value;
      this.refresh(tags, status);
      return { filterStatus: status };
    });

  }

  public render() {

    const { filters } = this.state;
    const children = filters.map((item: any) => {
      return (<Option key={item}>{item}</Option>);
    });

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const noBricks = this.state.items.length <= 0;

    return (
      <div className="main-container bricks-container">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Bricks" key="1">
            <Row>
              <Col sm={0} md={4}>
                <div className="filter-cols">
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

                  <RadioGroup onChange={this.changeBrickStatus} value={this.state.filterStatus}>
                    <Radio style={radioStyle} value={-1}>All</Radio>
                    <Radio style={radioStyle} value={BrickStatus.Open}>Open</Radio>
                    <Radio style={radioStyle} value={BrickStatus.Completed}>Completed</Radio>
                    <Radio style={radioStyle} value={BrickStatus.Canceled}>Canceled</Radio>
                  </RadioGroup>
                </div>
              </Col>
              <Col sm={24} md={20}>
                <div className="bricks-infinite-container">
                  {this.state.hash && this.renderNotification(this.state.hash!)}

                  {noBricks ? this.renderNothing() : ''}
                  {noBricks ? '' : this.renderList()}
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Github Issues" key="2">

            <List
              itemLayout="horizontal"
              dataSource={this.state.issues}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.user.avatar_url} />}
                    title={<a href={item.url}>{item.title}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }

  private renderList() {
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={this.loadMore}
        hasMore={!this.state.loading && this.state.hasMore}
        useWindow={true}
      >
        <List
          size="large"
          rowKey="id"
          itemLayout="vertical"
          dataSource={this.props.bricks}
          renderItem={this.renderItem}
        >
          {this.state.loading && this.state.hasMore && (
            <div className="bricks-loading-container refresh">
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    );
  }

  private renderNotification(hash: string) {

    // tslint:disable-next-line:max-line-length
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
    const name = RpcService.getNetWorkName();
    return 'https://' + name + '.etherscan.io/tx/' + hash;
  }

  private renderNothing() {
    const { empty } = this.state;
    const text = empty ? '' : 'or it\'s being loaded';
    return (
      <div className="greeting">
        <Button className="unclickable ant-btn-loading" type="primary" loading={!empty}>
          No bricks has been added yet {text}.
        </Button>
      </div>
    );
  }

  private dismiss() {
    this.setState({ hash: null });
    (this.props as any).history.push('/');
  }
}
