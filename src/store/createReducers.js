import {combineReducers} from 'redux';

export default (page) => {
  if (page) {
    return combineReducers({
      initParams: (state = {}) => state,
      page
    });
  }
  return combineReducers({
    initParams: (state = {}) => state
  });
};
