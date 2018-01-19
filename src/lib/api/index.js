import apisauce from 'apisauce';
import apis from './apis';
import frog from '@cfp/frog';
import {API_ROOT} from '../config';

const baseURL = `${API_ROOT}/actapi_v2/mapi/`;
console.log('baseURL===>'+API_ROOT);
const instance = apisauce.create({
  baseURL,
  headers: {
    // Origin: API_ROOT,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  params: {

  },
  withCredentials: 'include',
  timeout: 10000
});

instance.addAsyncRequestTransform(request => {
  let devicePromise = Promise.all(
      [frog.getDeviceInfo().then(({UDID}) => {
        if (UDID) {
          request.headers.UDID = UDID;
        }
      }), frog.getSkey().then(({skey}) => {
        request.headers.skey = skey;
      })]
  );

  console.log(`>>>${JSON.stringify(request)}`);
  return devicePromise;
});

function makeApi(apis = []) {
  const resultApis = {};

  apis.forEach(apiName => {
    const segments = apiName.split('.');
    let i = 0;
    const last = segments.length - 1;
    let scope = resultApis;
    for (; i < last; i++) {
      if (!scope.hasOwnProperty(segments[i])) {
        scope[segments[i]] = {};
      }
      scope = scope[segments[i]];
    }
    scope[segments[last]] = (payload, options) => instance.post(apiName, payload, options);
  });

  return resultApis;
}

export default makeApi(apis);
