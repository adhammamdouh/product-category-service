const { Client } = require('@elastic/elasticsearch');

const elasticsearch = function () {
    let esClient = null;

    const init = (config) => {
        console.log('Trying to connect to Elasticsearch at ' + `http://${config.host}:${config.port}`);
        esClient = new Client({ node: `http://${config.host}:${config.port}` });
        return esClient;
    };

    const close = () => {
        if (esClient) {
            console.log('Elasticsearch connection closed');
            esClient.close()
        }
    };

    const createIndex = async (index_name, model_mapping) => {
        try {
            const indexExists = await esClient.indices.exists({ index: index_name });

            if (indexExists.body) {
                console.log(`Index '${index_name}' already exists. Skipping creation.`);
                return;
            }

            const { body: result } = await esClient.indices.create({
                index: index_name,
                body: {
                    mappings: model_mapping,
                },
            });

            console.log('Index created:', result);
            return result;
        } catch (error) {
            console.error('Error creating index:', error);
            throw error;
        }
    };

    const indexDocument = async (index_name, body, id) => {
        try {
            const { body: result } = await esClient.index({
                index: index_name,
                id: id,
                body: body
            });
            console.log('Document indexed:', result);
            return result;
        } catch (error) {
            console.error('Error indexing document:', error);
            throw error;
        }
    };

    const searchDocuments = async (index_name, query) => {
        try {
            const { body: result } = await esClient.search({
                index: index_name,
                body: {
                    query
                }
            });
            console.log('Search results:', result.hits.hits);
            return result.hits.hits;
        } catch (error) {
            console.error('Error searching documents:', error);
            throw error;
        }
    };

    return {
        init: init,
        close: close,
        createIndex: createIndex,
        indexDocument: indexDocument,
        searchDocuments: searchDocuments
    };
}();

module.exports = elasticsearch;