import gql from 'graphql-tag';

export const sectionTypeDefs = gql`
  union Section = ListTile | ListView

  input SectionInput {
    type: SectionType!
    listTile: ListTileInput
    listView: ListViewInput
  }

  enum SectionType {
    ListTile
    ListView
  }
`;
