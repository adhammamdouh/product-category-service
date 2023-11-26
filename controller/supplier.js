const Supplier = require('../models/supplier');

exports.createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).send(supplier);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.send(suppliers);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).send();
        }
        res.send(supplier);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateSupplierById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'contactInfo'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).send();
        }

        updates.forEach((update) => (supplier[update] = req.body[update]));
        await supplier.save();
        res.send(supplier);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!supplier) {
            return res.status(404).send();
        }

        res.send(supplier);
    } catch (error) {
        res.status(500).send(error);
    }
};
