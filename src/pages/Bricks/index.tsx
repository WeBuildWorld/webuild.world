import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../types/";
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
    getBricks: (start: number = 0, length: number = 100) =>
      actions.retrieveBricks(start, length)(dispatch),
    startWork: (brickId: number) =>
      actions.startWorkForBrick(brickId, "", "")(dispatch)
  };
}

export default connect<IProps>(
  mapStateToProps,
  mapDispatchToProps
)(Bricks);
