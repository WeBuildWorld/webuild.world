import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IBrick, IStoreState } from "../../types";
import * as actions from "./action";
import Bricks, { IProps } from "./component";

export function mapStateToProps({
  reducer
}: {
    reducer: { app: IStoreState };
  }) {
  return {
    brickCount: reducer.app.brickCount,
    bricks: reducer.app.bricks
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BrickAction>) {

  return {
    acceptWork: (brickId: number, winnerAddress: string) =>
      actions.acceptWorkForBrick(brickId, winnerAddress)(dispatch),
    cancelBrick: (brickId: number) =>
      actions.cancelBrick(brickId)(dispatch),
    getBricks: (start: number = 0, length: number = 10) =>
      actions.retrieveBricks(start, length)(dispatch),
    getMoreBricks: (start: number = 0, length: number = 10) =>
      actions.retrieveMoreBricks(start, length)(dispatch),
    onBricksChanged: (bricks: IBrick[]) =>
      actions.onBricksChanged(bricks)(dispatch),
    removeHash: () =>
      actions.removeHash()(dispatch),
    startWork: (brickId: number) =>
      actions.startWorkForBrick(brickId)(dispatch),
  };
}

export default connect<IProps>(
  mapStateToProps,
  mapDispatchToProps
)(Bricks);
