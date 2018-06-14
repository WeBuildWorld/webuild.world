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
    getBricks: (start: number = 0, length: number = 10) =>
      actions.retrieveBricks(start, length)(dispatch)
  };
}

export default connect<IProps>(
  mapStateToProps,
  mapDispatchToProps
)(Bricks);
