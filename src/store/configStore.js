import {createStore,applyMiddleware,compose} from 'redux';
import createLog from './log';
import qs from 'query-string';
import createSagaMiddleware from 'redux-saga';

export default function (reducer,saga) {

  
  const enhancers = [];
  const middlewares = [];
  /* ------------- Saga Middleware ------------- */
  let sagaMiddleware;
  if (saga){
    sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);
  }

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLog());
  }

  enhancers.push(applyMiddleware(...middlewares));

  const  store = createStore(reducer,{},compose(...enhancers));

  if (sagaMiddleware){
    sagaMiddleware.run(saga);
  }
  return store;
}