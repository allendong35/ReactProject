function getHybridRoot() {
  return `${location.origin}/`;
}

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config.prod.js');
} else {
  module.exports = require('./config.dev.js');
}
module.exports.HYBRID_ROOT = getHybridRoot();
