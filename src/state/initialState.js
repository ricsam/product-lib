const getInitialState = (where) => {

  switch (where) {
    case 'app':
      return {
        pageLoading: true, /* as it is loading in the beginning */
        editItem: '',
      };
    case 'login':
      return {
        uid: '', /* falsy or id <String> */
        loginProvider: '', /* anon, google or github available */

        logoutLoading: false,
        logoutError: false,

        loginLoading: false,
        loginError: false,

      };
    case 'products':
      return {
        products: {},
        productsLoading: false, /* READ */
        productsError: false,
      };
    default:
      return {}
  }



};

export default getInitialState;