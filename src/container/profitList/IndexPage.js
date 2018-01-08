import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import frog from '@cfp/frog';
import {connect} from 'react-redux';

// @connect(state => ({}),actions)
export default class  IndexPage extends Component{
  static  displayName = 'profitList';
  static  propTypes = {

  }
  render(){
    return(
        <div className="fn">更多产品<span className="icon"/>敬请期待</div>
    );
  }
};
