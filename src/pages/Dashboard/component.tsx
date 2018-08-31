import { Avatar, Card, Col, Divider, Row } from "antd";
import * as React from "react";
import { Authentication } from "../../services/Authentication";
import { IBrick, IBrickState } from "../../types";
import "./style.css";


export interface IProps {
    brick: IBrick;
}

export default class Dashboard extends React.Component<IProps, object> {
    public state: IBrickState = {
        hash: '',
        modalIsOpen: false,
        processes: [],
        winner: "",
    };

    public constructor(props: IProps) {
        super(props);

    }

    public componentDidMount() {
        const user = Authentication.getCurrentUser();
        this.setState({ logged: true, login: user.login, name: user.name, avatar: user.avatar_url, email: user.email });
    }

    public componentWillReceiveProps() {
        // this.getBrickDetail();
    }

    public render() {

        const githubUrl = 'https://github.com/' + this.state.login;
        return (
            <div className="main-container dashboard-wrap">

                <Row>
                    <Col>
                        <Avatar size={64} src={this.state.avatar} />
                        <a target="_blank" href={githubUrl}> {this.state.name} <i className="fab fa-github" /> </a>
                    </Col>
                </Row>

                <Divider style={{ marginBottom: 32 }} />
            </div>
        )
    }

}
