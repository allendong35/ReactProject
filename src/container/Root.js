import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import loadUser from '../action/loadUser';
import Loading from '../component/widget/Loading';
import NetworkError from '../component/widget/NetworkError';
import frog from '@cfp/frog';
import {getTimes} from '../lib/util/timing';
import assign from 'object-assign';
import {setLocalStorage} from '../lib/util/localStorage';
import {LOGIN_STATUS_CHANGE_TIME_KEY} from '../constants';
import report from '../lib/util/report';
import NoticeBar from '../component/widget/NoticeBar';

const clientWidth = window.document.documentElement.clientWidth;
let userPromise = null;

class Root extends Component {
  static displayName = 'Root';

  static propTypes = {
    config: PropTypes.object,
    loadUser: PropTypes.func,
    showLoading: PropTypes.bool,
    apiHandle: PropTypes.shape({
      level: PropTypes.number,
      msg: PropTypes.string
    }),
    dataFromCache: PropTypes.bool,
    isCacheUseful: PropTypes.bool,
    children: PropTypes.any,
    user: PropTypes.object
    // isLogin: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      showMask: false
    };
  }

  componentWillMount() {

    userPromise = this.props.loadUser();

    frog.lifeStage.loginStatusChanged(() => {
      setLocalStorage(LOGIN_STATUS_CHANGE_TIME_KEY, new Date().getTime());
      userPromise = this.props.loadUser();
    });
  }

  componentDidMount() {
    getTimes().then((timing) => {
      const data = assign({
        sr: `${window.screen.height}×${window.screen.width}`,
        dpr: window.devicePixelRatio,
        cd: window.screen.colorDepth,
        lang: window.navigator.language
      }, timing);
      report(data, 'pageview');
    }).catch(() => {
      // do nothing
    });

  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }
  // shouldComponentUpdate(nextProps) {
  //   // 依赖于登录态并且下一个状态仍然为未登录并且后面数据是从缓存中读取的，则不刷新页面
  //   // if (nextProps.config.relyLoginState && !nextProps.user.isLogin && nextProps.dataFromCache) {
  //   //   return false;
  //   // }
  //   return true;
  // }

  handleTouchStart = (event) => {
    const posX = event.touches ? event.touches[0].pageX : event.clientX;
    const posY = event.touches ? event.touches[0].pageY : event.clientY;
    this.dragging = true;
    this.touchObject = {
      startX: posX,
      startY: posY,
      curX: posX,
      curY: posY,
      onBoundary: posX < (clientWidth / 8)
    };
    this.isScrolling = undefined;
  };

  handleTouchMove = (event) => {
    const {disabledRightSlipBacking} = this.props.config;
    if (!this.dragging) {
      this.handleTouchStart(event);
      return;
    }

    const touchObject = this.touchObject;

    touchObject.curX = event.touches ? event.touches[0].pageX : event.clientX;
    touchObject.curY = event.touches ? event.touches[0].pageY : event.clientY;

    // This is a one time test
    if (this.isScrolling === undefined) {
      this.isScrolling = Math.abs(touchObject.curY - touchObject.startY) > Math.abs(touchObject.curX - touchObject.startX) || event.defaultPrevented;
    }

    if (this.isScrolling) {
      return;
    }

    if (disabledRightSlipBacking || !this.touchObject.onBoundary) {
      event.preventDefault();
    }
  };

  handelTouchEnd = () => {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
  };

  //ios下拉刷新,防止有fixed对象错位,在最外层加个透明遮罩层
  handelDropDown = (showMask) => {
    if (frog.ua.os.iOS) {
      if (showMask) {
        this.handelShowMask(showMask);
      //隐藏遮罩层时,延时1秒隐藏
      //因为ios下拉刷新触发done后,还有1秒延时
      } else {
        setTimeout(() => {
          this.handelShowMask(showMask);
        }, 1000);
      }
    }
  }

  handelShowMask = (showMask) => {
    this.setState({showMask});
  }

  render() {
    const {stopTouchControl, relyLoginState, keyPrefix, iosFullScreen, dependApi} = this.props.config;
    const touchEvent = !stopTouchControl && frog.ua.browser.CFP && frog.ua.os.iOS ? {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handelTouchEnd,
      onTouchCancel: this.handelTouchEnd
    } : {};
    const dataWarningProps = {
      show: this.props.dataFromCache && this.props.isCacheUseful,
      closable: true,
      mode: 'collapsed',
      className: 'bar-fixed',
      message: '您的网络不稳定，数据更新失败，请下拉刷新',
      style: '',
      iosFullScreen
    };
    const loadingFlag = dependApi && this.props.showLoading;
    // let children = this.props.children;
    let children = React.cloneElement(this.props.children, {handelDropDown: this.handelDropDown});
    if (relyLoginState || !!keyPrefix) {
      children = React.cloneElement(children, {userPromise, user: this.props.user, dataFromCache: this.props.dataFromCache});
      // children = React.cloneElement(children, {userPromise});
    }
    const maskCss = this.state.showMask ? 'block' : 'none';

    return (
      <div {...touchEvent} className={frog.ua.os.iOS ? 'ios' : 'android'}>
        <NoticeBar {...dataWarningProps} />
        {loadingFlag && <Loading />}
        {children}
        <NetworkError apiHandle={this.props.apiHandle} />
        <div
          className="ios-head-adjust"
          onTouchMove={function(event) {
            event.preventDefault();
          }}
          style={{display: maskCss}}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {showLoading, apiHandle, user} = state;
  const dataFromCache = state.page && state.page.dataFromCache || false;
  const isCacheUseful = state.isCacheUseful;
  return {
    showLoading,
    dataFromCache,
    isCacheUseful,
    apiHandle,
    user
  };
}

export default connect(mapStateToProps, {
  loadUser
})(Root);
