import 'bulma/css/bulma.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrickAction } from './actions';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store } from './store';
import { IStoreState } from './types';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root') as HTMLElement
);

registerServiceWorker();
