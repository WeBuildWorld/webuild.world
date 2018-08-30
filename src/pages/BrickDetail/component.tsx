import { Avatar, Button, Card, Col, Divider, Dropdown, Icon, Menu, message, Modal, Row, Spin, Tag } from "antd";
import * as React from "react";
import Select, { components } from "react-select";
import { Authentication } from "../../services/Authentication";
import { cancel, getBrick, startWork } from "../../services/BrickService";
import RpcService from "../../services/RpcService";
import { ActionState, BrickStatus, IActionState, IBrick, IBrickState, ICredential } from "../../types";
import "./style.css";

import * as moment from 'moment';
import parser from 'parse-github-url';

const { Meta } = Card;

export interface IProps {
    brick: IBrick;
    bricks: IBrick[];
    startWork: (brickId: number) => Promise<void>;
    acceptWork: (brickId: number, winner: string) => Promise<void>;
    cancelBrick: (brickId: number) => Promise<void>;
}

export default class BrickDetail extends React.Component<IProps, object> {
    public state: IBrickState = {
        hash: '',
        modalIsOpen: false,
        processes: [],
        winner: "",
    };

    public constructor(props: IProps) {
        super(props);
        this.state.hash = (this.props as any).match.params.hash;
        this.startWork = this.startWork.bind(this);
        this.acceptWork = this.acceptWork.bind(this);
        this.startAcceptWork = this.startAcceptWork.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.cancelWork = this.cancelWork.bind(this);
        this.getBrickDetail = this.getBrickDetail.bind(this);
    }

    public componentDidMount() {
        this.getBrickDetail();
    }

    public componentWillReceiveProps() {
        this.getBrickDetail();
    }

    public async getBrickDetail() {
        let brick = this.props.bricks.find((id) => id === this.state.hash);
        if (!brick) {
            brick = await getBrick(this.state.hash);
        }
        this.setState({ brick });
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

    public async startWork(e: React.SyntheticEvent<HTMLAnchorElement>) {

        if (!this.checkLoggedIn()) {
            return;
        }

        if (this.checkHasMetaMask()) {
            const hide = message.loading('Please check your MetaMask ...', 0);
            try {
                const user: ICredential = Authentication.getCurrentUser();
                const githubIdAndUserName = Authentication.getGithubIdAndName(user);
                await startWork(this.state.brick.id, githubIdAndUserName, user.name);

                this.processingBrick({
                    id: this.props.brick.id,
                    process: ActionState.StartWork
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
                    <p>Brick: {self.state.brick.title} </p>
                </div>
            ),
            onCancel() {
                self.forceUpdate();
            },
            async onOk() {
                const hide = message.loading('Please check your MetaMask ...', 0);
                try {

                    await cancel(self.state.brick.id);
                    self.processingBrick({
                        id: self.state.brick.id,
                        process: ActionState.Cancel
                    });
                    hide();
                } catch (ex) {
                    self.removeProcess(self.state.brick.id);
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
                process: ActionState.Accept
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
        }

        const options = this.state.brick.builders!.map(builder => ({
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
                title={"Accept work:" + this.state.brick.title}
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
                                this.state.winner = this.state.brick.winner = item.value;
                            }}
                        />
                    </div>
                </div>
            </Modal>
        );
    }

    public render() {
        const { brick } = this.state;

        if (!brick) {
            return null;
        }

        const isOwner = brick.owner === RpcService.mainAccount;
        const isOpen = brick.status === BrickStatus.Open;
        const hasBuilders = brick.builders && brick.builders.length;
        const { processes } = this.state;

        let processing = isOpen && processes.findIndex((p: IActionState) => {
            return p.id === brick.id;
        }) > -1;

        let statusBar;
        let buttonGroup;

        if (brick.winner && brick.winner.nickName) {
            const avatarSrc = Authentication.getAvatarFromId(brick.winner.key);
            const githubUrl = Authentication.getGithubLink(brick.winner.key);
            const githubLink = <a href={githubUrl}> {brick.winner.nickName} </a>;

            statusBar = <Card className="winner-wrapper" title="Winner" style={{ minWidth: 320 }} >
                <Meta avatar={<Avatar src={avatarSrc} />}
                    description={githubLink}
                />
            </Card>;

        } else {
            statusBar = <span className="tags"><Tag color="#dfdfdf">STATUS :</Tag> <Tag color="#108ee9">{BrickStatus[brick.status]}</Tag></span>
        }

        const startedTime = moment((brick.dateCreated as any) * 1000).fromNow();
        let expired = brick.expired > 0 ? moment((brick.expired as any) * 1000).fromNow() : '';
        expired = expired ? (" • Expired " + expired) : "";
        const desc = "Opened " + startedTime + expired;
 
        let avatar;
        const uriObj = parser(brick.url);
        if (uriObj && uriObj.owner && uriObj.host === 'github.com') {
            const src = "https://avatars.githubusercontent.com/" + uriObj.owner;
            avatar = <Avatar src={src} />;
        }

        if (isOpen) {
            brick.builders = brick.builders || [];
            const started = brick.builders.some(
                b => b.walletAddress === RpcService.mainAccount
            );

            if (isOwner) {

                processing = processes.findIndex((p: IActionState) => {
                    return p.id === brick.id && (p.process === ActionState.Accept || p.process === ActionState.Cancel);
                }) > -1;

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
                    processing = false; // should not processing before started.
                    buttonGroup = <a className="button ant-btn disabled is-success">
                        <i className="fas fa-globe" />&nbsp;&nbsp;Work&nbsp;Started&nbsp;</a>
                } else {
                    buttonGroup = <a className="button ant-btn ant-btn-primary"
                        onClick={this.startWork}  >
                        <i className="fas fa-wrench" />&nbsp;&nbsp;Start&nbsp;
          Work&nbsp;&nbsp; </a>
                }
            }

        } else {
            processing = false; // closed no actions
            buttonGroup = <a className="button ant-btn ant-btn-primary disabled">
                <i className="fas fa-wrench" /> Not Available </a>
        }

        if (processing) {
            buttonGroup = null;
        }

        const loadingBar = processing ? <div style={{ textAlign: "center" }} >
            <Button type="primary" loading={true}>
                Transaction Processing ...
    </Button>
        </div> : null;

        return (
            <div className="detail">
                <h1>
                    {avatar} <a href={brick.url} className="brick-title"> {brick.title} </a>
                </h1>

                <Row className="detail-meta">
                    <Col style={{ paddingBottom: 16 }} md={12} sm={24}> 
                        {statusBar}
                        &nbsp;
                        <Tag>
                            {brick.value} ETH  <i className="fab fa-ethereum" />
                        </Tag>

                        {brick.numOfBuilders} Builders &nbsp;

                    </Col>
                    <Col style={{ paddingBottom: 16 }} md={12} sm={24}>
                        <Row type="flex" justify="end" align="middle"> 
                            <Col>
                                {buttonGroup}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <div>
                    {desc}
                </div>

                <Divider style={{ marginBottom: 32 }} />

                <Row className="desc-row" style={{ marginBottom: 32 }}>
                    <Col span={24}>
                        {brick.description || ""}
                    </Col>
                </Row>
                <Row>
                    <Col className="tag-list">
                        {/* <i className="fab fa-github" />  */}
                        {brick.tags &&
                            brick.tags.map(tag => (
                                <Tag key={tag} color="#87d068">{tag}</Tag>
                            ))}
                    </Col>
                </Row>
                {loadingBar}
            </div>
        )
    }

}
