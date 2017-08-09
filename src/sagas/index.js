import { takeEvery } from 'redux-saga'
import { take, put, call, fork, all } from 'redux-saga/effects'
import { curry } from 'lodash'
import * as actions from '../actions'
import Util from '../middleware/Util'
import * as api from '../middleware/api'

// each entity defines 3 creators { request, success, failure }
const { fetchStd } = actions

/***************************** Subroutines ************************************/
function* fetchEntity(entity, apiFn, options) {
    yield put( entity.request(options) )
    const {response, error} = yield call(apiFn, options)
    if(response)
        yield put( entity.success(options, response) )
    else
        yield put( entity.failure(options, error) )
}

// curry
export const fetchData = curry(fetchEntity)(fetchStd, api.fetchStd)

export function* sendRequest(action) {
    const { options } = action;
    let res;
    try {
        if (Array.isArray(options)){
            // 多个并发
            res = yield options.map((request) => call(Util.Fetch, request))
        }else{
            res = yield call(Util.Fetch, options);
        }
        yield put({type: "FETCH_SUCCEEDED", res: res});
    } catch (e) {
        yield put({type: "FETCH_FAILED", message: e.message});
    }
}
// take的返回值是action
export function* watchRequest() {
    yield* takeEvery(actions.STANDARD_ASYNC, sendRequest);
  while(true) {
    const { options } = yield take(actions.STANDARD_FETCH)
    yield fork(fetchData, options)
  }
}

export default function* rootSaga() {
    yield all([
        fork(watchRequest)
    ])
}