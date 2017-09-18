import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '../containers/App';

import saga from '../state/saga';

import storeCreator from '../state/store';

// The initial state of the App
const initialState = {

  pageLoading: true, /* as it is loading in the beginning */

  uid: '', /* falsy or id <String> */
  loginProvider: '', /* anon, google or github available */

  logoutLoading: false,
  logoutError: false,

  loginLoading: false,
  loginError: false,

  products: [],

  /* different assets that will load or maybe generate error */
  addProductLoading: false, /* CREATE */
  productsLoading: false, /* READ */
  updateProductLoading: false, /* UPDATE */
  removeProductLoading: false, /* DELETE */
  /* pretty good to have errors for every action, ... */
  addProductError: false,
  productsError: false,
  updateProductError: false,
  removeProductError: false,

};
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
