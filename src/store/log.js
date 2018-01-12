import {createLogger} from 'redux-logger';
import immutable from 'seamless-immutable';

const LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE'];

export default () => {
  return createLogger({
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
  });
};
