import * as constants from '../../constants';
import { addBrick } from '../../services/BrickService';
import { IBrick } from '../../types';

export function TestBrick(brick: IBrick) {
  return async (dispatch: any): Promise<number> => {
    const hash = await addBrick(brick);
    return dispatch({
      payload: { hash },
      type: constants.ADD_BRICK,
    });
  };
}
