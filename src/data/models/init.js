const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mvpmatch', 'interview_user', 'qwerty12', {
  host: 'postgresql-82706-0.cloudclusters.net',
  dialect: 'postgres',
  port: '13088',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const db = {};

db.DataTypes = DataTypes;
db.sequelize = sequelize;
db.users = require('./User')(sequelize, DataTypes);

module.exports = db;
