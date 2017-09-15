import { fromJS } from 'immutable';

/*

The state for the Editing product modal.
This will be sent to server as one big object once the Save button is
pressed and overwrite the server version corresponding to the id in the object.

{
  "products": [
    {
      "id": "32730290429542918140",
      "name": "some name",
      "variants": [
        {
          "name": "some variant name",
          "price": 123123 // some variant price
        }
      ],
      "price": 123123 // will not be set if this.variants.length > 0
    }
  ]
}
*/

// The initial state of the App
const initialState = fromJS({
  UID: '', /* falsy or id <String> */
  loginLoading: false,
  loginError: false,

  products: [],

  /* different assets that will load or maybe generate error */
  addProductLoading: false, /* CREATE */
  productsLoading: false, /* READ */
  updateProductLoading: false, /* UPDATE */
  removeProductLoading: false, /* DELETE */
  /* pretty good to have errors for every action, ... */
  addProductError: false,
  productsError: false,
  updateProductError: false,
  removeProductError: false,

});

function reducer(state = initialState, action) {
  console.log('reducer!', state.toJSON(), action);
  switch (action.type) {
    case "@@redux/INIT":
      /* initialize */
      return state;
    case 'LOAD_REPOS':
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case 'LOAD_REPOS_SUCCESS':
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case 'LOAD_REPOS_ERROR':
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default reducer;