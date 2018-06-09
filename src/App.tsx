import 'babel-polyfill';
import * as React from 'react';
import NetworkStatus from 'react-web3-network-status'
import './App.css';
import Nav from './pages/_shared/Nav';
import Bricks from './pages/Bricks';

class App extends React.Component {
	public render() {
		return (
			<div className="App">
				<Nav>
					<NetworkStatus />
				</Nav>
				<div className="container">
					<Bricks />
				</div>
			</div>
		);
	}
}

export default App;
