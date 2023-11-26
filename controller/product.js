const productService = require('../services/product');

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const product = await productService.updateProductById(req.params.id, req.body);
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const product = await productService.deleteProductById(req.params.id);
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getProductsByFilter = async (req, res) => {
  try {
    const product = await productService.getProductsByFilter(req.body);
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}