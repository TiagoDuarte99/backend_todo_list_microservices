const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `./env/${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  NODE_PORT: process.env.NODE_PORT || '3002',
  privateKey: process.env.PRIVATE_KEY ,
  corsOptions: {
    origin: ['http://127.0.0.1:4200', 'http://localhost:4200'], //TODO alterar para a url do frontend server  
    exposedHeaders: ['X-Total-Count'],
  },
};