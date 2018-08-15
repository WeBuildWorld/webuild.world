import { Avatar, Button, Card, Col, Dropdown, Icon, Menu, Modal, Row, Tag } from "antd";
import * as React from "react";
import Select, { components } from "react-select";
import { Authentication } from "../../../services/Authentication";
import RpcService from "../../../services/RpcService";
import { BrickStatus, IBrick } from "../../../types";
import "./Brick.css";

const { Meta } = Card;

export interface IProps {
  brick: IBrick;
  startWork: (brickId: number) => Promise<void>;
  acceptWork: (brickId: number, winner: string) => Promise<void>;
  cancelBrick: (brickId: number) => Promise<void>;
}

export default class Brick extends React.Component<IProps, object> {
  public state = { modalIsOpen: false, winner: "" };

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
    } {
      return true;
    }
  }

  public startWork(e: React.SyntheticEvent<HTMLAnchorElement>) {

    if (!this.checkLoggedIn()) {
      return;
    }

    if (this.checkHasMetaMask()) {
      this.props.startWork(this.props.brick.id);
    }
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
      onOk() {
        self.props.cancelBrick(self.props.brick.id);
        self.forceUpdate();
      },
    });


  }


  public startAcceptWork() {
    this.state.modalIsOpen = true;
    this.forceUpdate();
  }

  public acceptWork() {
    this.state.modalIsOpen = false;
    this.props.acceptWork(this.props.brick.id, this.state.winner);
  }

  public cancelModal() {
    this.state.modalIsOpen = false;
    this.forceUpdate();
  }

  public renderOperations() {

    const getAvatar = (id: any) => {
      const src = Authentication.getAvatarFromId(parseInt(id, 10));
      return <img className="avatar float-left mr-1" src={src} />;
    }

    const options = this.props.brick.builders!.map(builder => ({
      label: builder.nickName + '(' + builder.walletAddress + ')', // builder.nickName
      name: builder.key,
      value: builder.walletAddress
    }));

    const SingleValue = ({ data, children, ...props }: any) => {
      const avatarEle = getAvatar(data.name);
      return (
        <components.SingleValue {...props}>
          {avatarEle} {children}
        </components.SingleValue>
      );
    }

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

    }

    return (
      <Modal
        align={{}}
        visible={this.state.modalIsOpen}
        title={"Accept work:" + this.props.brick.title}
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

  public render() {
    const { brick } = this.props;
    const isOwner = brick.owner === RpcService.mainAccount;
    const isOpen = brick.status === BrickStatus.Open;
    const hasBuilders = brick.builders && brick.builders.length;

    let statusBar;
    let buttonGroup;

    if (brick.winner && brick.winner.nickName) {
      const avatarSrc = Authentication.getAvatarFromId(brick.winner.key);
      statusBar = <Card title="Winner" style={{ minWidth: 320 }} >
        <Meta avatar={<Avatar src={avatarSrc} />} title={brick.winner.nickName}
        // description={brick.winner.walletAddress}
        />
      </Card>;

    } else {
      statusBar = <div className="tags"><Tag color="#dfdfdf">STATUS :</Tag> <Tag color="#108ee9">{BrickStatus[brick.status]}</Tag></div>
    }

    if (isOpen) {
      brick.builders = brick.builders || [];
      const started = brick.builders.some(
        b => b.walletAddress === RpcService.mainAccount
      );

      if (isOwner) {
        if (hasBuilders) {
          buttonGroup = <div>
            <Button.Group>
              <Button htmlType="button" className="button ant-btn ant-btn-primary" onClick={this.startAcceptWork}>
                Accept Work
              </Button>
              <Button htmlType="button" className="button ant-btn" onClick={this.cancelWork}>
                Cancel Brick
              </Button>
            </Button.Group>
            {this.renderOperations()}
          </div>
        } else {
          buttonGroup = <div>
            <Button htmlType="button" className="button ant-btn ant-btn-primary" onClick={this.cancelWork}>
              Cancel Brick
        </Button> </div>
        }

      } else {
        if (started) {
          buttonGroup = <a className="button ant-btn ant-btn-primary"
            onClick={this.startWork}  >
            <i className="fas fa-wrench" />&nbsp;&nbsp;Start&nbsp;
            Work&nbsp;&nbsp; </a>
        } else {
          buttonGroup = <a className="button ant-btn disabled is-success">
            <i className="fas fa-globe" />&nbsp;&nbsp;Work&nbsp;Started&nbsp;</a>
        }
      }

    } else {
      buttonGroup = <a className="button ant-btn ant-btn-primary disabled">
        <i className="fas fa-wrench" /> Not Available </a>
    }

    return (
      <div>
        <Row>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}  >
            <h4 className="title level-item is-5">
              <a
                href={brick.url}
                target="_blank"
                className="is-link is-small">
                {brick.title}
              </a>
            </h4>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
            <div className="text-right">
              <span className="tag is-grey">
                <i className="fab fa-ethereum" />&nbsp;{brick.value} ETH
            </span>
            </div>
          </Col>
        </Row>
        <Row className="desc-row">
          <Col span={24}>
            {brick.description || ""}
          </Col>
        </Row>
        <Row>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24} >
            {statusBar}
          </Col>
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24} className="flex-layout" span={12}>
            <Row type="flex" gutter={8} justify="end" align="middle">
              <Col >
                {brick.numOfBuilders} Builders
              </Col>
              <Col>
                {buttonGroup}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            {brick.tags &&
              brick.tags.map(tag => (
                <Tag key={tag} color="geekblue">{tag}</Tag>
              ))}
          </Col>
        </Row>
      </div>
    )
  }

}
