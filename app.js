const express = require('express');
const db = require('./lib/database');
const elastic = require('./lib/elasticsearch')
const config = require('./config/config-development.json')
const productService = require('./services/product')
const app = express();
const port = 3000;

const supplierRoutes = require('./routes/supplier');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

app.use(express.json());

app.use('/api', supplierRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

async function initialize() {
  db.init(config.databaseConfig);
  elastic.init(config.elasticsearchConfig);

  await productService.createElasticIndex();

  app.get('/', (req, res) => {
    res.send('Product Category Service is working!');
  });

  app.listen(port);
}

initialize().catch(error => console.error('Initialization error:', error));