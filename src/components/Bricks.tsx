import * as React from 'react';
import { IBrick } from '../types';
import './Bricks.css';

export interface IProps {
	brickCount: number;
	bricks?: IBrick[];
	getBricks?: () => void,
}

export default class Bricks extends React.Component<IProps, object> {
	public render() {
		const { brickCount, bricks = 1 } = this.props;

		if (bricks <= 0) {
			throw new Error('You are here too early. :D');
		}

		return (
			<div className="hello">
				<div className="greeting">
					Total {brickCount} bricks.
				</div>
			</div>
		);
	}
}
