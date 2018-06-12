import { Dispatch } from 'redux';
import * as constants from '../../constants'

export interface IAddBrick {
	type: constants.ADD_BRICK | constants.GET_PAGE_TITLE
}

export type AddBrickAction = Promise<IAddBrick>; // | ;

export function addBrick() {
	alert('Now let\'s call smart contract.');
	return async (dispatch: Dispatch<IAddBrick>) => {
		dispatch({
			type: constants.ADD_BRICK,
		});
	};
}

export function getPageTitle(url: string) {
	alert('Hello')
	return async (dispatch: any) => {
		const body = await fetch(url, { mode: 'no-cors' });
		return body;
	};
}
