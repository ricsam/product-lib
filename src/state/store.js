import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fromJS } from 'immutable';

import reducer from './reducer';


const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
});

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


export default store;
