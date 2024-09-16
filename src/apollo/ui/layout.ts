import gql from 'graphql-tag';

export const layoutTypeDefs = gql`
  type Layout {
    web: [Section]
    mobile: [Section]
  }

  input LayoutInput {
    web: [SectionInput]
    mobile: [SectionInput]
  }
  input LayoutUpdateInput {
    web: [SectionInput]
    mobile: [SectionInput]
  }
`;
