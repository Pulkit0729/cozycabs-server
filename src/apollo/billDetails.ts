import gql from 'graphql-tag';

export const billDetailsTypeDef = gql`
  type BillDetails {
    itemTotal: Float!
    discountItemTotal: Float!
    promoDiscount: Float!
    tax: Float!
    grandTotal: Float!
  }

  input BillDetailsInput {
    itemTotal: Float!
    discountItemTotal: Float!
    promoDiscount: Float!
    tax: Float!
    grandTotal: Float!
  }
`;
