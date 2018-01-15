/* title: 测试商城222 */
import renderToApp from '../../renderToApp';
import reducer from '../../container/profitList/redux';
import IndexPage from '../../container/profitList/IndexPage';

const render = renderToApp(reducer, {iosFullScreen: true});

render(IndexPage);
if (module.hot) {
  module.hot.accept('../../container/profitList/IndexPage', () => {
    render(IndexPage);
  });
}