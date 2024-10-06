const express = require('express');

module.exports = (app) => {
  const publicRouter = express.Router();
  const secureRouter = express.Router();

  publicRouter.use('/signup', app.routes.users);
  publicRouter.use('/signin', app.routes.users);
  secureRouter.use('/', app.routes.users);

  app.use('/', publicRouter);
  app.use('/', app.config.passport.authenticate(), secureRouter);
};
