const express = require('express');

module.exports = (app) => {
  const publicRouter = express.Router();
  const secureRouter = express.Router();

  // Rotas públicas, como signup e signin (não precisam de autenticação)
  publicRouter.use('/signup', app.routes.users);
  publicRouter.use('/signin', app.routes.users);

  // Aplicar autenticação com Passport em todas as rotas seguras
  secureRouter.use(app.config.passport.authenticate());

  // Rotas seguras, precisam de autenticação para serem acessadas
  secureRouter.use('/', app.routes.users);

  // Aplicar os routers
  app.use('/', publicRouter);
  app.use('/', secureRouter);
};
