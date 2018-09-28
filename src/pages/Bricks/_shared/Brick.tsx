import { Avatar, Button, Card, Col, Divider, Dropdown, Icon, Menu, message, Modal, Row, Spin, Tag } from 'antd';
import * as moment from 'moment';
import * as React from 'react';
import Select, { components } from 'react-select';
import { Authentication } from '../../../services/Authentication';
import RpcService from '../../../services/RpcService';
import { ActionState, BrickStatus, IActionState, IBrick, IBrickState } from '../../../types';
import './Brick.css';

export interface IProps {
  brick: IBrick;
  startWork: (brickId: number) => Promise<void>;
  acceptWork: (brickId: number, winner: string) => Promise<void>;
  cancelBrick: (brickId: number) => Promise<void>;
}

export default class Brick extends React.Component<IProps, object> {
  public state: IBrickState = {
    modalIsOpen: false,
    processes: [],
    winner: '',
  };

  public constructor(props: IProps) {
    super(props);
    this.startWork = this.startWork.bind(this);
    this.acceptWork = this.acceptWork.bind(this);
    this.startAcceptWork = this.startAcceptWork.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
    this.cancelWork = this.cancelWork.bind(this);
  }

  public checkLoggedIn() {
    const user = Authentication.getCurrentUser();
    if (user) {
      return true;
    }

    Modal.warn({
      title: 'You have not sign in github yet.',
      // tslint:disable-next-line:object-literal-sort-keys
      content: (
        <div>
          <p>Please sign in github.</p>
        </div>
      ),
      // tslint:disable-next-line:no-empty
      onOk() { },
    });
    return false;
  }

  public checkHasMetaMask() {
    if (!RpcService.hasMainAccount()) {
      Modal.warn({
        content: (
          <div>
            <p>Here is <a target="_blank" href="https://metamask.io/">Metamask</a>.</p>
          </div>
        ),
        title: 'Metamask needed.',
        onOk() {
          // tslint:disable-next-line:no-empty
        },
      });
      return false;
    } else {
      return true;
    }
  }

  public async startWork(e: React.SyntheticEvent<HTMLAnchorElement>) {

    if (!this.checkLoggedIn()) {
      return;
    }

    if (this.checkHasMetaMask()) {
      const hide = message.loading('Please check your MetaMask ...', 0);
      try {
        await this.props.startWork(this.props.brick.id);
        this.processingBrick({
          id: this.props.brick.id,
          process: ActionState.StartWork,
        });
        hide();
      } catch (ex) {
        this.removeProcess(this.props.brick.id);
        hide();
      }
    }
  }

  public processingBrick(state: IActionState) {
    this.setState((prevState: any, props) => {
      return { processes: prevState.processes.concat([state]) };
    });
  }

  public removeProcess(id: any) {
    const { processes } = this.state;
    let index = 0;
    while (index > -1) {
      index = processes.indexOf((item: any) => item.id === id);
      processes.splice(index, 1);
    }
    this.setState({ processes });
  }

  public cancelWork() {
    const self = this;
    Modal.confirm({
      title: 'Are you sure to cancel this brick?',
      // tslint:disable-next-line:object-literal-sort-keys
      content: (
        <div>
          <p>Brick: {self.props.brick.title} </p>
        </div>
      ),
      onCancel() {
        self.forceUpdate();
      },
      async onOk() {
        const hide = message.loading('Please check your MetaMask ...', 0);
        try {
          await self.props.cancelBrick(self.props.brick.id);
          self.processingBrick({
            id: self.props.brick.id,
            process: ActionState.Cancel,
          });
          hide();
        } catch (ex) {
          self.removeProcess(self.props.brick.id);
          hide();
        }
        self.forceUpdate();
      },
    });
  }

  public startAcceptWork() {
    this.state.modalIsOpen = true;
    this.forceUpdate();
  }

  public async acceptWork() {
    this.state.modalIsOpen = false;
    // const hide = message.loading('canceling brick ...', 0);
    const self = this;
    const hide = message.loading('Please check your MetaMask ...', 0);
    try {
      await self.props.acceptWork(self.props.brick.id, self.state.winner);
      self.processingBrick({
        id: self.props.brick.id,
        process: ActionState.Accept,
      });
      hide();
    } catch (ex) {
      self.removeProcess(self.props.brick.id);
      hide();
    }
  }

  public cancelModal() {
    this.state.modalIsOpen = false;
    this.forceUpdate();
  }

  public renderOperations() {

    const getAvatar = (id: any) => {
      const src = Authentication.getAvatarFromId(parseInt(id, 10));
      return <img className="avatar float-left mr-1" src={src} />;
    };

    const options = this.props.brick.builders!.map((builder) => ({
      label: builder.nickName + '(' + builder.walletAddress + ')', // builder.nickName
      name: builder.key,
      value: builder.walletAddress,
    }));

    const SingleValue = ({ data, children, ...props }: any) => {
      const avatarEle = getAvatar(data.name);
      return (
        <components.SingleValue {...props}>
          {avatarEle} {children}
        </components.SingleValue>
      );
    };

    const MenuList = (props: any) => {
      return (
        <components.MenuList {...props}>
          {props.children}
        </components.MenuList>
      );
    };

    const CustomOption = (params: any) => {
      const { children, innerProps, isDisabled, data } = params;
      const avatarEle = getAvatar(data.name);
      const result = !isDisabled ? (
        <div {...innerProps}> {avatarEle} {children}</div>
      ) : null;

      return result;

    };

    return (
      <Modal
        align={{}}
        visible={this.state.modalIsOpen}
        title={'Accept work:' + this.props.brick.title}
        onOk={this.acceptWork}
        onCancel={this.cancelModal}
      >
        <div className="desc">
          Please make sure that you are satisfied by the work the builder
                submits. By clicking the button "submit", your fund will be
                transferred to your selected builder.
                <br />  <br />
        </div>

        <div className="field">
          <h3 className="label">Winner</h3>
          <div className="control">
            <Select
              name="form-field-name"
              options={options}
              components={{ SingleValue, MenuList, ...{ Option: CustomOption } }}
              // value={this.props.brick.winner}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(item: any) => {
                this.state.winner = this.props.brick.winner = item.value;
              }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  // public enterDetail(id: any) {
  //   history.push("/brick/" + id);
  //   this.forceUpdate();
  // }

  public render() {
    const { brick } = this.props;
    const started = moment((brick.dateCreated as any) * 1000).fromNow();
    const expired = brick.expired > 0 ? moment((brick.expired as any) * 1000).fromNow() : '';
    const detailUrl = '/brick/' + brick.id;
    return (
      <div>
        <Row>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <h3> <a href={detailUrl}>{brick.title} </a></h3>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <Tag color="#2db7f5">{brick.value} ETH <i className="fab fa-ethereum" /></Tag>
          </Col>
        </Row>
        <Row>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <span> Status {BrickStatus[brick.status]}</span> •
            <span> Opened {started}</span> {expired ? (<span> • Expired {expired}</span>) : ''}
          </Col>
          {/* <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
           </Col> */}
        </Row>

        <Row>
          <Col>
            {brick.tags &&
              brick.tags.map((tag) => (
                <Tag key={tag} color="#87d068">{tag}</Tag>
              ))}
          </Col>
        </Row>
      </div>
    );
  }

}
