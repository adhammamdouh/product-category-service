const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: String,
  name: String,
  contactInfo: {
    address: String,
    email: String,
    phone: String,
  },
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;