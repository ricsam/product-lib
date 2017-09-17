/* for es6 generator functions in react sagas */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';


import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


import saga from './state/saga';

import storeCreator from './state/store';

// The initial state of the App
const initialState = {

  pageLoading: true, /* as it is loading in the beginning */

  uid: '', /* falsy or id <String> */
  loginProvider: '', /* anon, google or github available */

  logoutLoading: false,
  logoutError: false,

  loginLoading: false,
  loginError: false,

  products: {},
  productsLoading: false, /* READ */
  productsError: false,

};

const config = {
  apiKey: "AIzaSyD-OIFGUCzyuJoVbAM8s9Dt8otAPlW-ZWI",
  authDomain: "product-library.firebaseapp.com",
  databaseURL: "https://product-library.firebaseio.com",
  projectId: "product-library",
  storageBucket: "product-library.appspot.com",
  messagingSenderId: "841123931115"
};

const store = storeCreator(initialState);

store.runSaga(saga);




firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  const providerMapping = {
    "google.com": 'google'
  };
  if (user) {
    // User is signed in.
    store.dispatch({
      type: "fb:logged in",
      uid: user.uid,
      loginProvider: user.providerData.length ? providerMapping[user.providerData[0].providerId] : 'anon'
    });
  } else {
    // User is signed out.
    store.dispatch({
      type: "fb:logged out",
    });
  }
});



ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
