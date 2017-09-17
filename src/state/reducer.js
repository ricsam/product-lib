import { fromJS } from 'immutable';

const initialState = fromJS({});

function reducer(state = initialState, action) {
  switch (action.type) {
    case "@@redux/INIT":
      /* initialize */
      return state;
    case "fb:logged in":
      /* resetar alla errors o sånt (lite redundant),
         samt påbörjar nedladdning av produkterna från DB */
      return state
        .set('uid', action.uid)
        .set('loginProvider', action.loginProvider) /* e.g. google or github or just anon */
        .set('loginLoading', false)
        .set('pageLoading', false)
        .set('loginError', false)
        .set('productsLoading', true)
        .set('productsError', false);

    case "fb:logged out":
      /* resetar allt till inital state */
      return state
        .set('uid', '')
        .set('loginProvider', '')
        .set('products', {})
        .set('logoutLoading', false)
        .set('pageLoading', false)
        .set('logoutError', false);

    case 'fb:logout':
      // påbörjar utloggning
      return state
        .set('logoutLoading', true)
        .set('logoutError', false);

    case "fb:login":
      // påbörjar inloggning
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

    /* vill bara belysa att denna action kan dispatchas,
       i slutändan kommer fb:logged out att dispatchas från firebase api */
    case "fb:delete user":
      return state;

    case "fb:set credential":
      return state
        .set('credential', action.credential);

    // CREATE, UPDATE, DELETE operations,
    // e.g. pågående updatering av en produkt trackas i state.products
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
        /* det här är för att signalera specifikt vilken komponent som inte kunde updateras */
        .setIn(['products', action.id, 'status'], fromJS({operation: action.operation, state: 'error', message: action.message}))

    default:
      return state;
  }
}

export default reducer;