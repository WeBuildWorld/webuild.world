import { Layout } from 'antd';
import "babel-polyfill";
import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, Router, Switch } from "react-router";
import NetworkStatus from "react-web3-network-status";
import "./App.css";
import Nav from "./pages/_shared/Nav";
import AddBrick from "./pages/AddBrick";
import Bricks from "./pages/Bricks";

const { Header, Content } = Layout;


const history = createBrowserHistory();
class App extends React.Component {
  public render() {
    return (
      <Layout>
        <Router history={history}>
          <div className="App">
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
              <Nav history={history}>
                <NetworkStatus />
              </Nav>
            </Header>
            <Content className="app-body" style={{ marginTop: 64 }}>
              <Switch>
                <Route exact={true} path="/" component={Bricks} />
                <Route exact={true} path="/hash/:hash?" component={Bricks} />
                <Route path="/add-brick" component={AddBrick} />
              </Switch>
            </Content>
          </div>
        </Router>
      </Layout>
    );
  }
}

export default App;
