const express = require('express');

module.exports = (app) => {
/*   app.use('/auth', app.routes.auths);

  const secureRouter = express.Router(); */

  app.use('/', app.routes.users);

  /* app.use(app.config.passport.authenticate(), secureRouter); */

}