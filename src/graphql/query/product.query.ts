import gql from "graphql-tag";

export const GET_PRODUCT_WITH_RELATED_PRODUCTS = gql`
  query getProductWithRelatedProducts($slug: String!, $type: String!) {
    product(slug: $slug) {
      id
      title
      weight
      slug
      price
      type
      image
      categories {
        id
        slug
        title
      }
    }
    relatedProducts(slug: $slug, type: $type) {
      id
      title
      slug
      weight
      price
      type
      image
    }
  }
`;

export const GET_RELATED_PRODUCTS = gql`
  query getRelatedProducts($type: String!, $slug: String!) {
    relatedProducts(type: $type, slug: $slug) {
      id
      title
      slug
      weight
      price
      type
      image
    }
  }
`;

export const GET_PRODUCT = gql`
  query getProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      thumbnail
      description
      unit
      price
      sale_price
      discount_in_percent
      quantity
      purchase_limit
      buy_price
      vendor_id
      type
      status
      categories {
        id
        title
        slug
      }
    }
  }
`;
export const GET_PRODUCT_DETAILS = gql`
  query getProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      thumbnail
      description
      unit
      price
      sale_price
      discount_in_percent
      quantity
      purchase_limit
      buy_price
      vendor_id
      type
      has_variations
      parent_id
      variation_options
      variant
      status
      categories {
        id
        title
        slug
      }
      images {
        id
        img_path
      }
      parent_images {
        id
        img_path
      }
      childrens {
        id
        name
        slug
        variation_options
        variant
      }
      siblings {
        id
        name
        slug
        variation_options
        variant
      }
      parent {
        id
        name
        slug
        variation_options
        variant
      }
    }
  }
`;
