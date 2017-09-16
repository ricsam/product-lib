/**
 * Gets the repositories of the user from Github
 */

import { takeLatest, call, put } from 'redux-saga/effects';
import firebase from 'firebase/app';

async function loginAnon() {
  if (firebase.auth().currentUser) {
    await firebase.auth().signOut();
  } else {
    await firebase.auth().signInAnonymously()
  } 
}

async function loginGoogle() {
  if (firebase.auth().currentUser) {
    await firebase.auth().signOut();
  } else {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const result = await firebase.auth().signInWithPopup(provider);
  }
}

export function* login(action) {
  const {loginProvider} = action;
  try {
    switch (loginProvider) {
      case 'anon':
        yield call(loginAnon)
        break;
      case 'google':
        yield call(loginGoogle)
        break;
      default: return;
    }
  } catch (error) {
    put({
      type: "fb:login error",
      message: error.message
    });
  }
  // OBS: an action will automatically be dispatched from index.js via firebase.auth().onAuthStateChanged 
}

async function FBLogout() {
  await firebase.auth().signOut();
}

export function* logout() {
  try {
    yield call(FBLogout);
  } catch (error) {
    put({
      type: "fb:logout error",
      message: error.message
    });
  }
  // OBS: an action will automatically be dispatched from index.js via firebase.auth().onAuthStateChanged 
}

export function* deleteUser() {
  const user = firebase.auth().currentUser;
  yield call(user.delete);
}

/**
 * Root saga manages watcher lifecycle
 */
export function* saga() {
  yield takeLatest('fb:login', login);
  yield takeLatest('fb:logout', logout);
}

export default saga;