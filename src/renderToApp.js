require('raf').polyfill();
require('fastclick').attach(document.body);
require('./lib/util/reportError').spyAll();
require('./lib/util/userTiming');

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {AppContainer} from 'react-hot-loader';
// import Root from './container/Root';
import {version} from '../package.json';
import {detectWebpFeatures} from './lib/util/webp';
// import {setCfpTiming, setCfpDiffTiming} from 'lib/util/reportTiming';
import isBoolean from 'lodash/isBoolean';
// import configureStore from './store/configureStore';

export default (reducer, config = {}) => {
  const autoLoading = isBoolean(config.autoLoading) ? config.autoLoading : true; // 在读取缓存后，是否自动关闭loading
  const dependApi = isBoolean(config.dependApi) ? config.dependApi : true; //页面初始化是否依赖接口请求，如果页面无接口请求,则此参数配置为false,默认为ture
  const relyLoginState = !!config.relyLoginState;

  const {keyPrefix, whitelist, transforms} = config;
  const storeConfig = {keyPrefix, whitelist, transforms, relyLoginState, autoLoading};
  // const store = configureStore(reducer, storeConfig);

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
          <Provider store={null}>
            {/*<Root config={{...config, dependApi, autoLoading}} >*/}
              <Page relyLoginState={relyLoginState} />
            {/*</Root>*/}
          </Provider>
        </AppContainer>,
        document.querySelector('#app')
      );
    });
  };
};
