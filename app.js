const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const supplierRoutes = require('./Routes/supplier');
const categoryRoutes = require('./Routes/category');
const productRoutes = require('./Routes/product');

app.use('/api', supplierRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

app.get('/', (req, res) => {
  res.send('Product Category Service is working!');
});

app.listen(port);