import {
  ADD_BRICK, CANCEL_BRICK, GET_BRICKS,
  LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
  LOGOUT, REMOVE_HASH, START_WORK, STORAGE_SAVE
} from "../constants";
import { IStoreState } from "../types";

const defaultState: IStoreState = {
  brickCount: 0,
  bricks: []
};

export default function (
  state: IStoreState = defaultState,
  action: any
): IStoreState {
  switch (action.type) {
    case STORAGE_SAVE: {
      break;
    }
    case GET_BRICKS:
    case ADD_BRICK:
    case START_WORK:
    case CANCEL_BRICK:
    case LOGIN_REQUEST:
    case LOGIN_SUCCESS:
    case REMOVE_HASH:
    case LOGIN_FAILURE: {
      return { ...state, ...action.payload };
    }
    case LOGOUT: {
      return { ...state };
    }
  }

  return state;
}
