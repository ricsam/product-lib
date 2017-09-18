/* for es6 generator functions in react sagas */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import saga from './state/saga';

/* initial state to the store is just {} */
import store from './state/store';
store.runSaga(saga);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
