const { ApolloServer, gql } = require('apollo-server-express');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  type User {
    id: Int
    email: String
    country: String
    password: String
    roles: [Role]
  }

  type Role {
    name: String
    description: String
  }

  type Country {
    id: Int
    name: String
    code: String
  }

  type IdType {
    id: Int
    name: String
    description: String
  }

  type TraderAccount {
    firstName: String
    middleName: String
    lastName: String
  }

  type Currency {
    symbol: String
    description: String
  }

  type PasswordResetResponse {
    email: String
    msg: String
  }

  type PasswordChangeResponse {
    email: String
    successful: Boolean
    msg: String
  }

  type MerchantAccount {
    id: ID
    registrationNumber: String
    firstName: String
    middleName: String
    lastName: String
    phoneNumber: String
    email: String
    address: String
    country: String
    state: String
    store: String
    storeUrl: String
    companyName: String
    storeId: String
  }

  type UserAccount {
    id: Int
    email: String
    firstName: String
    middleName: String
    lastName: String
    address: String
    phoneNumber: String
    country: String
    roles: [Role]
  }

  type TraderAccount {
    id: Int
    email: String
    firstName: String
    middleName: String
    lastName: String
    idPath: String
    address: String
    phoneNumber: String
    country: String
  }

	type PaymentSuccessEmailNotification {
		paymentId: String!
		vendorId: String!
		fiatSymbol: String!
		fiatAmount: Float!
		tokenQty: Float!
		tokenSymbol: String!
		vendorName: String!
		payerEmail: String! 
		paymentDate: String!
		network: String!
		walletAddress: String!
	}
	
  # Input types

  input UserAccountInput {
    id: ID
    email: String 
    firstName: String 
    middleName: String
    lastName: String
    address: String
    country: String
    phoneNumber: String 
    roles: [String]
  }

  input MerchantAccountInput {
    id: ID
    email: String
    firstName: String
    middleName: String
    lastName: String
    address: String 
    country: String
    companyName: String
    state: String
    phoneNumber: String
    registrationNumber: String
    store: String
    storeUrl: String
  }

  # Mutation Responses

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type UserAccountQueryResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    userData: UserAccount
  }

  type MerchantsQueryResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    merchants: [MerchantAccount]
  }

  type MerchantQueryResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    merchant: MerchantAccount
  }

  type TradersQueryResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    traders: [TraderAccount]
  }

  type TraderQueryResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    trader: TraderAccount
  }
	
	type PaymentSuccessEmailNotificationResponse implements MutationResponse {
		code: String!
    success: Boolean!
    message: String!
    paymentSuccessEmailNotification: PaymentSuccessEmailNotification
	}
	
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  
  type Query {
    users: [User]
    countries: [Country]
    idTypes: [IdType]
    defaultCurrency(country: String): Currency
    userAccounts: [UserAccount]
    roles: [Role]
    userAccount(id: ID): UserAccountQueryResponse
    merchants: MerchantsQueryResponse
    merchant(id: ID): MerchantQueryResponse
    traders: TradersQueryResponse
    trader(id: ID): TraderQueryResponse
  }

  type Mutation {
    addUser(email: String, password: String, country: String): User
    createTraderAccount(email: String, firstName: String, middleName: String, lastName: String, address: String, idTypeId: Int, idPath: String, country: String): TraderAccount
    resetPassword(email: String): PasswordResetResponse
    changePassword (passwordResetToken: String, email: String, password: String): PasswordChangeResponse
    createMerchantAccount (email: String, firstName: String, middleName: String, lastName: String, address: String, country: String, companyName: String, state: String, phoneNumber: String, registrationNumber: String, store: String, storeUrl: String): MerchantAccount
    updateMerchantAccount (merchantData: MerchantAccountInput!): MerchantQueryResponse
    createEmployeeUserBkp (email: String, firstName: String, middleName: String, lastName: String, address: String, country: String, phoneNumber: String, roles: [String]): UserAccountQueryResponse
    createEmployeeUser (userData: UserAccountInput!): UserAccountQueryResponse
    changeNewPassword (email: String, password: String): PasswordChangeResponse
    saveEmployeeUser (userData: UserAccountInput!): UserAccountQueryResponse
    sendPaymentSuccessEmailNotification(paymentId: String!, vendorId: String!, fiatSymbol: String!, fiatAmount: Float!, tokenQty: Float!, tokenSymbol: String!, vendorName: String!, payerEmail: String!, paymentDate: String!, network: String!, walletAddress: String!): PaymentSuccessEmailNotificationResponse
  }
  
`;

module.exports = typeDefs
