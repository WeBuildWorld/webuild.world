import "babel-polyfill";
import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, Router, Switch } from "react-router";
import NetworkStatus from "react-web3-network-status";
import "./App.css";
import Nav from "./pages/_shared/Nav";
import AddBrick from "./pages/AddBrick";
import Bricks from "./pages/Bricks";

const history = createBrowserHistory();
class App extends React.Component {
  public render() {
    return (
      <Router history={history}>
        <div className="App">
          <Nav history={history}>
            <NetworkStatus />
          </Nav>
          <div className="container">
            <Switch>
              <Route exact={true} path="/" component={Bricks} />
              <Route exact={true} path="/hash/:hash?" component={Bricks} />
              <Route path="/add-brick" component={AddBrick} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
