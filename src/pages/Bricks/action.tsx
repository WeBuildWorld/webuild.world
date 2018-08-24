import * as constants from "../../constants";
import { Authentication } from "../../services/Authentication";
import { acceptWork, cancel, getBricks, startWork } from "../../services/BrickService";
import { IBrick, ICredential } from "../../types";

export interface IGetBricks {
  type: constants.GET_BRICKS;
  payload: {
    totalCount: number;
    bricks: IBrick[];
  };
}

export type BrickAction = IGetBricks;

export function retrieveBricks(start: number, length: number) {
  return async (dispatch: any): Promise<IGetBricks> => {
    const payload = await getBricks(start, length);

    // tslint:disable-next-line:no-console
    console.log('getMore', payload);

    return dispatch({
      payload,
      type: constants.GET_BRICKS
    });
  };
}

export function retrieveMoreBricks(start: number, length: number) {
  return async (dispatch: any): Promise<IGetBricks> => {
    const payload = await getBricks(start, length);

    return dispatch({
      payload,
      type: constants.GET_MORE_BRICKS
    });
  };
}

export function onBricksChanged(bricks: IBrick[]) {
  return async (dispatch: any) => {
    const payload = {
      brickCount: bricks.length,
      bricks,
    }

    // tslint:disable-next-line:no-console
    console.log('bricks... ', payload);

    return dispatch({
      payload,
      type: constants.ON_BRICKS_CHANGED
    });
  };
}

export function startWorkForBrick(
  brickId: number,
) {
  return async (dispatch: any): Promise<void> => {
    const user: ICredential = Authentication.getCurrentUser();
    const githubIdAndUserName = Authentication.getGithubIdAndName(user);
    const result = await startWork(brickId, githubIdAndUserName, user.name!);
    return dispatch({
      payload: { result },
      type: constants.START_WORK
    });
  };
}


export function cancelBrick(
  brickId: number,
) {
  return async (dispatch: any): Promise<void> => {
    const result = await cancel(brickId);
    return dispatch({
      payload: { result },
      type: constants.CANCEL_BRICK
    });
  };
}

export function removeHash() {
  return async (dispatch: any): Promise<void> => {
    return dispatch({
      payload: { hash: null },
      type: constants.REMOVE_HASH
    });
  };
}


export function acceptWorkForBrick(
  brickId: number,
  winnerWalletAddress: string
) {
  return async (dispatch: any): Promise<void> => {
    const result = await acceptWork(brickId, winnerWalletAddress);
    return dispatch({
      payload: { result },
      type: constants.ACCEPT_WORK
    });
  };
}
