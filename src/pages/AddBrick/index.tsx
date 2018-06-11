import { connect, Dispatch } from 'react-redux';
import { IStoreState } from '../../types/';
import * as actions from './action';
import AddBrick, { IProps } from './component';

export function mapStateToProps({ reducer }: { reducer: { app: IStoreState } }) {
	return {

	};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BrickAction>) {
	return {
		addBrick: () => dispatch(actions.addBrick()),
	}
}

export default connect<IProps>(mapStateToProps, mapDispatchToProps)(AddBrick);
