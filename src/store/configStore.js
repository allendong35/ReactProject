import {createStore,applyMiddleware,compose} from 'redux';
import createLog from './log';
import createReducers from './createReducers';
import createSagaMiddleware from 'redux-saga';
import {composeWithDevTools} from 'redux-devtools-extension';

export default function (reducer,initParams,saga) {

  
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

  const  store = createStore(createReducers(reducer),{initParams},composeWithDevTools(...enhancers));

  if (sagaMiddleware){
    sagaMiddleware.run(saga);
  }
  return store;
}