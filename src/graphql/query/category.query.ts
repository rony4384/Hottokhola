import gql from "graphql-tag";

export const GET_CATEGORIES = gql`
  query getCategories(
    $type: String
    $searchBy: String
    $parent_id: ID
    $status: ActiveStatus
  ) {
    categories(
      type: $type
      searchBy: $searchBy
      parent_id: $parent_id
      status: $status
      orderBy: [{ field: "position", order: ASC }]
    ) {
      id
      icon
      title
      slug
      type
      childrens {
        id
        title
        slug
        status
      }
      status
    }
  }
`;
