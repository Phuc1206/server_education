const usersRouter = require("./users");
const apiRouter = require("./api");
const adminRouter = require("./admin");
function route(app) {
  app.use("/auth", usersRouter);
  app.use("/api", apiRouter);
  app.use("/admin", adminRouter);
}
module.exports = route;
