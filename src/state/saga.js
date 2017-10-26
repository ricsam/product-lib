import { takeEvery, takeLatest, call, put, select } from 'redux-saga/effects';
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
    return false;
  } else {
    const provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const result = await firebase.auth().signInWithPopup(provider);
    return result.credential;
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
        const credential = yield call(loginGoogle)
        if (credential) {
          yield put({
            type: "fb:set credential",
            credential
          });
        }
        break;
      default: return;
    }
  } catch (error) {
    yield put({
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
    console.log(error);
    yield put({
      type: "fb:logout error",
      message: error.message
    });
  }
  // OBS: an action will automatically be dispatched from index.js via firebase.auth().onAuthStateChanged 
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

  try {
    const products = yield call(fbLoadDB, uid);
    yield put({
      type: 'fb:db loaded',
      products,
    });
  } catch(error) {
    console.log(error);
    yield put({
      type: 'fb:db error',
      message: error.message,
    });
  }
}

function fbGetRef() {
  const user = firebase.auth().currentUser,
        uid = user.uid,
        db = firebase.database();

  return db.ref('products/' + uid);
}

async function addProduct(id, data) {
  const ref = fbGetRef();
  await ref.child(id).set(data);
}

async function removeProduct(id) {
  const ref = fbGetRef();
  await ref.child(id).remove();
}

export function* upload(action) {
  try {
    switch(action.operation) {
      case 'add':
        yield call(addProduct, action.id, action.data);
      break;
      case 'update': /* fungerar på precis samma sätt som add */
        yield call(addProduct, action.id, action.data);
      break;
      case 'delete':
        yield call(removeProduct, action.id);
      break;

      default: return;
    }
    yield put({
      type: 'fb:upload completed',
      id: action.id,
      operation: action.operation
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: 'fb:upload error',
      operation: action.operation,
      message: error.message
    })
  }
}

// man måste reauthenticata för att kunna deleta ibland.
async function fbRemoveUser(credential) {
  const user = firebase.auth().currentUser;
  try {
    await user.delete()
  } catch(error) {
    if ( ! error.code === 'auth/requires-recent-login' ) console.log(error);
    if (error.code === 'auth/requires-recent-login') {
      try {
        /* user must reloggin */
        if ( ! credential ) {
          return;
        }
        await user.reauthenticateWithCredential(credential);
        await user.delete();
      } catch(error) {
        console.log(error);
      }
    }
  } 
}

// denna funktion kommer från index.js att dispatcha logout action.
function* deleteUser() {
  const credential = yield select(state => state.get('login').get('credential') || false);
  yield call(fbRemoveUser, credential);
}


export function* saga() {
  yield takeLatest('fb:delete user', deleteUser);
  yield takeLatest('fb:login', login);
  yield takeLatest('fb:logout', logout);
  // kommer dispatchas från index.js via firebase.auth().onAuthStateChanged
  yield takeLatest('fb:logged in', getDB);

  yield takeEvery('fb:upload', upload);
}

export default saga;