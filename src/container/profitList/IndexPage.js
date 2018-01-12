import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import frog from '@cfp/frog';
import {connect} from 'react-redux';
import {actions} from './redux';

import "./index.scss"

@connect(state => state, actions)
export default class  IndexPage extends Component{
  static  displayName = 'profitList';
  static  propTypes = {
    fofXyh: PropTypes.string,
    profitItemsList: PropTypes.array
  }
  render(){
    const {profitItemsList} = this.props;
    return(
        <div className={`mod mod-profitList`}>
          <div className="scroll-warp">
            <div className="head">

            </div>
            <div className="item-list">
              {
                profitItemsList.map((item) => (
                    <div key={item.pid} className="profitItem" onClick={this.goProductDetail(item.pid)}>
                      <div className="fundName">{item.fundName}</div>
                      <div className="profitE2">{item.profitE2}</div>
                      <div className="img"><img src={item.shareImgUrl}/></div>
                    </div>
                ))
              }
            </div>
          </div>
        </div>
    );
  }
};
