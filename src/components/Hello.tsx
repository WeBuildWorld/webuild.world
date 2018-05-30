import * as React from 'react';
import './Hello.css';

export interface IProps {
	name: string;
	enthusiasmLevel?: number;
}

export default class Hello extends React.Component<IProps, object> {
	public render() {
		const { name, enthusiasmLevel = 1 } = this.props;

		if (enthusiasmLevel <= 0) {
			throw new Error('You could be a little more enthusiastic. :D');
		}

		return (
			<div className="hello">
				<div className="greeting">
					Hello {name + getExclamationMarks(enthusiasmLevel)}
				</div>
			</div>
		);
	}
}

// helpers

function getExclamationMarks(numChars: number) {
	return Array(numChars + 1).join('!');
}
