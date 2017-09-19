const getInitialState = () => ({

  pageLoading: true, /* as it is loading in the beginning */

  uid: '', /* falsy or id <String> */
  loginProvider: '', /* anon, google or github available */

  logoutLoading: false,
  logoutError: false,

  loginLoading: false,
  loginError: false,

  products: {},
  productsLoading: false, /* READ */
  productsError: false,

});

export default getInitialState;