import {call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {isBoolean} from 'lodash';
import frog from '@cfp/frog';

const  ErrorCode = [100010];
function* callApi(api,params = {}, options = {}) {

  if (isBoolean(params)) {
    params = {};
  } else if (isBoolean(options)) {
    options = {};
  }
  params.clientId = 1;
  params.platform= 1;

  // const  loading = yield showLoading
  const response = yield call(api,params,options);

  console.log(`params>>${JSON.stringify(params)}>>options>>${JSON.stringify(options)}>>response>>${JSON.stringify(response)}`);

  yield call(delay, 0);

  if (response && response.ok && ErrorCode.indexOf(response.data.retCode) >= 0){
  //
  //   console.log('有没有');
    yield  frog.ui.alert('提示','您已经从其他设备登录','好的').then(()=>{
      frog.ui.goLogout().then(() => {});
    });
  }

  return response;
}

export default (...args) => {
  return call(callApi, ...args);
};