const { Sequelize, DataTypes } = require('sequelize');

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.JWT_SECRET
) {
  throw new Error('Env parameters not provided');
}

let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbName = process.env.DB_NAME;
let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;

if (process.env.TEST) {
  if (
    !process.env.TEST_DB_HOST ||
    !process.env.TEST_DB_PORT ||
    !process.env.TEST_DB_NAME ||
    !process.env.TEST_DB_USER ||
    !process.env.TEST_DB_PASSWORD
  ) {
    throw new Error('TEST Env parameters not provided');
  }

  dbHost = process.env.TEST_DB_HOST;
  dbPort = process.env.TEST_DB_PORT;
  dbName = process.env.TEST_DB_NAME;
  dbUser = process.env.TEST_DB_USER;
  dbPassword = process.env.TEST_DB_PASSWORD;
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  port: dbPort,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    if (!process.env.TEST) console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const db = {};

db.DataTypes = DataTypes;
db.sequelize = sequelize;
db.users = require('./User')(sequelize, DataTypes);
db.products = require('./Product')(sequelize, DataTypes);

module.exports = db;
