//keys.js - figuring out what credentials to return
if (process.env.NODE_ENV === 'production') {
    //we are in prod - return production mode keys
    module.exports = require('./prod');
} else {
    //we are in dev mode - return dev mode keys
    module.exports = require('./dev');
}