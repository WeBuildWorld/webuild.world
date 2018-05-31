import * as React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/_shared/Nav';
import Bricks from './containers/Bricks';

class App extends React.Component {
	public render() {
		return (
			<div className="App">
				<Nav />
				<Bricks />
			</div>
		);
	}
}

export default App;
