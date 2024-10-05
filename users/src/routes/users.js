const express = require('express');

module.exports = (app) => {
  const router = express.Router();


  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });


  router.get('/all', (req, res, next) => {
    app.services.user.findAll(req.query.page, req.params)
      .then((result) => {
        const { totalResults } = result;
        res.set('X-Total-Count', totalResults);
        res.status(200).json(result.users);
      })
      .catch((err) => next(err));
  });

  router.get('/one/:id', (req, res, next) => {
    app.services.user.findOneWithoutPassword(req.params)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => next(err));
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.user.update(req.params.id, req.body, req.user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/email/:email', (req, res, next) => {
    app.services.user.findOneWithoutPassword(req.params)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => next(err));
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.user.deleteUser(req.params.id, req.user);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
};