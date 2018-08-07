import * as React from "react";

import axios from "axios";
import GitHubLogin from 'react-github-login';


export default class GitHubButton extends React.Component {

    public state: any;
    constructor(props: any) {
        super(props);
        this.state = { logged: false, avatar: "" };
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick() {
        this.setState((prevState: any) => {
            return { logged: !prevState.logged };
        });
    }

    public onSuccess(response: any) {
        // tslint:disable-next-line:no-console 
        console.log('response:', response);
        const self = this;
        if (response && response.code) {
            axios.post('login/oauth/access_token', {
                "client_id": "36d1aa5652f688cde83b",
                "client_secret": "c33eb8e1c3633fa7061eb58abf246fcd1446131d",
                "code": response.code,
                "redirect_uri": "https://webuild.world/"
            }).then((res) => {
                axios.get('user?' + res.data).then((result) => {
                    const data = result.data;
                    // tslint:disable-next-line:no-console
                    console.log('email:', data.email);
                    self.setState({ logged: true, avatar: data.avatar_url, email: data.email });
                });
                // tslint:disable-next-line:no-console 
                console.log('res:', res);
            });
        }
    }
    public render() {
        return (
            <div>
                {this.state.logged ? <img alt={this.state.email}
                    className="avatar float-left mr-1"
                    src={this.state.avatar} /> : <GitHubLogin onSuccess={this.onSuccess.bind(this )}
                        visible={false}
                        className="bd-tw-button button"
                        clientId='36d1aa5652f688cde83b'
                        redirectUri="https://webuild.world"
                        scope="user.email"
                    />}
            </div>
        );
    }
}