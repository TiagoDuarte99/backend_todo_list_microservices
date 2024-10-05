const app = require('express')();
const consign = require('consign');
const cors = require('cors');
const config = require('./config');


app.use(cors(config.corsOptions));

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send('auths');
});

module.exports = app;