import {call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {isBoolean} from 'lodash';

const  ErrorCode = [100010];
function* callApi(api,params = {}, options = {},showLoading = true) {

  if (isBoolean(params)) {
    showLoading = params;
    params = {};
  } else if (isBoolean(options)) {
    showLoading = options;
    options = {};
  }
  params.clientId = 1;
  params.platform= 1;

}
