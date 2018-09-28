import { Alert, Avatar, Col, Row, Tabs } from 'antd';
import * as React from 'react';
import { Authentication } from '../../services/Authentication';
import { IBrick, IBrickState, RoleType } from '../../types';
import './style.css';

import BrickList from './../_shared/BrickList';

export interface IProps {
    brick: IBrick;
    account: string;
}

const TabPane = Tabs.TabPane;
export default class Dashboard extends React.Component<IProps, object> {
    public state: IBrickState = {
        hash: '',
        modalIsOpen: false,
        processes: [],
        winner: '',
    };

    public constructor(props: IProps) {
        super(props);
        this.tabsChanged = this.tabsChanged.bind(this);
    }

    public componentDidMount() {
        const user = Authentication.getCurrentUser();
        if (!user) {
            location.href = '/';
        }
        this.setState({ logged: true, login: user.login, name: user.name, avatar: user.avatar_url, email: user.email });

        setTimeout(() => {
            this.setState({
                inited: true,
            });
        }, 1000);
    }

    public componentWillReceiveProps() {
        // this.getBrickDetail();
    }

    public tabsChanged() {
        //
    }

    public render() {

        const githubUrl = 'https://github.com/' + this.state.login;
        const { account } = this.props;
        const {inited} = this.state;
        if (!account && inited) {
            return (
                <div className="main-container dashboard-wrap">
                    <Alert message="Metamask is not installed or logged in."
                        description={
                            <p>Here is <a target="_blank" href="https://metamask.io/">Metamask</a>.</p>
                        }
                        type="warning"
                    />
                </div>);
        }

        return (
            <div className="main-container dashboard-wrap">
                <Row>
                    <Col>
                        <Avatar size={64} src={this.state.avatar} />
                        <a target="_blank" href={githubUrl}> {this.state.name} <i className="fab fa-github" /> </a>
                    </Col>
                </Row>

                {/* <Divider style={{ marginBottom: 32 }} /> */}

                <Tabs defaultActiveKey="1" onChange={this.tabsChanged}>
                    <TabPane tab="My Bricks" key="1">
                        <BrickList role={RoleType.Owner} />
                    </TabPane>
                    <TabPane tab="My Built" key="2">
                        <BrickList role={RoleType.Builder} />
                    </TabPane>
                </Tabs>

            </div>
        );
    }

}
