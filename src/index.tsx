import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrickAction } from './actions';
import { bricks } from './reducers';
import { IStoreState } from './types';

const store = createStore<IStoreState, BrickAction, any, any>(bricks, {
	brickCount: 0,
	bricks: [],
});


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root') as HTMLElement
);

registerServiceWorker();
