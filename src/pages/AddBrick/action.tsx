import * as constants from '../../constants'

export interface IAddBrick {
	type: constants.ADD_BRICK;
}

export type BrickAction = IAddBrick; // | ;

export function addBrick(): IAddBrick {
	return {
		type: constants.ADD_BRICK
	}
}
