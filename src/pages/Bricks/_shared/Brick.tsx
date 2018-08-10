import { Button, Col, Modal, Row, Tag } from "antd";
import * as React from "react";
import Select, { components } from "react-select";
import { Authentication } from "../../../services/Authentication";
import RpcService from "../../../services/RpcService";
import { BrickStatus, IBrick } from "../../../types";
import "./Brick.css";

export interface IProps {
  brick: IBrick;
  startWork: (brickId: number) => Promise<void>;
  acceptWork: (brickId: number, winner: string) => Promise<void>;
}

export default class Brick extends React.Component<IProps, object> {
  public state = { modalIsOpen: false, winner: "" };

  public constructor(props: IProps) {
    super(props);
    this.startWork = this.startWork.bind(this);
    this.acceptWork = this.acceptWork.bind(this);
    this.startAcceptWork = this.startAcceptWork.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
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

  public startWork(e: React.SyntheticEvent<HTMLAnchorElement>) {

    if (!this.checkLoggedIn()) {
      return;
    }

    if (!RpcService.hasMainAccount()) {
      Modal.warn({
        title: 'Metamask needed.',
        // tslint:disable-next-line:object-literal-sort-keys
        content: (
          <div>
            <p>Here is <a target="_blank" href="https://metamask.io/">Metamask</a>.</p>
          </div>
        ),
        // tslint:disable-next-line:no-empty
        onOk() { },
      });
      return;
    }
    this.props.startWork(this.props.brick.id);
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
      const src = Authentication.getAvatarFromId(id);
      return <img className="avatar float-left mr-1" src={src} />;
    }

    const options = this.props.brick.builders!.map(builder => ({
      label: builder.nickName + '(' + builder.walletAddress + ')', // builder.nickName
      name: builder.key,
      value: builder.walletAddress
    }));

    const SingleValue = ({ data, children, ...props }: any) => {
      const Avatar = getAvatar(data.name);
      return (
        <components.SingleValue {...props}>
          {Avatar} {children}
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
      const Avatar = getAvatar(data.name);
      const result = !isDisabled ? (
        <div {...innerProps}> {Avatar} {children}</div>
      ) : null;
 
      return result;

    }

    return (
      <Modal
        align="centered"
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

    return (
      <div>
        <Row>
          <Col span={12}>
            <h4 className="title level-item is-5">
              <a
                href={brick.url}
                target="_blank"
                className="is-link is-small"
              >
                {brick.title}
              </a>
            </h4>
          </Col>
          <Col span={12}>
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
          <Col className="tags" span={12}>
            <Tag color="#dfdfdf">STATUS :</Tag><Tag color="#108ee9">{BrickStatus[brick.status]}</Tag>
          </Col>
          <Col className="flex-layout" span={12}>
            <Row type="flex" gutter={8} justify="end" align="middle">
              <Col >
                {brick.numOfBuilders} Builders
              </Col>
              <Col>
                {brick.status === BrickStatus.Open &&
                  brick.numOfBuilders! > 0 &&
                  brick.owner === RpcService.mainAccount && (
                    <div>
                      <Button
                        htmlType="button"
                        className="button is-info is-small"
                        onClick={this.startAcceptWork}
                      >
                        Accept work
                      </Button>
                      {this.renderOperations()}
                    </div>
                  )}
              </Col>
              <Col>
                {brick.status === BrickStatus.Open &&
                  brick.builders &&
                  (!brick.builders.some(
                    b => b.walletAddress === RpcService.mainAccount
                  ) && (
                      <a className="button ant-btn ant-btn-primary"
                        onClick={this.startWork}  >
                        <i className="fas fa-wrench" />&nbsp;&nbsp;Start&nbsp;
                        Work&nbsp;&nbsp;
                    </a>
                    ))}
                {brick.status === BrickStatus.Open &&
                  brick.builders &&
                  (brick.builders.some(
                    b => b.walletAddress === RpcService.mainAccount
                  ) && (
                      <a className="button ant-btn ant-btn-primary is-success">
                        <i className="fas fa-globe" />&nbsp;&nbsp;Work&nbsp;Started&nbsp;
                    </a>
                    ))}
                {brick.status !== BrickStatus.Open && (
                  <a className="button ant-btn ant-btn-primary disabled">
                    <i className="fas fa-wrench" /> Not Available </a>
                )}
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
