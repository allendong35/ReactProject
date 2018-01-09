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