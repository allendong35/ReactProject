// require('raf').polyfill();
require('fastclick').attach(document.body);  //从点击屏幕上的元素到触发元素的 click 事件，移动浏览器会有大约 300 毫秒的等待时间。为什么这么设计呢？ 因为它想看看你是不是要进行双击（double tap）操作。
// require('./lib/util/reportError').spyAll();
// require('./lib/util/userTiming');

import React from 'react';
import immutable from 'seamless-immutable';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {AppContainer} from 'react-hot-loader';
// import Root from './container/Root';
import {version} from '../package.json';
import {detectWebpFeatures} from './lib/webp';
// import {setCfpTiming, setCfpDiffTiming} from 'lib/util/reportTiming';
import configureStore from './store/configStore';

export default (reducer,saga,config = {}) => {
  // const autoLoading = isBoolean(config.autoLoading) ? config.autoLoading : true; // 在读取缓存后，是否自动关闭loading
  // const dependApi = isBoolean(config.dependApi) ? config.dependApi : true; //页面初始化是否依赖接口请求，如果页面无接口请求,则此参数配置为false,默认为ture
  // const relyLoginState = !!config.relyLoginState;

  // const {keyPrefix, whitelist, transforms} = config;
  // const storeConfig = {keyPrefix, whitelist, transforms, relyLoginState, autoLoading};

  const store = configureStore(reducer,immutable({}),saga);

  window.HYBRID_VERSION = version;

  return (Page) => {
    //webp打点begin
    // setCfpDiffTiming('webp');
    detectWebpFeatures().then(() => {
      //webp打点end
      // setCfpDiffTiming('webp');
      //render before time
      // setCfpTiming('rbt');
      render(
        <AppContainer>
          <Provider store={store}>
            {/*<Root config={{...config, dependApi, autoLoading}} >*/}
              <Page/>
            {/*</Root>*/}
          </Provider>
        </AppContainer>,
        document.querySelector('#app')
      );
    });
  };
};
