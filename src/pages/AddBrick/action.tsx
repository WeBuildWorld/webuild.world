import * as constants from "../../constants";
import { addBrick } from "../../services/BrickService";
import { IBrick } from "../../types";

export interface IAddBrick {
  type: constants.ADD_BRICK | constants.GET_PAGE_TITLE;
}

export type AddBrickAction = Promise<IAddBrick>; // | ;

export function postBrick(brick: IBrick) {
  return async (dispatch: any): Promise<number> => {
    const payload = await addBrick(brick);
    return dispatch({
      payload,
      type: constants.ADD_BRICK
    });
  };
}

export function getPageTitle(url: string) {
  return async (dispatch: any) => {
    const body = await fetch(url, { mode: "no-cors" });
    return body;
  };
}
