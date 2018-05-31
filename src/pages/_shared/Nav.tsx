import { Component } from "react";
import React from "react";
import logo from '../../logo.svg';
import './Nav.css';

export default class Nav extends Component {
	public render() {
		return (
			<nav className="navbar is-fixed-top level">
				<div className="navbar-brand">
					<a href="https://webuild.world/" className="navbar-item">
						<img src={logo} className="App-logo" alt="logo" />
						<h1>WeBuild.World</h1>
					</a>
					<a role="button" className="navbar-burger is-expanded burger" data-target="navbarExampleTransparentExample" aria-label="menu"
						aria-expanded="false">
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
									<a className="bd-tw-button button is-info">
										<span>Add a Brick</span>
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
