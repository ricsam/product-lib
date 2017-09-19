import { call, take, put } from 'redux-saga/effects';
import SagaTester from 'redux-saga-tester';


const someValue = 'SOME_VALUE';
const someResult = 'SOME_RESULT';
const someOtherValue = 'SOME_OTHER_VALUE';
const middlewareMeta = 'MIDDLEWARE_TEST';
const fetchRequestActionType = 'FETCH_REQUEST';
const fetchSuccessActionType = 'FETCH_SUCCESS';
 
const initialState = { someKey : someValue };
const reducer = (state = someValue, action) =>
  action.type === fetchSuccessActionType ? someOtherValue : state;
const middleware = store => next => action => next({
  ...action,
  meta : middlewareMeta
});
// options are passed to createSagaMiddleware
const options = { onError: () => console.error.bind(console) };
const fetchApi = () => someResult;
 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
 
function* listenAndFetch() {
  yield take(fetchRequestActionType);
  const result = yield call(fetchApi);
  yield call(delay, 500); // For async example.
  yield put({ type : fetchSuccessActionType, payload : result });
}

 
it('Showcases the tester API', async () => {
  // Start up the saga tester
  const sagaTester = new SagaTester({
    initialState,
    reducers : { someKey : reducer },
    middlewares : [middleware],
    options,
  });
  sagaTester.start(listenAndFetch);
 
  // Check that state was populated with initialState
  expect(sagaTester.getState()).toEqual(initialState);
 
  // Dispatch the event to start the saga
  sagaTester.dispatch({type : fetchRequestActionType});
 
  // Hook into the success action
  await sagaTester.waitFor(fetchSuccessActionType);
 
  // Check that all actions have the meta property from the middleware
  sagaTester.getCalledActions().forEach(action => {
    expect(action.meta).toEqual(middlewareMeta)
  });
 
  // Check that the new state was affected by the reducer
  expect(sagaTester.getState()).toEqual({
    someKey : someOtherValue
  });
 
  // Check that the saga listens only once
  sagaTester.dispatch({ type : fetchRequestActionType });
  expect(sagaTester.numCalled(fetchRequestActionType)).toEqual(2);
  expect(sagaTester.numCalled(fetchSuccessActionType)).toEqual(1);
 
  // Reset the state and action list, dispatch again
  // and check that it was called
  sagaTester.reset(true);
  expect(sagaTester.wasCalled(fetchRequestActionType)).toEqual(false);
  sagaTester.dispatch({ type : fetchRequestActionType });
  expect(sagaTester.wasCalled(fetchRequestActionType)).toEqual(true);
})