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
    await firebase.auth().signInWithPopup(provider);
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

async function fbLogout() {
  await firebase.auth().signOut();
}

export function* logout() {
  try {
    yield call(fbLogout);
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


async function fbLoadDB(uid) {
  const db = firebase.database();
  const ref = db.ref('products/' + uid);
  const snapshot = await ref.once('value');
  const data = {};

  if ( snapshot.exists() ) {
    Object.assign(data, snapshot.val());
  }
  return data;
}

export function* getDB(action) {
  const uid = action.uid;
  const products = yield call(fbLoadDB, uid);

  console.log(products);

  yield put({
    type: 'fb:db loaded',
    products
  });
}

export function* saga() {
  yield takeLatest('fb:login', login);
  yield takeLatest('fb:logout', logout);
  // kommer dispatchas från index.js via firebase.auth().onAuthStateChanged
  yield takeLatest('fb:logged in', getDB);
}

export default saga;