import { gql } from "apollo-server-express";

export const locationTypeDefs = gql`
    type Location {
        type: String!
        coordinates: [Float]
        }
    input LocationInput {
        type: String!
        coordinates: [Float]
        }`