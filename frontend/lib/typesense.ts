import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
        apiKey: 'xyz',
        nodes: [
            {
                host: 'localhost',
                port: 8108,
                protocol: 'http'
            }
        ]
    },
    additionalSearchParameters: {
        query_by: 'email'
    }
});