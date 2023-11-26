const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
      } catch (error) {
        res.status(400).send(error);
      }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
      } catch (error) {
        res.status(500).send(error);
      }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(404).send();
        }
        res.send(product);
      } catch (error) {
        res.status(500).send(error);
      }
};

exports.updateProductById = async (req, res) => {
    const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'price', 'category', 'variants', 'supplier'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send();
    }

    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
    
        if (!product) {
          return res.status(404).send();
        }
    
        res.send(product);
      } catch (error) {
        res.status(500).send(error);
      }
};
