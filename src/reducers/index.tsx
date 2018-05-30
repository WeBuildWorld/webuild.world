import { BrickAction } from '../actions';
import { GET_BRICKS } from '../constants';
import { Bricks } from '../mock';
import { IStoreState } from '../types/index';

export function bricks(state: IStoreState, action: BrickAction): IStoreState {
	switch (action.type) {
		case GET_BRICKS:
			return { ...state, brickCount: Bricks.length, bricks: Bricks };
	}
	return state;
}
