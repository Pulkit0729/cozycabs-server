import gql from 'graphql-tag';

export const locationTypeDefs = gql`
  type Location {
    type: string!
    coordinates: [Float]
  }
  input LocationInput {
    type: string!
    coordinates: [Float]
  }
`;
