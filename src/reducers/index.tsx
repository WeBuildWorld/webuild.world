import { ADD_BRICK, GET_BRICKS } from "../constants";
import { IStoreState } from "../types/index";

const defaultState: IStoreState = {
  brickCount: 0,
  bricks: []
};

export default function(
  state: IStoreState = defaultState,
  action: any
): IStoreState {
  switch (action.type) {
    case "REDUX_STORAGE_SAVE": {
      // delete state.bricks;
      break;
    }
    case GET_BRICKS:
      return { ...state, ...action.payload };
    case ADD_BRICK:
      return { ...state, ...action.payload };
  }

  return state;
}
