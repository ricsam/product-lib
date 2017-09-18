/**
 * Gets the repositories of the user from Github
 */

import { takeEvery } from 'redux-saga/effects';

/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
}

/**
 * Root saga manages watcher lifecycle
 */
export function* saga() {
  yield takeEvery('LOAD_REPOS', getRepos);

}

export default saga;