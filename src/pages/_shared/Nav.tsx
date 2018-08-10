import { Button,   Modal, } from 'antd';
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
      <div className="ant-row">
        <div className="logo-wrap ant-col-xs-24 ant-col-sm-24 ant-col-md-6 ant-col-lg-5 ant-col-xl-5 ant-col-xxl-4">
          <a href="javascript:;" onClick={this.home} className="navbar-item">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>WeBuild.World</h1>
          </a>
        </div>
        <div className="ant-col-xs-0 ant-col-sm-0 ant-col-md-18 ant-col-lg-19 ant-col-xl-19 ant-col-xxl-20">
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px', display: 'none' }}  >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu> */}

          <div className="nav-item right">
            {this.props.children}
          </div>

          <div className="nav-item right">
            <Button htmlType="button" onClick={this.addBrick} type="primary"> Add a Brick </Button>
          </div>

          <div className="nav-item right">
            <GitHubButton />
          </div>

        </div>
      </div>
    );
  }

  // public render() {
  //   return (
  //     <nav className="navbar is-fixed-top level">
  //       <div className="navbar-brand">
  //         <a href="javascript:;" onClick={this.home} className="navbar-item">
  //           <img src={logo} className="App-logo" alt="logo" />
  //           <h1>WeBuild.World</h1>
  //         </a>
  //         <a
  //           role="button"
  //           className="navbar-burger is-expanded burger"
  //           data-target="navbarExampleTransparentExample"
  //           aria-label="menu"
  //           aria-expanded="false"
  //         >
  //           <span aria-hidden="true" />
  //           <span aria-hidden="true" />
  //           <span aria-hidden="true" />
  //         </a>
  //       </div>
  //       <div id="navbarExampleTransparentExample" className="navbar-menu">
  //         {/* <div className="navbar-start">
  // 					<a className="navbar-item hidden" href="#">Home</a>
  // 				</div> */}
  //         <div className="navbar-end">
  //           <div className="navbar-item">
  //             <div className="field is-grouped">


  //               <p className="control">
  //                 <GitHubButton />
  //               </p>

  //               <p className="control">
  //                 <a
  //                   className="bd-tw-button button is-primary"
  //                   onClick={this.addBrick}
  //                 >
  //                   <span>Add a Brick</span>
  //                 </a>
  //               </p>

  //               {this.props.children}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </nav>
  //   );
  // }
}
