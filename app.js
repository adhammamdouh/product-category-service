const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config-development.json');
const db = require('./lib/database');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});