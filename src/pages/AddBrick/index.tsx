import { connect, Dispatch } from 'react-redux';
import { IStoreState } from '../../types/';
import * as actions from './action';
import AddBrick, { IProps } from './component';

export function mapStateToProps({ reducer }: { reducer: { app: IStoreState } }) {
	return {

	};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.IAddBrick>) {
	return {
		addBrick: () => actions.addBrick()(dispatch),
		getPageTitle: (e: React.FocusEvent<HTMLInputElement>) =>
			actions.getPageTitle(e.target.value)(dispatch),
	};
}

export default connect<IProps>(mapStateToProps, mapDispatchToProps)(AddBrick);
