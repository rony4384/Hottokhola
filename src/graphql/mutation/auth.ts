import gql from "graphql-tag";

export const LOGIN = gql`
  mutation($mobile_number: String!) {
    login(mobile_number: $mobile_number) {
      mobile_number
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation($mobile_number: String!, $otp: String!) {
    verify_otp(mobile_number: $mobile_number, otp: $otp) {
      id
      name
      mobile_number
      email
      api_token
      addresses {
        id
        customer_id
        type
        name
        contact_number
        district
      }
    }
  }
`;

export const RESEND_OTP = gql`
  mutation($mobile_number: String!) {
    resend_otp(mobile_number: $mobile_number) {
      mobile_number
    }
  }
`;
