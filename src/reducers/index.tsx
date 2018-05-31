import { BrickAction } from '../actions';
import { GET_BRICKS } from '../constants';
import { Bricks } from '../mock';
import { IStoreState } from '../types/index';

const defaultState: IStoreState = {
	brickCount: 0,
	bricks: [],
};

export default function (state: IStoreState = defaultState, action: BrickAction): IStoreState {
	switch (action.type) {
		case GET_BRICKS:
			return { ...state, brickCount: Bricks.length, bricks: Bricks };
	}

	return state;
}
