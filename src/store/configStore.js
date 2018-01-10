import {createStore,applyMiddleware,compose} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import qs from 'query-string';

export default function (reducer) {

  const enhancer = [];

  enhancer.push(applyMiddleware(thunk,createLogger({
    predicate: (getState, {type}) => !LOGGING_BLACKLIST.includes(type),
    colors: {
      title: false,
      prevState: false,
      action: false,
      nextState: false,
      error: false
    },
    titleFormatter: ({type}, time) => `action ${type} @${time}`,
    stateTransformer: state => immutable.asMutable(state)
  })));
  const  store = createStore(reducer,{query:qs.parse(location.search)||{}},compose(...enhancer));

  return store;
}