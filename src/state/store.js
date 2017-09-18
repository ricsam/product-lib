import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fromJS } from 'immutable';

import reducer from './reducer';


/* Funktion som skapar redux store med middleware.
   Tar en initialState som passas från index.js */
export default function storeCreator(initialState = {}) {


  const enhancers = [];


  const sagaMiddleware = createSagaMiddleware();


  const composedEnhancers = compose(
    applyMiddleware(sagaMiddleware),
    ...enhancers
  )

  const store = createStore(
    reducer,
    fromJS(initialState),
    composedEnhancers
  );


  store.runSaga = sagaMiddleware.run;

  return store;
};




