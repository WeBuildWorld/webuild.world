import { IStoreState } from './types';

import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
// import storage, { createMiddleware } from 'redux-storage';
// import createEngine from 'redux-storage-engine-cookies';
import reduxThunk from 'redux-thunk';

// import { composeWithDevTools } from 'redux-devtools-extension';

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
		loggerMiddleware,
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

export { store, history, mergeProps };
