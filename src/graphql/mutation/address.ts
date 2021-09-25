import gql from "graphql-tag";

export const ADD_ADDRESS = gql`
  mutation(
    $name: String
    $customer_id: ID
    $contact_number: String
    $type: String
    $address: String
    $district: String
  ) {
    createAddress(
      name: $name
      customer_id: $customer_id
      contact_number: $contact_number
      type: $type
      address: $address
      district: $district
    ) {
      id
      name
      contact_number
      address
      district
    }
  }
`;
export const UPDATE_ADDRESS = gql`
  mutation(
    $id: ID!
    $name: String
    $contact_number: String
    $address: String
    $district: String
  ) {
    updateAddress(
      id: $id
      name: $name
      contact_number: $contact_number
      address: $address
      district: $district
    ) {
      id
      name
      contact_number
      address
      district
    }
  }
`;
export const DELETE_ADDRESS = gql`
  mutation($id: ID!) {
    deleteAddress(id: $id) {
      id
      name
      contact_number
      address
      district
    }
  }
`;
