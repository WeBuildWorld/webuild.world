import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IBrick, IStoreState } from "../../types";
import * as actions from "./action";
import BrickDetail from "./component";

export function mapStateToProps({
    reducer
}: {
        reducer: { app: IStoreState };
    }) {
    return {
        account: reducer.app.account,
        brickCount: reducer.app.brickCount,
        bricks: reducer.app.bricks,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {

    };
}

export default connect<any>(
    mapStateToProps,
    mapDispatchToProps
)(BrickDetail);
