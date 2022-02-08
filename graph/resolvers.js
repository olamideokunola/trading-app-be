
const { registerUser, registerMerchant, manageUsers } = require('../usecases');
const { User, Country, IdType, Currency } =  require('../db/models')

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    users: async (parent, args, context) => { 

      if (!context.user) return null

      let users = await User.findAll()

      let result = users.map(user => {
        return {
          email: user.email,
          password: user.password,
          country: user.country,
          roles: user.getRoles()
        }
      })

      return result
    },
    countries: async (parent, args, context) => {
      let countries = await Country.findAll()

      let result = countries.map(country => {
        return {
          id: country.id,
          name: country.name,
          code: country.code
        }
      })

      return result
    },
    idTypes: async (parent, args, context) => {
      let idTypes = await IdType.findAll()
      
      let result = idTypes.map(idType => {
        return {
          id: idType.id,
          name: idType.name,
          description: idType.description
        }
      })

      return result
    },
    defaultCurrency: async(parent, args, context) => {

      console.log(`in defaultCurrency, country is ${args.country}`)

      if (!context.user) return null

      let country = await Country.findOne({where: {name: args.country}})

      if(!country) {
        console.log(`country not loaded`)
        return
      }

      console.log(`country loaded ${args.country}`)
      console.log(country)

      let currency = await country.getCurrency()

      return currency.toJSON()
    
    },
    userAccounts: async (parent, args, context) => {
      console.log(`in userAccounts of resolver, user is`)
      console.log(context.user)
      if (!context.user || !context.user.isAdmin) return null
      
      let userAccounts = await manageUsers.getUserAccounts()
      console.log(`in userAccounts of resolver, userAccounts gotten`)
      console.log(userAccounts)

      return userAccounts
    },
    roles: async (parent, args, context) => {
      console.log(`in roles`)
      console.log(context.user)
      if (!context.user || !context.user.isAdmin) return null

      let roles = await manageUsers.getRoles()
      console.log(`in roles of resolver, roles gotten`)
      console.log(roles)

      return roles
    }
  },
  Mutation: {
    addUser: async(parent, args, context) => {
      // if (!context.user) return null
      console.log('in add user mutation')

      let user = await registerUser.createUser({
        email: args.email,
        password: await registerUser.encodePassword(args.password),
        country: args.country
      })
      
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        country: user.country,
      }

    },
    createTraderAccount: async(parent, args, context) => {
      // if (!context.user) return null
      console.log('in createTraderAccount mutation')

      let {traderAccount} = await registerUser.createTraderAccount({
        email: args.email,
        accountData: args
      })
    
      return {
        ...traderAccount
      }      

    },
    resetPassword: async(parent, args, context) => {
      console.log(`in reset password, email is ${args.email}`)

      await registerUser.resetPassword(args.email)
      console.log(`email has been sent`)

      // if(!response) return

      // console.log(`response is ${response}`)

      return {
        email: args.email, 
        msg: "Email sent"
      }
    },
    changePassword: async(parent, args, context) => {
      console.log(`in change password of resolver, email is ${args.email}`)

      let {successful, msg} = await registerUser.verifyPasswordResetToken(args.email, args.passwordResetToken)

      if (!successful) { 
        
        console.log('password reset token invalid or expired')
        
        return {
          email: args.email, 
          successful,
          msg
        }
      }

      await registerUser.changePassword(args.email, args.password)
      console.log(`email has been sent`)

      return {
        email: args.email,
        successful,
        msg
      }
    },
    createMerchantAccount: async (parent, args, context) => {
      console.log(`in createMerchantAccount of resolver, email is ${args.email}`)

      let newMerchant = await registerMerchant.createMerchantAccount({
        email: args.email, 
        firstName: args.firstName, 
        middleName: args.middleName, 
        lastName: args.lastName, 
        address: args.address, 
        country: args.country, 
        companyName: args.companyName,
        state: args.state, 
        phoneNumber: args.phoneNumber, 
        registrationNumber: args.registrationNumber, 
        store: args.store, 
        storeUrl: args.storeUrl
      })

      if(!newMerchant) return

      console.log(newMerchant)

      return newMerchant
    },
    createEmployeeUser: async (parent, args, context) => {
      console.log(`in createEmployeeUser of resolver, email is ${args.userData.email}`)

      if (!context.user && !context.user.isAdmin) return null

      let { success, message, newUserAccount } = await manageUsers.createEmployeeUser({
        email: args.userData.email, 
        firstName: args.userData.firstName, 
        middleName: args.userData.middleName, 
        lastName: args.userData.lastName, 
        address: args.userData.address, 
        country: args.userData.country, 
        phoneNumber: args.userData.phoneNumber, 
        roles: args.userData.roles
      })

      console.log(newUserAccount)

      if(!success) return { code: 200, success: false, message }
      return { code: 200, success: true, message:"Employee User successfully created!", userData: newUserAccount }
    } 
  }
};

module.exports = resolvers