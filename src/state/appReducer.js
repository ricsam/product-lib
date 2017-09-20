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

/* this is both the "root reducer" and the "app reducer",
   since both are small I choose to combine them */
export default function reducer(state = initialState, action) {
  return state

    .set('login', loginReducer(state.get('login'), action))
    .set('products', productsReducer(state.get('products'), action))

    /* app reducer part */
    .set('pageLoading', pageLoading(state.get('pageLoading'), action))
    .set('editItem', editItem(state.get('editItem'), action));
}

