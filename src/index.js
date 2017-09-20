/* for es6 generator functions in react sagas */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import saga from './state/saga';

import storeCreator from './state/store';

import getInitialState from './state/initialState';

// The initial state of the App
const initialState = getInitialState('root');


const config = {
  apiKey: "AIzaSyD-OIFGUCzyuJoVbAM8s9Dt8otAPlW-ZWI",
  authDomain: "product-library.firebaseapp.com",
  databaseURL: "https://product-library.firebaseio.com",
  projectId: "product-library",
  storageBucket: "product-library.appspot.com",
  messagingSenderId: "841123931115"
};


/* initialize stuff */
const store = storeCreator(initialState);
store.runSaga(saga);

firebase.initializeApp(config);

// När firebase märker att man loggat in via cookie eller via faktisk inloggning, alternativt loggat ut kommer
// denna att callas.
firebase.auth().onAuthStateChanged(function(user) {
  const providerMapping = {
    "google.com": 'google'
  };

  // User is signed in.
  if (user) {

/*  loginProvider behövs bara för att anonyma konton kan tas bort ASAP,
    medan e.g. google konton måste återverifieras, (reloggin)
    Jag vill kunna spegla detta i UI mha loginProvider state.
    uid, firebase userid, används för att spara Data till DB.
*/  
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
