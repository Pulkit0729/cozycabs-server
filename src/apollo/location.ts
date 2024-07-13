import gql from "graphql-tag";

export const locationTypeDefs = gql`
    type Location {
        type: String!
        coordinates: [Float]
        }
    input LocationInput {
        type: String!
        coordinates: [Float]
        }`