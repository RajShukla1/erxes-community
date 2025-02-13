import { queries as productQueries } from '@erxes/ui-products/src/graphql';
import { isEnabled } from '@erxes/ui/src/utils/core';

const listParamsDef = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int
  $search: String
  $paidStartDate: Date
  $paidEndDate: Date
  $createdStartDate: Date
  $createdEndDate: Date
  $paidDate: String
  $userId: String
  $customerId: String
  $customerType: String
  $posId: String
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection
  search: $search
  paidStartDate: $paidStartDate
  paidEndDate: $paidEndDate
  createdStartDate: $createdStartDate
  createdEndDate: $createdEndDate
  paidDate: $paidDate
  userId: $userId
  customerId: $customerId
  customerType: $customerType
  posId: $posId
`;

export const orderFields = `
  _id
  createdAt
  status
  paidDate
  number
  customerId
  customerType
  cashAmount
  mobileAmount
  paidAmounts
  totalAmount
  finalAmount
  shouldPrintEbarimt
  printedEbarimt
  billType
  billId
  registerNumber
  oldBillId
  type
  userId
  items
  posToken

  syncedErkhet

  posName
  origin
  user {
    _id
    email
  }
`;

const posOrders = `
  query posOrders(${listParamsDef}) {
    posOrders(${listParamsValue}) {
      ${orderFields}
    }
  }
`;

const posOrdersSummary = `
  query posOrdersSummary(${listParamsDef}) {
    posOrdersSummary(${listParamsValue})
  }
`;

const posOrderDetail = `
  query posOrderDetail($_id: String) {
    posOrderDetail(_id: $_id) {
      ${orderFields}
      ${
        isEnabled('contacts')
          ? `
        customer {
          _id
          code
          firstName
          lastName
          primaryEmail
          primaryPhone
        }
      `
          : ``
      }
      syncErkhetInfo
      putResponses
      deliveryInfo
    }
  }
`;

const posProducts = `
  query posProducts(
    $categoryId: String,
    $searchValue: String,
    ${listParamsDef}
  ) {
    posProducts(
      categoryId: $categoryId,
      searchValue: $searchValue,
      ${listParamsValue}
    ) {
      products {
        _id
        name
        type
        code
        categoryId
        unitPrice
        category {
          _id
          code
          name
        }
        counts
        count
        amount
      }

      totalCount
    }
  }
`;

const productCategories = productQueries.productCategories;

const coverFields = `
  _id
  posToken
  status
  beginDate
  endDate
  description
  userId
  details {
    _id
    paidType    
    paidSummary {
      _id
      kind
      kindOfVal
      value
      amount
    }
    paidDetail
  }
  createdAt
  createdBy
  modifiedAt
  modifiedBy
  note
  posName

  user {
    _id
    email
  }
  createdUser {
    _id
    email
  }
  modifiedUser {
    _id
    email
  }
`;

const coverParams = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int
  $posId: String
  $startDate: Date
  $endDate: Date
  $userId: String
`;

const coverParamsVal = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection
  posId: $posId
  startDate: $startDate
  endDate: $endDate
  userId: $userId
`;

const covers = `
  query posCovers(${coverParams}) {
    posCovers(${coverParamsVal}) {
      ${coverFields}
    }
  }
`;

const coverDetail = `
  query posCoverDetail($_id: String!) {
    posCoverDetail(_id: $_id) {
      ${coverFields}
    }
  }
`;

export default {
  posOrders,
  posOrdersSummary,
  posOrderDetail,
  posProducts,
  productCategories,
  covers,
  coverDetail
};
