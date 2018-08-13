import { Button, Col, Modal, Row, } from 'antd';
import { History } from "history";
import * as React from "react";
import logo from "../../logo.svg";
import GitHubButton from "./GithubButton";

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

  public addBrick(e: any) {
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
    this.props.history!.push("/add-brick");
  }

  public home() {
    this.props.history!.push("/");
  }

  public render() {
    return (
      <Row >
        <Col span={8}>
          <a href="javascript:;" onClick={this.home} className="logo-wrap">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>WeBuild.World</h1>
          </a>
        </Col>
        <Col span={16}>
          <div className="nav-item right">
            {this.props.children}
          </div>

          <div className="nav-item right">
            <Button htmlType="button" onClick={this.addBrick} type="primary"> Add a Brick </Button>
          </div>

          <div className="nav-item right">
            <GitHubButton />
          </div>

        </Col>
      </Row>
    );
  }
}
