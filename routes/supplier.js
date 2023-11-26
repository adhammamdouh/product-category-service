const express = require('express');
const router = express.Router();
const supplierController = require('../controller/supplier');

// Create a new supplier
router.post('/suppliers', supplierController.createSupplier);

// Get all suppliers
router.get('/suppliers', supplierController.getSuppliers);

// Get a supplier by ID
router.get('/suppliers/:id', supplierController.getSupplierById);

// Update a supplier by ID
router.patch('/suppliers/:id', supplierController.updateSupplierById);

// Delete a supplier by ID
router.delete('/suppliers/:id', supplierController.deleteSupplierById);

module.exports = router;