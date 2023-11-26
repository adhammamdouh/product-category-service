const supplierService = require('../services/supplier');

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).send(supplier);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.send(suppliers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).send({ error: 'Supplier not found' });
    }
    res.send(supplier);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplierById(req.params.id, req.body);
    res.send(supplier);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.deleteSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.deleteSupplierById(req.params.id);
    res.send(supplier);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
