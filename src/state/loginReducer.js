import { fromJS } from 'immutable';
import getInitialState from './initialState';


const initialState = fromJS(getInitialState('login'));


export default function reducer(state = initialState, action) {
  switch (action.type) {

    /* set during login and is used when deleting an account */
    case "fb:set credential":
      return state
        .set('credential', action.credential);

    case "fb:logged in":
      /* resetar alla errors o sånt (lite redundant),
         samt påbörjar nedladdning av produkterna från DB */
      return state
        .set('uid', action.uid)
        .set('loginProvider', action.loginProvider) /* e.g. google or github or just anon, set from index.js */
        .set('loginLoading', false)
        .set('loginError', false)

    case "fb:logged out":
      /* resetar allt till inital state */
      return initialState;

    case 'fb:logout':
      // påbörjar utloggning
      return state
        .set('logoutLoading', true)
        .set('logoutError', false);

    case "fb:login":
      // påbörjar inloggning
      return state
        .set('loginLoading', true)
        .set('loginProvider', action.loginProvider) /* e.g. google or github or just anon, set from App.js */
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
