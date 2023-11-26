const Supplier = require('../models/supplier');

exports.createSupplier = async (supplierData) => {
  try {
    const supplier = new Supplier(supplierData);
    await supplier.save();
    return supplier;
  } catch (error) {
    throw new Error('Could not create the supplier: ' + error.message);
  }
};

exports.getSuppliers = async () => {
  try {
    const suppliers = await Supplier.find();
    return suppliers;
  } catch (error) {
    throw new Error('Could not fetch suppliers: ' + error.message);
  }
};

exports.getSupplierById = async (supplierId) => {
  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return supplier;
  } catch (error) {
    throw new Error('Could not fetch the supplier: ' + error.message);
  }
};

exports.updateSupplierById = async (supplierId, updates) => {
  const allowedUpdates = ['name', 'contactInfo'];
  const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new Error('Invalid updates! Allowed updates: ' + allowedUpdates.join(', '));
  }

  try {
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    Object.keys(updates).forEach((update) => (supplier[update] = updates[update]));
    await supplier.save();
    return supplier;
  } catch (error) {
    throw new Error('Could not update the supplier: ' + error.message);
  }
};

exports.deleteSupplierById = async (supplierId) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(supplierId);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    return supplier;
  } catch (error) {
    throw new Error('Could not delete the supplier: ' + error.message);
  }
};
