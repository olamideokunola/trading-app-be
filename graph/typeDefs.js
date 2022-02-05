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
    firstName: String
    middleName: String
    lastName: String
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
    roles: [Role]
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
  }

  type Mutation {
    addUser(email: String, password: String, country: String): User
    createTraderAccount(email: String, firstName: String, middleName: String, lastName: String, address: String, idTypeId: Int, idPath: String, country: String): TraderAccount
    resetPassword(email: String): PasswordResetResponse
    changePassword (passwordResetToken: String, email: String, password: String): PasswordChangeResponse
    createMerchantAccount (email: String, firstName: String, middleName: String, lastName: String, address: String, country: String, companyName: String, state: String, phoneNumber: String, registrationNumber: String, store: String, storeUrl: String): MerchantAccount
  }
`;

module.exports = typeDefs