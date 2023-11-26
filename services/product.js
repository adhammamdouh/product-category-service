const Product = require('../models/product');
const Constants = require('../constants/product')
const elastic = require('../lib/elasticsearch')

exports.createProduct = async (productData) => {
    try {
        const product = new Product(productData);
        await product.save();
        await elastic.indexDocument(Constants.ELASTIC_INDEX_NAME, productData, product.id)
        return productData;
    } catch (error) {
        throw new Error('Could not create the product: ' + error.message);
    }
};

exports.getProducts = async () => {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw new Error('Could not fetch products: ' + error.message);
    }
};

exports.getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw new Error('Could not fetch the product: ' + error.message);
    }
};

exports.updateProductById = async (productId, updates) => {
    const allowedUpdates = ['name', 'description', 'price', 'category', 'variants', 'supplier'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        throw new Error('Invalid updates! Allowed updates: ' + allowedUpdates.join(', '));
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        Object.keys(updates).forEach((update) => (product[update] = updates[update]));
        await product.save();
        return product;
    } catch (error) {
        throw new Error('Could not update the product: ' + error.message);
    }
};

exports.deleteProductById = async (productId) => {
    try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        throw new Error('Could not delete the product: ' + error.message);
    }
};

exports.createElasticIndex = async () => {
    try {
        const { body } = await elastic.createIndex(Constants.ELASTIC_INDEX_NAME, getProductElasticMapping())
    } catch (error) {
        console.error('Error creating index mapping:', error);
    }
}

function getProductElasticMapping() {
    return {
        properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'double' },
            category: { type: 'keyword' },
            variants: {
                type: 'nested',
                properties: {
                    attributes: {
                        type: 'nested',
                        properties: {
                            key: { type: 'keyword' },
                            value: { type: 'keyword' },
                        },
                    },
                    price: { type: 'double' },
                },
            },
            supplier: { type: 'keyword' },
        },
    };

}