import {createActions, handleActions} from 'redux-actions';

import immutable from 'seamless-immutable';

export const actions = createActions({FETCH_GET_PROFIT_LIST: _fofXyh => ({_fofXyh})}, 'GET_PROFIT_LIST');

export const INITIAL_STATE = immutable({
  error: null,
  refreshing: false
});

export default handleActions({
  [actions.fetchGetProfitList]: (state) => state.merge({refreshing: true}),
  [actions.getProfitList]: {
    next(state, {payload}) {
      return state.merge({error: null, refreshing: false, ...payload});
    },
    throw(state, {payload: error}) {
      return state.merge({error, refreshing: false});
    }
  }
}, INITIAL_STATE);