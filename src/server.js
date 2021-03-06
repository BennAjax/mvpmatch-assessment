require('dotenv').config();
const express = require('express');
const db = require('./data/models/init');
const APIError = require('./lib/errors/APIError');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => res.status(404).json({ error: 'Resource Not Found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.status).json({ status: err.message, details: err.meta });
  }
  console.log(err.message);
  return res.status(500).json({ error: 'Internal Server Error' });
});

db.sequelize.sync({ force: false });

const server = app.listen(PORT, () => {
  if (!process.env.TEST) console.log(`Server Running on Port ${PORT}`);
});

module.exports = server;
