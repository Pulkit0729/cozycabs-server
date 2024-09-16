import gql from 'graphql-tag';

export const listTileTypeDefs = gql`
  type ListTile {
    icon: String
    title: String
    subtitle: String
    action: String
  }

  input ListTileInput {
    icon: String
    title: String
    subtitle: String
    action: String
  }
  input ListTileUpdateInput {
    icon: String
    title: String
    subtitle: String
    action: String
  }
`;
