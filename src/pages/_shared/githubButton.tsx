import * as React from "react";
import { connect, Dispatch } from "react-redux";

import axios from "axios";
import GitHubLogin from 'react-github-login';
import { ICredential, IStoreState } from "../../types";

import { LOGIN_REQUEST, LOGIN_SUCCESS } from "../../constants";
import { Authentication } from "../../services/Authentication";
const CLIENT_ID = "36d1aa5652f688cde83b";
const CLIENT_SECRET = "c33eb8e1c3633fa7061eb58abf246fcd1446131d";
const REDIRECT_URL = "https://webuild.world";

export class GitHubButton extends React.Component {

    public state: any;
    constructor(props: any) {
        super(props);

        // tslint:disable-next-line:no-console
        console.log('props:', props);
        const user = Authentication.getCurrentUser();
        if (user) {
            this.state = { logged: true, avatar: user.avatar_url };
        } else {
            this.state = { logged: false, avatar: "" };
        }

        this.handleClick = this.handleClick.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFakeSuccess = this.onFakeSuccess.bind(this);
    }

    public handleClick() {
        this.setState((prevState: any) => {
            return { logged: !prevState.logged };
        });
    }

    public onFakeSuccess(response: any) {

        const data: ICredential = {
            email: 'vellengs@qq.com',
            githubId: '5743338',
            name: 'viking',
        };

        Authentication.setCurrentUser(data);
        this.setState({ logged: true, avatar: data.avatar_url, email: data.email });
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
        const image = <img alt={this.state.email}
            className="avatar float-left mr-1"
            src={this.state.avatar} />;

        const button = <GitHubLogin
            onSuccess={this.onSuccess}
            visible={false}
            className="bd-tw-button button"
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

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        userLoginRequest: (loggingIn: boolean) => userLoginRequest(loggingIn)(dispatch),
        userLoginSuccess: (user: ICredential, loggedIn: boolean) => userLoginSuccess(user, loggedIn)(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GitHubButton);
