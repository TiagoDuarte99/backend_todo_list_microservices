const app = require('express')();
const consign = require('consign');
const cors = require('cors');
const knex = require('knex');
const config = require('./config');
const cookieParser = require('cookie-parser');

app.use(cors(config.corsOptions));
app.use(cookieParser());

const knexfile = require('../knexfile');

app.db = knex(knexfile[config.NODE_ENV]);

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./config/passport.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  next(err);
  if (name === 'validationError') return res.status(400).json({ error: message });
  if (name === 'forbiddenError') return res.status(403).json({ error: message });
  return res.status(500).json({ name, message, stack });
});

module.exports = app;
