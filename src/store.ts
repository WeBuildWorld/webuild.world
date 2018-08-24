import { IStoreState } from './types';

import * as constants from "./constants";

import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
// import storage, { createMiddleware } from 'redux-storage';
// import createEngine from 'redux-storage-engine-cookies';
import reduxThunk from 'redux-thunk';

// import { composeWithDevTools } from 'redux-devtools-extension';
import { getBrick, watchEvents } from "./services/BrickService";

// import { Hour } from './helpers/formatter';
import app from './reducers';

const history = createHistory();
const middleware = routerMiddleware(history);
const loggerMiddleware = createLogger();
// const engine = createEngine('WEBUILD.WORLD');
// const storageMiddleware = storage.createMiddleware(engine);

export interface IAppState {
	app: IStoreState;
}

export interface IStore {
	reducer: IAppState;
	router: any;
}

const reducer = combineReducers<IAppState>({
	app,
});

const store = createStore<IStore, any, any, any>(
	combineReducers({
		reducer,
		router: routerReducer,
	}),
	// composeWithDevTools(
	applyMiddleware(
		// storageMiddleware,
		// loggerMiddleware,
		reduxThunk.withExtraArgument(middleware),
	),
	// ),
);


// const load = storage.createLoader(engine);
// tslint:disable-next-line:no-console
// load(store).then((newState: IStore) => console.log('Loaded state:', newState));

// Required when merge Own Props with reducer props
const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
	return { ...ownProps, ...dispatchProps, ...stateProps };
};

watchEvents(async (brickId: any) => {
	const dispatch = store.dispatch;
	const brick = await getBrick(brickId);
	const items = store.getState().reducer.app.bricks || [];
	const bricks = [...items];
	const index = bricks.findIndex(
		(item: any) => {
			return item.id === brickId;
		});
	if (index > -1) {
		bricks[index] = brick;
	} else {
		bricks.unshift(brick);
	}

	const payload = {
		brickCount: bricks.length,
		bricks,
	}

	dispatch({
		payload,
		type: constants.ON_BRICKS_CHANGED
	});
});

export { store, history, mergeProps };
