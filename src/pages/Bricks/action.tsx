import * as constants from '../../constants'

export interface IGetBricks {
	type: constants.GET_BRICKS;
}

export type BrickAction = IGetBricks; // | ;

export function getBricks(): IGetBricks {
	return {
		type: constants.GET_BRICKS
	}
}
