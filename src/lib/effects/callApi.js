import {call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {isBoolean} from 'lodash';
import frog from '@cfp/frog';

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

  // const  loading = yield showLoading
  const response = yield call(api,params,options);

  console.log(`params>>${JSON.stringify(params)}>>options>>${JSON.stringify(options)}>>response>>${JSON.stringify(response)}`);

  yield call(delay, 0);

  if (response && response.ok && ErrorCode.indexOf(response._data.retCode) >= 0){
    frog.ui.alert('提示','您已经从其他设备登录','好的').then(()=>{
      frog.ui.goLogout().then(() => {});
    });
  }

}
