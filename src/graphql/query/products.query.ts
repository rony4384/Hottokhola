import gql from "graphql-tag";

export const GET_PRODUCTS = gql`
  query getProducts(
    $type: String
    $sortByPrice: String
    $text: String
    $category: String
    $page: Int
    $offer: Boolean
    $status: ActiveStatus
  ) {
    products(
      type: $type
      sortByPrice: $sortByPrice
      searchText: $text
      category: $category
      page: $page
      offer: $offer
      status: $status
    ) {
      data {
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
      paginatorInfo {
        total
        currentPage
        lastPage
        hasMorePages
      }
    }
  }
`;
