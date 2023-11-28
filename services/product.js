const Product = require('../models/product');
const Category = require('./category')
const Supplier = require('./supplier')
const Constants = require('../constants/product')
const elastic = require('../lib/elasticsearch')

exports.createProduct = async (productData) => {
    try {
        const sanitizedProductData = sanitizeProduct(productData);

        await validateProduct(sanitizedProductData);

        const product = new Product(sanitizedProductData);
        await product.save();
        await elastic.indexDocument(Constants.ELASTIC_INDEX_NAME, product.id, sanitizedProductData);
        return product;
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
    const allowedUpdates = ['name', 'description', 'price', 'categoryId', 'variants', 'supplierId', 'bestSelling'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        throw new Error('Invalid updates! Allowed updates: ' + allowedUpdates.join(', '));
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const sanitizedUpdates = sanitizeProduct(updates);

        await validateProduct(sanitizedUpdates);

        Object.keys(sanitizedUpdates).forEach((update) => (product[update] = sanitizedUpdates[update]));

        Object.keys(updates).forEach((update) => (product[update] = updates[update]));
        await product.save();
        await elastic.updateDocument(Constants.ELASTIC_INDEX_NAME, productId, updates);
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

        elastic.deleteDocument(Constants.ELASTIC_INDEX_NAME, productId)
        return product;
    } catch (error) {
        throw new Error('Could not delete the product: ' + error.message);
    }
};

exports.getProductsByFilter = async (query) => {
    var esQuery = getESQuery(query);

    const products = mapESProductsToProducts(
        await elastic.searchDocuments(
            Constants.ELASTIC_INDEX_NAME, esQuery,
            {
                bestSelling: {
                    order: 'desc',
                    unmapped_type: 'date',
                    missing: 0
                },
            },
        )
    );
    return products;
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
            name: { type: 'text', analyzer: "edge_ngram_analyzer" },
            description: { type: 'text', analyzer: "edge_ngram_analyzer" },
            price: { type: 'double' },
            bestSelling: { type: 'date' },
            categoryId: { type: 'keyword' },
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
            supplierId: { type: 'keyword' },
        },
    };
}

function getESQuery(query) {
    const mustClauses = [];

    addTextClause(query, mustClauses);
    addCategoryClause(query, mustClauses);
    addSupplierClause(query, mustClauses);
    addPriceClause(query, mustClauses);
    addVariantsClause(query, mustClauses);

    return mustClauses;
}

function addTextClause(query, mustClauses) {
    if (query.text !== undefined && query.text.trim() !== '') {
        mustClauses.push({
            query_string: {
                query: `*${query.text}*`,
                fields: ['name', 'description'],
            },
        });
    }
}

function addCategoryClause(query, mustClauses) {
    if (query.category !== undefined) {
        mustClauses.push({
            match_phrase: {
                categoryId: query.category,
            },
        });
    }
}

function addSupplierClause(query, mustClauses) {
    if (query.supplier !== undefined) {
        mustClauses.push({
            match_phrase: {
                supplierId: query.supplier,
            },
        });
    }
}

function addPriceClause(query, mustClauses) {
    if (query.price !== undefined) {
        mustClauses.push({
            range: {
                price: {
                    gte: query.price,
                    lte: query.price + 0.01,
                },
            },
        });
    }
}

function addVariantsClause(query, mustClauses) {
    if (query.variants && query.variants.attributes && query.variants.attributes.length > 0) {
        const variantShouldClauses = query.variants.attributes.map((attribute) => createAttributeClause(attribute));
        mustClauses.push(createNestedVariantsClause(variantShouldClauses));
    }
}

function createAttributeClause(attribute) {
    return {
        nested: {
            path: "variants.attributes",
            query: {
                bool: {
                    must: [
                        {
                            match_phrase: {
                                "variants.attributes.key": attribute.key,
                            },
                        },
                        {
                            match_phrase: {
                                "variants.attributes.value": attribute.value,
                            },
                        },
                    ],
                },
            },
        },
    };
}

function createNestedVariantsClause(variantShouldClauses) {
    return {
        nested: {
            path: "variants",
            query: {
                bool: {
                    should: variantShouldClauses,
                    minimum_should_match: 1,
                },
            },
        },
    };
}

function mapESProductsToProducts(esProducts) {
    mappedProducts = esProducts.map((elasticsearchProduct) => {
        var {
            _id,
            _source: {
                name,
                description,
                price,
                categoryId,
                variants,
                supplierId,
                bestSelling,
            },
        } = elasticsearchProduct;

        mappedVariants = variants.map((variant) => {
            var {
                attributes,
                price: variantPrice,
            } = variant;

            mappedAttributes = attributes.map((attribute) => {
                var { key, value } = attribute;
                return {
                    key,
                    value,
                };
            });

            return {
                attributes: mappedAttributes,
                price: variantPrice,
            };
        });

        return {
            _id,
            name,
            description,
            price,
            categoryId,
            variants: mappedVariants,
            supplierId,
            bestSelling,
        };
    });

    return mappedProducts;
}

function sanitizeProduct(product) {
    const sanitizedProduct = {};

    const replaceSpecialChars = (value) => {
        return value.replace(/[^\w\s]/gi, ' ');
    };

    if (product.name) {
        sanitizedProduct.name = replaceSpecialChars(product.name.substring(0, 100)).trim();
    }

    if (product.description) {
        sanitizedProduct.description = replaceSpecialChars(product.description.substring(0, 250)).trim();
    }

    if (product.price !== undefined) {
        const updatedPrice = parseFloat(product.price);
        if (!isNaN(updatedPrice) && updatedPrice >= 0) {
            sanitizedProduct.price = updatedPrice;
        } else {
            throw new Error('Invalid price! Price must be a non-negative numeric value.');
        }
    }
    sanitizedProduct.categoryId = product.categoryId
    sanitizedProduct.supplierId = product.supplierId
    sanitizedProduct.variants = product.variants

    if (product.bestSelling !== undefined) {
        sanitizedProduct.bestSelling = product.bestSelling * 1000
    }

    return sanitizedProduct;
};

async function validateProduct(product) {
    if (product.categoryId) {
        try {
            await Category.getCategoryById(product.categoryId)
        } catch (error) {
            throw new Error('Invalid CategoryId')
        }
    }

    if (product.supplierId) {
        try {
            await Supplier.getSupplierById(product.supplierId)
        } catch (error) {
            throw new Error('Invalid SupplierId')
        }
    }

    if (product.variants) {
        if (!Array.isArray(product.variants)) {
            throw new Error('Invalid variants! Variants must be an array.');
        }
    }
    if (product.bestSelling !== undefined) {
        sanitizedProduct.bestSelling = product.bestSelling * 1000
    }
};