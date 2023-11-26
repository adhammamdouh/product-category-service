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

    const createIndex = async (indexName, modelMapping) => {
        try {
            const indexExists = await esClient.indices.exists({ index: indexName });

            if (indexExists.body) {
                console.log(`Index '${indexName}' already exists. Skipping creation.`);
                return;
            }

            const { body: result } = await esClient.indices.create({
                index: indexName,
                body: {
                    mappings: modelMapping,
                },
            });

            console.log('Index created:', result);
            return result;
        } catch (error) {
            console.error('Error creating index:', error);
            throw error;
        }
    };

    const indexDocument = async (indexName, id, body) => {
        try {
            const { body: result } = await esClient.index({
                index: indexName,
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

    const searchDocuments = async (indexName, query) => {
        try {
            const { body: result } = await esClient.search({
                index: indexName,
                body: {
                    query,
                },
            });
            console.log('Search results:', result.hits.hits);
            return result.hits.hits;
        } catch (error) {
            console.error('Error searching documents:', error);
            throw error;
        }
    };

    const updateDocument = async (indexName, id, updatedFields) => {
        try {
            const { body: result } = await esClient.update({
                index: indexName,
                id: id,
                body: {
                    doc: updatedFields,
                },
            });

            console.log('Document updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating document:', error.stack || error.message);
            throw error;
        }
    };

    const getAllDocuments = async (indexName) => {
        try {
          const response = await esClient.search({
            index: indexName,
            body: {
              query: {
                match_all: {},
              },
            },
          });
          if (response && response.body) {
            return response.body.hits.hits;
          } else {
            throw new Error('Invalid Elasticsearch response');
          }
        } catch (error) {
          console.error('Error retrieving documents from Elasticsearch:', error.message);
          throw error;
        }
      }

    return {
        init: init,
        close: close,
        createIndex: createIndex,
        indexDocument: indexDocument,
        searchDocuments: searchDocuments,
        updateDocument: updateDocument,
        getAllDocuments: getAllDocuments
    };
}();

module.exports = elasticsearch;