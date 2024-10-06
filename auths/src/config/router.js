module.exports = (app) => {
  app.use('/', app.routes.auths);
};
