import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import frog from '@cfp/frog';
import {connect} from 'react-redux';
import {actions} from './redux';

import "./index.scss";

@connect(state => state, actions)
export default class  IndexPage extends Component{
  static  displayName = 'profitList';
  static  propTypes = {
    initParams: PropTypes.shape({
      fofXyh: PropTypes.string
    }),
    page: PropTypes.shape({
      refreshing: PropTypes.bool,
      profitItemsList: PropTypes.array,
    }),
    fetchGetProfitList:PropTypes.func
  }


  componentDidMount() {
    this.props.fetchGetProfitList();

  }
  render(){
    const {profitItemsList} = this.props.page;
    if (profitItemsList===undefined){
      return (
          <div>加载中....</div>
      )
    }
    return(
        <div className={`mod mod-profitList ani`}>
          <div className="scroll-warp">
            <div className="head">
           净值收益列表
            </div>
            <div className="item-list">
              {
                profitItemsList.map((item) => (
                    <div key={item.totalProfitE2} className="profitItem">
                      <div className="profitItemHead">
                        <div className="profitDate">{item.profitDate}</div>
                        <div className="totalProfitE2">{item.totalProfitE2}</div>
                      </div>
                      {item.profitDetailList.map((mapItem) => (
                        <div key={mapItem.profitE2} className="profitDetailItem">
                          <div className="fundName">{mapItem.fundName}</div>
                          <div className="profitE2">{mapItem.profitE2}</div>
                        </div>
                      ))}
                      {/*<div className="img"><img src={item.shareImgUrl}/></div>*/}
                    </div>
                ))
              }
            </div>
          </div>
        </div>
    );
  }
};
