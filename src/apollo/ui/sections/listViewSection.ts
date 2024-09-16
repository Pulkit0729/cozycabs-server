import gql from 'graphql-tag';

export const listViewTypeDefs = gql`
  type ListView {
    data: [ListTile]
    isFetch: Boolean
    fetchWebhook: JSON
  }

  input ListViewInput {
    data: [ListTileInput]
    isFetch: Boolean
    fetchWebhook: JSON
  }
  input ListViewUpdateInput {
    data: [ListTileInput]
    isFetch: Boolean
    fetchWebhook: JSON
  }
`;
