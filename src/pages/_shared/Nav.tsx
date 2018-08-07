import { History } from "history";
import * as React from "react";
import GitHubButton from "./githubButton";

import logo from "../../logo.svg";
import RpcService from "../../services/RpcService";
import "./Nav.css";

interface IProps {
  history?: History | undefined;
}

// tslint:disable-next-line:no-console
// const onSuccess = (response) => console.log(response);
export default class Nav extends React.Component<IProps, object> {
  constructor(props: IProps) {
    super(props);

    this.addBrick = this.addBrick.bind(this);
    this.home = this.home.bind(this);
  }

  public addBrick(e: React.SyntheticEvent<HTMLAnchorElement>) {
    if (!RpcService.hasMainAccount()) {
      e.currentTarget.text = "Metamask needed.";
      return;
    }
    this.props.history!.push("/add-brick");
  }

  public home() {
    this.props.history!.push("/");
  }

  public render() {
    return (
      <nav className="navbar is-fixed-top level">
        <div className="navbar-brand">
          <a href="javascript:;" onClick={this.home} className="navbar-item">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>WeBuild.World</h1>
          </a>
          <a
            role="button"
            className="navbar-burger is-expanded burger"
            data-target="navbarExampleTransparentExample"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div id="navbarExampleTransparentExample" className="navbar-menu">
          {/* <div className="navbar-start">
						<a className="navbar-item hidden" href="#">Home</a>
					</div> */}
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="field is-grouped">

                <p className="control">
                <GitHubButton />
                </p> 

                <p className="control">
                  <a
                    className="bd-tw-button button is-primary"
                    onClick={this.addBrick}
                  >
                    <span>Add a Brick</span>
                  </a>
                </p>

                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
