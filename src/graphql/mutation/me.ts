import gql from "graphql-tag";

export const UPDATE_ME = gql`
  mutation($id: ID!, $name: String, $email: String) {
    updateCustomer(id: $id, name: $name, email: $email) {
      id
      name
      mobile_number
      email
      api_token
    }
  }
`;
