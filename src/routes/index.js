const homeRouter = require('./home');
const usersRouter = require('./users');
function route(app) {
    app.use('/', homeRouter);
    app.use('/auth', usersRouter);
}
module.exports = route;
