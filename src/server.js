const express = require('express');
const db = require('./data/models/init');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => res.status(404).json({ error: 'Resource Not Found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`Error processing request ${err}. See next message for details`);
  console.error(err.message);

  return res.status(500).json({ error: 'Internal Server Error' });
});

db.sequelize.sync();

const server = app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

module.exports = { server };
