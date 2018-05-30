import { connect, Dispatch } from 'react-redux';
import * as actions from '../actions/';
import Bricks, { IProps } from '../components/Bricks';
import { IStoreState } from '../types';

export function mapStateToProps({ brickCount, bricks }: IStoreState) {
	return {
		brickCount,
		bricks,
	}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BrickAction>) {
	return {
		getBricks: () => dispatch(actions.getBricks()),
	}
}

export default connect<IProps>(mapStateToProps, mapDispatchToProps)(Bricks);
