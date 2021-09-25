import gql from "graphql-tag";

export const PLACE_ORDER = gql`
  mutation(
    $coupon_id: ID
    $sub_total: Float
    $discount_amount: Float
    $shipping_charge: Float
    $total: Float
    $address: String
    $schedule: String
    $details: [OrderDetailInput]
    $payment_method: String
  ) {
    placeOrder(
      coupon_id: $coupon_id
      sub_total: $sub_total
      discount_amount: $discount_amount
      shipping_charge: $shipping_charge
      total: $total
      address: $address
      schedule: $schedule
      details: $details
      payment_method: $payment_method
    ) {
      id
      customer_id
      coupon_id
      sub_total
      discount_amount
      shipping_charge
      total
      address
      schedule
      details {
        product {
          id
          name
        }
        quantity
      }
      payment_method
      payment_status
      transaction_id
      status
      redirect_url
    }
  }
`;

export const GET_PAYMENT = gql`
  mutation($paymentInput: String!) {
    charge(paymentInput: $paymentInput) {
      status
    }
  }
`;

export const CREATE_PRODUCT_REQUEST = gql`
  mutation(
    $product_name: String
    $contact_number: String
    $product_description: String
  ) {
    createProductRequest(
      product_name: $product_name
      contact_number: $contact_number
      product_description: $product_description
    ) {
      id
      product_name
      contact_number
      product_description
    }
  }
`;
