import { Alert, Avatar, Card, Col, Divider, Row, Tabs } from "antd";
import * as React from "react";
import { Authentication } from "../../services/Authentication";
import { IBrick, IBrickState } from "../../types";
import "./style.css";

import Bricks from "./../../pages/Bricks";

import { getBricksByBuilder, getBricksByOwner } from "../../services/BrickService";

import RpcService from "../../services/RpcService";


export interface IProps {
    brick: IBrick;
}

const TabPane = Tabs.TabPane;
export default class Dashboard extends React.Component<IProps, object> {
    public state: IBrickState = {
        hash: '',
        modalIsOpen: false,
        processes: [],
        winner: "",
    };

    public constructor(props: IProps) {
        super(props);
        this.tabsChanged = this.tabsChanged.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    public refresh() {
        this.setState({
            hasMore: true,
            loading: true,
            start: 0
        });

        const account: string = RpcService.mainAccount; 

        // tslint:disable-next-line:no-console
        console.log('account', account);

        getBricksByOwner(account).then((res) => {
            if(res){
                const items = res.bricks;  
                this.setState({
                    items,
                    loading: false,
                })
            }
      
        });

        getBricksByBuilder(account).then((res) => {
            const items = res.bricks;

            this.setState({
                items,
                loading: false,
            })
        });
    }

    public componentDidMount() {
        this.refresh();
        const user = Authentication.getCurrentUser();
        if (!user) {
            location.href = '/';
        }
        this.setState({ logged: true, login: user.login, name: user.name, avatar: user.avatar_url, email: user.email });
    }

    public componentWillReceiveProps() {
        // this.getBrickDetail();
    }

    public tabsChanged() {
        //
    }

    public render() {

        const githubUrl = 'https://github.com/' + this.state.login;

        const account = RpcService.mainAccount; 
        
        if(!account){
           return (
               <div className="main-container dashboard-wrap">    
                     <Alert message="Metamask needed."
                    description={
                        <p>Here is <a target="_blank" href="https://metamask.io/">Metamask</a>.</p> 
                    }
                    type="warning"
                    />
                    </div>  )
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
                        <Bricks />
                    </TabPane>
                    <TabPane tab="My Built" key="2">
                        <Bricks />
                    </TabPane>
                </Tabs> 
       
            </div>
        )
    }

}
