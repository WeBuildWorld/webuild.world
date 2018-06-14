import * as constants from "../../constants";
import { getBricks } from "../../services/BrickService";
import { IBrick } from "../../types";

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
    return dispatch({
      payload,
      type: constants.GET_BRICKS
    });
  };
}
