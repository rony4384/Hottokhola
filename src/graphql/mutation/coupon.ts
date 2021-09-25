import gql from "graphql-tag";

export const APPLY_COUPON = gql`
  mutation coupon($code: String!) {
    coupon(code: $code) {
      id
      img_path
      title
      code
      active_from
      active_to
      discount_type
      discount_amount
      maximum_discount
      minimum_purchase_amount
      usage_limit
      for_first_order_only
    }
  }
`;
