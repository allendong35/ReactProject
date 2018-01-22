import {all, put, takeLatest} from 'redux-saga/effects';
import {actions} from './redux';
import api from 'lib/api';
import callApi from 'lib/effects/callApi';


function* fetchGetProfitList({payload}) {
  const response = yield callApi(api.hsfund.fundProfitList, false);
  if (response.ok) {
    if (response.data.retCode === 0) {
      yield put(actions.getProfitList(response.data.retData));
    } else {
      yield put(actions.getProfitList(new Error(response.data.retMsg)));
    }
  } else {
    yield put(actions.getProfitList(new Error(response.problem)));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.fetchGetProfitList, fetchGetProfitList)
  ]);
}