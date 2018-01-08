/* title: 测试商城222 */
import renderToApp from '../../renderToApp';
// import reducer from '../../reducer/profitList/index';
import IndexPage from '../../container/profitList/IndexPage';

const render = renderToApp(null, {iosFullScreen: true});

render(IndexPage);
if (module.hot) {
  module.hot.accept('../../container/profitList/IndexPage', () => {
    render(IndexPage);
  });
}

// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
//
// // @connect(state => ({}),actions)
// export default class  IndexPage extends Component{
//
//   render(){
//     return(
//         <div className="fn">更多产品<span className="icon"/>敬请期待</div>
//     );
//   }
// };
