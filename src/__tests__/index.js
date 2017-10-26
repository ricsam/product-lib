import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '../containers/App';

import saga from '../state/saga';

import storeCreator from '../state/store';
import getInitialState from '../state/initialState';

// The initial state of the App
const initialState = getInitialState();
const store = storeCreator(initialState);

store.runSaga(saga);


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
});

it('can dispatch action without crashing', () => {
  store.dispatch({type: 'fb:login', loginProvider: 'anon'});
});
