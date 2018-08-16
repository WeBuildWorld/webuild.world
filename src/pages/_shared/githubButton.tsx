import * as React from "react";
import { connect } from "react-redux";

import axios from "axios";
import GitHubLogin from 'react-github-login';
import { ICredential, IStoreState } from "../../types";

import { Avatar, Dropdown, Icon, Menu } from "antd";
import { LOGIN_REQUEST, LOGIN_SUCCESS } from "../../constants";
import { Authentication } from "../../services/Authentication";
const CLIENT_ID = "36d1aa5652f688cde83b";
const CLIENT_SECRET = "c33eb8e1c3633fa7061eb58abf246fcd1446131d";
const REDIRECT_URL = "https://webuild.world";

export class GitHubButton extends React.Component {

    public state: any;
    constructor(props: any) {
        super(props);

        const user = Authentication.getCurrentUser();
        if (user) {
            this.state = { logged: true, avatar: user.avatar_url };
        } else {
            this.state = { logged: false, avatar: "" };
        }

        this.handleClick = this.handleClick.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFakeSuccess = this.onFakeSuccess.bind(this);
        this.logout = this.logout.bind(this);
    }

    public handleClick() {
        this.setState((prevState: any) => {
            return { logged: !prevState.logged };
        });
    }

    public logout() {
        Authentication.setCurrentUser(null);
        this.setState({ logged: false });
    }

    public onFakeSuccess(response: any) {

        const data: ICredential = {
            email: 'vellengs@qq.com',
            githubId: '5743338',
            login: 'vellengs',
            name: 'viking',
        };

        Authentication.setCurrentUser(data);
        const user = Authentication.getCurrentUser();
        this.setState({ logged: true, avatar: user.avatar_url, email: user.email });
    }

    public onSuccess(response: any) {
        const self = this;
        if (response && response.code) {
            axios.post('login/oauth/access_token', {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "code": response.code,
                "redirect_uri": REDIRECT_URL
            }).then((res) => {
                axios.get('user?' + res.data).then((result) => {
                    const data = result.data;
                    if (data) {
                        const user = {
                            email: data.email,
                            githubId: data.id,
                            login: data.login,
                            name: data.name,
                        };
                        Authentication.setCurrentUser(user);
                        self.setState({ logged: true, avatar: data.avatar_url, email: user.email });
                    }
                });
            });
        }
    }

    public render() {

        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href="javascript:;" onClick={this.logout} >logout</a>
                </Menu.Item>
            </Menu>
        );
        const image = <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
                <Avatar shape="square" src={this.state.avatar} /> <Icon type="down" />
            </a>
        </Dropdown>

        const button = <GitHubLogin
            onSuccess={this.onSuccess}
            visible={false}
            className="ant-btn ant-btn-primary"
            clientId={CLIENT_ID}
            onFailure={this.onFakeSuccess}
            redirectUri={REDIRECT_URL}
            scope="user.email"
        />;

        return (this.state.logged ? image : button);
    }
}

export function mapStateToProps({
    reducer
}: {
        reducer: { app: IStoreState };
    }) {

    return {
        loggedIn: reducer.app.loggedIn,
        loggingIn: reducer.app.loggingIn,
        user: reducer.app.user,
    };
}

// probably to show a login loading.
export const userLoginRequest = (loggingIn: boolean) => {
    return async (dispatch: any): Promise<void> => {
        return dispatch({
            payload: { loggingIn },
            type: LOGIN_REQUEST
        });
    };
}

export const userLoginSuccess = (user: ICredential, loggedIn: boolean) => {
    return async (dispatch: any): Promise<void> => {
        return dispatch({
            payload: { user, loggedIn },
            type: LOGIN_SUCCESS
        });
    };
}

export function mapDispatchToProps(dispatch: any) {
    return {
        userLoginRequest: (loggingIn: boolean) => userLoginRequest(loggingIn)(dispatch),
        userLoginSuccess: (user: ICredential, loggedIn: boolean) => userLoginSuccess(user, loggedIn)(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GitHubButton);
