import { Col,Layout,Row } from 'antd';
import "babel-polyfill";
import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, Router, Switch } from "react-router";
import NetworkStatus from "react-web3-network-status";
import "./App.css";
import Nav from "./pages/_shared/Nav";
import AddBrick from "./pages/AddBrick";
import BrickDetail from "./pages/BrickDetail";
import Bricks from "./pages/Bricks";
import Dashboard from './pages/Dashboard';

const { Header, Content, Footer } = Layout;

const history = createBrowserHistory();
class App extends React.Component {
  public render() {
    return (
      <Layout>
        <Router history={history}>
          <Content className="App">
            <Header style={{ position: 'fixed', zIndex: 1001, width: '100%', padding: 0 }}>
              <Nav history={history}>
                <NetworkStatus />
              </Nav>
            </Header>
            <Switch>
              <Route path="/dashboard" component={Dashboard} /> 
              <Route exact={true} path="/" component={Bricks} />
              <Route exact={true} path="/hash/:hash?" component={Bricks} />
              <Route exact={true} path="/brick/:hash?" component={BrickDetail} />
              <Route path="/add-brick" component={AddBrick} />
            </Switch>
          </Content>
        </Router>
        <Footer>
          <Row type="flex" justify="center" align="middle">
              <Col className="links">
                <a target="_blank" href="https://github.com/WeBuildWorld/webuild.world">
                  <i className="fab fa-github" /> Github
                </a>
                <a target="_blank" href="https://twitter.com/webuildworld">
                  <i className="fab fa-twitter" /> Twitter
                </a>
                <a target="_blank" href="https://medium.com/webuildworld">
                  <i className="fab fa-medium" /> Medium
                </a>
                <a target="_blank" href="https://t.me/WebuildWorld">
                  <i className="fab fa-telegram" /> Telegram
                </a>
              </Col>
            </Row>
        </Footer>
      </Layout>
    );
  }
}

export default App;
