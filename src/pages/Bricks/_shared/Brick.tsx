import { Component } from "react";
import React from "react";
import { IBrick } from "../../../types";

export interface IProps {
	brick: IBrick;
}

export default class Brick extends React.Component<IProps, object> {
	public render() {
		const { brick } = this.props;

		if (brick === null) {
			return (<i>Brick is empty</i>);
		}

		return (
			<div className="brick">
				<h4>{brick.title}</h4>
				<desc>{brick.description}</desc>
				{brick.tags && brick.tags.map((tag) => <label key={tag}>{tag}</label>)}
			</div>
		);
	}
}
