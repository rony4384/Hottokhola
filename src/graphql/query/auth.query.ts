import gql from "graphql-tag";

export const GET_CUSTOMER = gql`
  query getUser($api_token: String) {
    customer(api_token: $api_token) {
      id
      name
      mobile_number
      email
      addresses {
        id
        type
        name
        contact_number
        address
        district
      }
    }
  }
`;

export const GET_CUSTOMER_WITH_SCHEDULE = gql`
  query($api_token: String) {
    customer(api_token: $api_token) {
      id
      name
      mobile_number
      email
      addresses {
        id
        type
        name
        contact_number
        address
        district
      }
    }
    schedules {
      id
      title
      time
      shipping_charge
    }
  }
`;
