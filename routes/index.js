const camRouter = require('./cam');
function route(app) {
    app.use('/', camRouter);
  }
  module.exports = route;