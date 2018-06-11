import * as React from 'react';
// import { IBrick } from '../../types';
import './style.css';

export interface IProps {
	addBrick?: () => void,
}


export default class Bricks extends React.Component<IProps, object> {

	public componentWillMount() {
		//
	}

	public render() {
		return (
			<div className="columns add-brick">
				<div className="column">
					<form className="field">
						<div className="field">
							<label className="label">GitHub Issue Link</label>
							<div className="control has-icons-left">
								<input className="input" type="text" placeholder="GitHub Link" />
								<span className="icon is-small is-left">
									<i className="fas fa-link" />
								</span>
							</div>
						</div>
						<div className="field">
							<label className="label level">Title
							</label>
							<div className="control has-icons-left">
								<input className="input" type="text" placeholder="Title" />
								<span className="icon is-small is-left">
									<i className="fa fa-user" />
								</span>
							</div>
						</div>
						<div className="field">
							<label className="label level">Description
							</label>
							<div className="control has-icons-left">
								<textarea className="textarea" placeholder="Brief Description" />
							</div>
						</div>
						<div className="level">
							<div className="field">
								<label className="label">ETH Value</label>
								<div className="control has-icons-left">
									<input className="input" type="text" placeholder="ETH" />
									<span className="icon is-small is-left">
										<i className="fab fa-ethereum" />
									</span>
								</div>
							</div>
						</div>
						<button className="button is-info" type="submit">Add Your Brick</button>
					</form>
				</div>
			</div>
		);
	}
}
