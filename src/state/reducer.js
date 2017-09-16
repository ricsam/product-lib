import { fromJS } from 'immutable';

const initialState = fromJS({});

function reducer(state = initialState, action) {
  switch (action.type) {
    case "@@redux/INIT":
      /* initialize */
      return state;
    case "fb:logged in":
      return state
        .set('uid', action.uid)
        .set('loginLoading', false)
        .set('pageLoading', false)
        .set('loginError', false);

    case "fb:logged out":
      return state
        .set('uid', '')
        .set('loginProvider', '')
        .set('logoutLoading', false)
        .set('pageLoading', false)
        .set('logoutError', false);

    case 'fb:logout':
      return state
        .set('logoutLoading', true)
        .set('logoutError', false);

    case "fb:login":
      return state
        .set('loginLoading', true)
        .set('loginProvider', action.loginProvider) /* e.g. google or github or just anon */
        .set('loginError', false);

    case "fb:login error":
      return state
        .set('loginLoading', false)
        .set('loginProvider', '')
        .set('loginError', action.message);

    case "fb:logout error":
      return state
        .set('logoutLoading', false)
        .set('logoutError', action.message);

    default:
      return state;
  }
}

export default reducer;