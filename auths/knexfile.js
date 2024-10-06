const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `.env.dev`),
});

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      port: process.env.PROSTGRES_PORT,
      user: process.env.PROSTGRES_USER,
      password: process.env.PROSTGRES_PASS,
      database: process.env.PROSTGRES_DB,
    },
    debug: false,
    migrations: {
      directory: 'src/migrations',
    },
    pool:{
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
  dev: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      port: process.env.PROSTGRES_PORT,
      user: process.env.PROSTGRES_USER,
      password: process.env.PROSTGRES_PASS,
      database: process.env.PROSTGRES_DB,
    },
    debug: false,
    migrations: {
      directory: 'src/migrations',
    },
    pool:{
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
  prod: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      port: process.env.PROSTGRES_PORT,
      user: process.env.PROSTGRES_USER,
      password: process.env.PROSTGRES_PASS,
      database: process.env.PROSTGRES_DB,
    },
    debug: false,
    migrations: {
      directory: 'src/migrations',
    },
    pool:{
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};