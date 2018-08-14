import { Button, Col, Icon, Modal, Popover, Row } from 'antd';
import { History } from "history";
import * as React from "react";
import logo from "../../logo.svg";
import { enquireScreen, getLocalizedPathname } from './../../utils';
import GitHubButton from "./GithubButton";


import RpcService from "../../services/RpcService";
import "./Nav.css";

interface IProps {
  history?: History | undefined;
}

// tslint:disable-next-line:no-console
// const onSuccess = (response) => console.log(response);
export default class Nav extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);

    this.state = this.state || {
      menuMode: 'horizontal',
    };
    this.addBrick = this.addBrick.bind(this);
    this.home = this.home.bind(this);
    this.handleShowMenu = this.handleShowMenu.bind(this);
    this.onMenuVisibleChange = this.onMenuVisibleChange.bind(this);
  }

  public componentDidMount() {
    enquireScreen((b: any) => {
      this.setState({ menuMode: b ? 'inline' : 'horizontal' });
    });
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

  public handleShowMenu() {
    this.setState({
      menuVisible: true,
    });
  };

  public onMenuVisibleChange(visible: boolean) {
    this.setState({
      menuVisible: visible,
    });
  };

  public render() {
    const { menuVisible, menuMode } = this.state;

    const items = <div className="header-menu-content">
      <div className="nav-item right">
        {this.props.children}
      </div>
      <div className="nav-item right">
        <Button htmlType="button" onClick={this.addBrick} type="primary"> Add a Brick </Button>
      </div>

      <div className="nav-item right">
        <GitHubButton />
      </div>
    </div>;

    return (
      <div className="header-wrapper app-body">
        {menuMode === 'inline' ? (
          <Popover
            openClassName="menu-popover"
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={items}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter={true}
            onVisibleChange={this.onMenuVisibleChange}
            style={{ minHeight: 120 }}
          >
           <i className="fas fa-bars nav-phone-icon" onClick={this.handleShowMenu} />
            {/* <Icon className="nav-phone-icon" type="profile" onClick={this.handleShowMenu} /> */}
          </Popover>
        ) : null}
        <Row >
          <Col xxl={6} xl={8} lg={8} md={12} sm={24} xs={24}>
            <a href="javascript:;" onClick={this.home} className="logo-wrap">
              <img src={logo} className="App-logo" alt="logo" />
              <h1>WeBuild.World</h1>
            </a>
          </Col>
          <Col xxl={18} xl={16} lg={16} md={12} sm={0} xs={0}>
            {menuMode === 'inline' ? null : (items)}
          </Col>
        </Row>
      </div>
    );
  }
}
