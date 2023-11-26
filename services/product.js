const Product = require('../models/product');
const Constants = require('../constants/product')
const elastic = require('../lib/elasticsearch')

exports.createProduct = async (productData) => {
    try {
        const product = new Product(productData);
        await product.save();
        await elastic.indexDocument(Constants.ELASTIC_INDEX_NAME, product.id, productData)
        return product;
    } catch (error) {
        throw new Error('Could not create the product: ' + error.message);
    }
};

exports.getProducts = async () => {
    try {
        const products = elastic.getAllDocuments(Constants.ELASTIC_INDEX_NAME)//await Product.find();
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
        await elastic.updateDocument(Constants.ELASTIC_INDEX_NAME, productId, updates)
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

exports.getProductsByFilter = async (query) => {
    var esQuery = getESQuery(query);

    const products = await elastic.searchDocuments(
        Constants.ELASTIC_INDEX_NAME, esQuery,
        `if (doc['your_boolean_field'].value == true) {
            return 1;
        } else {
            return 2;
        }`
    );
    return products
}

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

function getESQuery(query) {
    const mustClauses = [];
    if (query.text !== undefined) {
        mustClauses.push({
            multi_match: {
                query: query.text,
                fields: ['name', 'description'],
            },
        });
    }
    if (query.category !== undefined) {
        mustClauses.push({
            match_phrase: {
                categoryId: query.category,
            },
        });
    }
    if (query.supplier !== undefined) {
        mustClauses.push({
            match_phrase: {
                supplierId: query.supplier,
            },
        });
    }
    if (query.price !== undefined) {
        mustClauses.push({
            range: {
                price: {
                    gte: query.price,
                    lte: query.price + 0.01
                }
            }
        });
    }
    return mustClauses;
}