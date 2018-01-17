/* title: 测试商城222 */
import renderToApp from '../../renderToApp';
import reducer from '../../container/profitList/redux';
import IndexPage from '../../container/profitList/IndexPage';
import saga from '../../container/profitList/saga';
const render = renderToApp(reducer, saga,{iosFullScreen: true});

render(IndexPage);
if (module.hot) {
  module.hot.accept('../../container/profitList/IndexPage', () => {
    render(IndexPage);
  });
}