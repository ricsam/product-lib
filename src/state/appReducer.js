import { fromJS } from 'immutable';
import getInitialState from './initialState';
import loginReducer from './loginReducer';
import productsReducer from './productsReducer';

const initialState = fromJS(getInitialState('app'));

const editItem = (editItem = initialState.get('editItem'), action) => { /* the whole app reducer #2 */
  if (action.type === 'app:editItem') {
    return action.item;
  } else if (
    action.type === 'app:closeEdit' ||
    action.type === 'fb:upload' /* in case fb:upload is used elsewhere other than at modal close then remove this */
  ) {
    return '';
  } else {
    return editItem;
  }
};

const pageLoading = (pageLoading = initialState.get('pageLoading'), action) => { /* the whole app reducer #1 */
  /* pageLoading is true by initialState,
     thereafter is set to false when any of these actions are dispatched */
  if (action.type === 'fb:logged in' || action.type === 'fb:logged out') {
    return false;
  }
  return pageLoading;
};

const _cache = {
  login: {
    types: {
      "fb:set credential": true,
      "fb:logged in": true,
      "fb:logged out": true,
      "fb:logout": true,
      "fb:login": true,
      "fb:login error": true,
      "fb:logout error": true,
    },
    useLast: false,
    data: {},
  },
  products: {
    types: {
      "fb:logged in": true,
      "fb:logged out": true,
      "fb:db loaded": true,
      "fb:db error": true,
      "fb:upload": true,
      "fb:upload completed": true,
      "fb:upload error": true,
    },
    useLast: false,
    data: {},
  },
  pageLoading: {
    types: {
      "fb:logged in": true,
      "fb:logged out": true,
    },
    useLast: false,
    data: {},
  },
  editItem: {
    types: {
      "app:editItem": true,
      "app:closeEdit": true,
      "fb:upload": true,
    },
    useLast: false,
    data: {},
  }
};

const cache = (state, action, key, reducer) => {

  /* 20, 14 us */
  // return reducer(state.get(key), action);

  /* if the reducer will not change the state based on this action:
     then return the last value recieved from the reducer */
  if (_cache[key].useLast !== false && _cache[key].types[action.type] !== true) {
    return _cache[key].data;
  }
  if (_cache[key].useLast === false) {
    _cache[key].useLast = true;
  }
  _cache[key].data = reducer(state.get(key), action);
  return _cache[key].data;
};

/* this is both the "root reducer" and the "app reducer",
   since both are small I choose to combine them */
export default function reducer(state = initialState, action) {
  return state

    .set('login', cache(state, action, 'login', loginReducer))
    .set('products', cache(state, action, 'products', productsReducer))

    /* app reducer part */
    .set('pageLoading', cache(state, action, 'pageLoading', pageLoading))
    .set('editItem', cache(state, action, 'editItem', editItem));
}

