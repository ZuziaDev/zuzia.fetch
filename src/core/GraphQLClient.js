export class GraphQLClient {
  constructor(client) {
    this.client = client;
  }

  async query(query, variables = {}) {
    return this.client.post('/graphql', {
      query,
      variables
    });
  }

  async mutate(mutation, variables = {}) {
    return this.client.post('/graphql', {
      query: mutation,
      variables
    });
  }
} 