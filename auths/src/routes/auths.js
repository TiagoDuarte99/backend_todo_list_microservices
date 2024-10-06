const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', async (req, res, next) => {
    try {
      const result = await app.services.auth.login(req.body);

      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.auth.createUser(req.body);

      return res.status(201).json(result.data);
    } catch (err) {
      if (!res.headersSent) {
        if (err.response && err.response.data && err.response.data.error) {
          return res.status(400).json({ error: err.response.data.error });
        }

        return next(err);
      }
      return next();
    }
  });

  return router;
};
