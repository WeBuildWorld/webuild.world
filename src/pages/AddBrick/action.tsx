import { Dispatch } from 'redux';
import * as constants from '../../constants'

export interface IAddBrick {
	type: constants.ADD_BRICK;
}

export type AddBrickAction = Promise<IAddBrick>; // | ;

export function addBrick() {
	return async (dispatch: Dispatch<IAddBrick>) => {
		dispatch({
			type: constants.ADD_BRICK,
		});
	};
}
