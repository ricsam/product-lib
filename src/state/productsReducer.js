import { fromJS } from 'immutable';
import getInitialState from './initialState';

const initialState = fromJS(getInitialState('products'));

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "fb:logged in":
      /* resetar alla errors o sånt (lite redundant),
         samt påbörjar nedladdning av produkterna från DB */
      return state
        .set('productsLoading', true)
        .set('productsError', false);

    case "fb:logged out":
      /* resetar allt till inital state */
      return initialState;

    // den initiella nedladdningen av produktbiblioteket
    case "fb:db loaded":
      return state
        .set('productsLoading', false)
        .set('products', fromJS(action.products))
        .set('productsError', false);

    case "fb:db error":
      return state
        .set('productsLoading', false)
        .set('productsError', action.message);


    // CREATE, UPDATE, DELETE operations,
    // Pågående updateringar av en produkt trackas i state.products
    case "fb:upload":
      /* För delete så är det bara att "tagga" en product med status,
         medan för de andra operationsarna så vill vi även updatera datan */
      if (action.operation === 'delete') {
        return state
          .setIn(['products', action.id, 'status'], fromJS({operation: action.operation, state: 'uploading'}))
      } else {
        return state
          .setIn(['products', action.id], fromJS({...action.data, status: {operation: action.operation, state: 'uploading'}}))
      }

    case `fb:upload completed`:
      /* ifall det var en delete operation, deleta hela produkten */
      if (action.operation === 'delete') {
        return state
          .deleteIn(['products', action.id]);
      } else {
        return state
          .deleteIn(['products', action.id, 'status']);
      }

    case `fb:upload error`:
      return state
        /* det här är för att signalera specifikt vilken produkt som inte kunde updateras */
        .setIn(['products', action.id, 'status'], fromJS({operation: action.operation, state: 'error', message: action.message}))

    default:
      return state;
  }
}

