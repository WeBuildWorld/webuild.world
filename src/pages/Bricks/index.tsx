import { connect, Dispatch } from 'react-redux';
import { IStoreState } from '../../types';
import * as actions from './action';
import Bricks, { IProps } from './component';

export function mapStateToProps({ reducer }) {
	return {
		brickCount: reducer.app.brickCount,
		bricks: reducer.app.bricks,
	};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BrickAction>) {
	return {
		getBricks: () => dispatch(actions.getBricks()),
	}
}

export default connect<IProps>(mapStateToProps, mapDispatchToProps)(Bricks);
