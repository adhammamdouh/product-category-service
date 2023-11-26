const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  variants: {
    type: [
      {
        attributes: [
          {
            key: { type: String, required: true },
            value: { type: String, required: true },
          },
        ],
        price: { type: Number, required: false },
      },
    ],
    default: [],
  },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
});

productSchema.index({ name: 1, supplierId: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;