var { User, Role, TraderAccount, IdType, CryptoAccount, Country, Currency, EmployeeAccount } = require('../db/models')
let UserEntity = require('../entities/entities').User
let TraderAccountEntity = require('../entities/entities').TraderAccount
let Op = require('sequelize').Op

class DatabaseAccessService {

    constructor() {
        this.finders = {
            findAlls:{ 
                user: async (userData) => {
                    let users = await User.findAll({
                        // attributes: [ 'email', 'country'],
                        where: {
                            email: userData.email
                        }
                    })
                    if (users.length > 0) {
                        return users.map(user => new UserEntity(user.toJSON()))
                    }
                    return null
                } 
            },
            findOnes: {
                user: async (userData) => {
                    let user = await User.findOne({
                        // attributes: [ 'email', 'country'],
                        where: {
                            email: userData.email
                        }
                    })
                    if (user) {
                        let newUser = new UserEntity(user.toJSON())
                        return newUser
                    }
                    return null
                } 
            }
        }

        this.creators = { 
            user: async (userData) => {
                let user = await User.create(userData)
                // console.log(`in creators list, about to create user`)
                if(user){
                    // console.log(`user created,, user is:`)
                    // console.log(user.toJSON())
                    let newUser = new UserEntity(user.toJSON())
                    return newUser
                }
                return null
            } 
        }
    }

    async findAll(modelName, modelData) {
        let find = this.finders.findAlls[modelName]
        return await find(modelData)
    }

    async findOne(modelName, modelData) {
        let find = this.finders.findOnes[modelName]
        return await find(modelData)
    }

    async create(modelName, objectData) {
        let create = this.creators[modelName]
        return await create(objectData)
    }

    async getAccount(email) {
        console.log('about to get account')
        let account = await this._getAccount(email)
        if (account) {
            return account.toJSON() // new TraderAccountEntity(account.toJSON())
        }
        console.log(`Account does not exist`)
        return 
    }

    async _getAccount(email) {
        let user = await User.findOne({
            where: {
                email
            }
        })
        console.log(`In _getAccount, user is:`)
        let account //= user.getTraderAccount()
        if (user) {
            console.log(user)
            account = await user.getTraderAccount()
            if(!account) return
            console.log(`In _getAccount, account is:`)
            console.log(account)
            return account
        }
        console.log(`Account does not exist`)
        return 

    }

    // async createTraderAccount({ email, accountData }) {
    //     console.log(email)
    //     let user = this.users.find(user => user.email === email)
    //     accountData.userId = user.id
    //     this.accounts.push(accountData)
    //     console.log("in create trader account")
    //     console.log(this.accounts[this.accounts.length - 1])
    //     return this.accounts[this.accounts.length - 1]
    // }

    async createTraderAccount({ email, accountData }){
        console.log('about to create account')
        // let user = await this.findOne('user', { email })
        let user = await User.findOne({ where: { email }});
        console.log(user)
        if(user) {
            let account = await user.createTraderAccount(accountData)

            console.log(`account created`)
            console.log(account)

            return account.toJSON()
        }
    }

    async createTraderRoleForUser(email){
        console.log(`In createTraderRoleForUser email is ${email}`)
        if(!email){return}
  
        // get role
        let role = await Role.findOne({ where: {name: 'trader'}})// this.roles.find(role => role.name === 'trader')
        console.log(role)
  
        if(!role){return}
  
        // associate with user
        let user = await User.findOne({ where: { email }}); //let user = await this.getUser(email)
        console.log(user)
        if(!user){return}
        
        user.addRole(role)
        // this.userRoles.push({
        //     userId: user.id,
        //     roleId: role.id
        // })
  
        return {user, role}
      }


    async getIdDoc(docId){

        let idType = await IdType.findOne({ where: {id: docId}})
        console.log(idType.toJSON())
        return idType.toJSON() // this.idTypes.find(idType => idType.id === docId)
    }

    async getDefaultCurrency(countryName){
        let country = await Country.findOne({where: {name: countryName}}) // this.countries.find(cnty => cnty.name === countryName)
        let defaultCurrency = await Currency.findOne({where: {id: country.id}}) //this.currencies.find(curr => curr.id === country.id)
        console.log(defaultCurrency)
        return defaultCurrency.toJSON()
    }

    async getCurrencies(userId){
        let traderAccount = await TraderAccount.findOne({where: {id: userId}})//this.TraderCurrencies.filter(tcurr => tcurr.traderId === userId)
        let currencies = await traderAccount.getCurrencies()//traderCurrencies.map(tcurr => this.currencies.find(curr => curr.id === tcurr.currencyId))
        console.log(currencies)
        return currencies
    }

    async addWalletAccount({ email, walletAccountData }) {
        console.log(`in addWalletAccount`)
        let account = this.getAccount(email)
        if(account) {
            let cryptoAccount = await CryptoAccount.create(walletAccountData)
            console.log(`new crypto account is`)
            console.log(cryptoAccount)
            account = await account.addCryptoAccount(cryptoAccount)
            return account
        }
        console.log(`Account does not exist`)
        return  { account: null, msg: `Account does not exist` }
    }

    async deletePasswordResetToken({email}) {
        
        console.log(`in deletePasswordResetToken`)

        let user= await User.findOne({where: {email}})

        if(!user) return

        await user.update({passwordResetToken: ''})

        await user.save()

        return true
    }

    async createPasswordResetToken({email, newToken}) {
        
        console.log(`in createPasswordResetToken`)

        let user= await User.findOne({where: {email}})

        if(!user) return

        await user.update({passwordResetToken: newToken})

        await user.save()

        return true
    }
    
    async tokenInDb(email, passwordResetToken){

        let user = await User.findOne({where: {email}})

        if(!user) return

        let tokenInDb = user.passwordResetToken === passwordResetToken
  
        console.log(`Token is db is ${tokenInDb}`)
  
        return tokenInDb
    }
  
    async changePassword({ email, password}) {
        console.log(`in changePassword`)
        
        let user= await User.findOne({where: {email}})

        if(!user) return

        await user.update({password})

        await user.save()

        return true
    }

    async getUserAccounts(){
        console.log(`in getUserAccounts of databaseAccessService`)
        
        let users = await User.findAll({
            include: [
                {
                    model: Role,
                    where: {
                        [Op.or]: [
                        {name: "admin"},
                        {name: "basicEmployee"},
                        {name: "csaEmployee"}
                        ]
                    }
                },
                {
                    model: EmployeeAccount,
                },
            ]
        })

        if(!users) return

        console.log(users)

        let userAccounts = users.map(user => {
            console.log(user)
            return {
                id: user.id,
                email: user.email,
                firstName: user.EmployeeAccount.firstName,
                middleName: user.EmployeeAccount.middleName,
                lastName: user.EmployeeAccount.lastName,
                address: user.EmployeeAccount.address,
                phoneNumber: user.EmployeeAccount.phoneNumber,
                roles: user.Roles
            } 
        })

        console.log('about to log user accounts')
        console.log(userAccounts)

        return userAccounts
    }

    async getRoles(){
        console.log(`in getRoles of databaseAccessService`)
        
        let roles = await Role.findAll()

        if(!roles) return

        console.log(roles)

        console.log('about to log user accounts')

        return roles
    }

    async createEmployeeUser(userData){
        console.log(`in createEmployeeUser of databaseAccessService`)
        
        // check if user exists if it does exit

        let country = await Country.findOne({where: {code: userData.country}})

        console.log(country)
        console.log('user data is:')
        console.log(userData)

        let newEmployeeUser = await User.create({
            email: userData.email,
            country: country ? country.name : '',
            password: userData.password,
            changePassword: true,
            twoFaCode: '',
            passwordResetToken: '',
            EmployeeAccount: {
                firstName: userData.firstName,
                middleName: userData.middleName,
                lastName: userData.lastName,
                address: userData.address,
                phoneNumber: userData.phoneNumber
            }
        }, {
            include: [{
                association: User.EmployeeAccount,
            }]
        })

        let role = await Role.findOne({where: {name: userData.roles[0]}})

        console.log(role)

        await newEmployeeUser.addRole(role)

        console.log(newEmployeeUser)

        return {
            email: newEmployeeUser.email,
            country: newEmployeeUser.country,
            firstName: newEmployeeUser.EmployeeAccount.firstName,
            middleName: newEmployeeUser.EmployeeAccount.middleName,
            lastName: newEmployeeUser.EmployeeAccount.lastName,
            address: newEmployeeUser.EmployeeAccount.address,           
            phoneNumber: newEmployeeUser.EmployeeAccount.phoneNumber,
            roles: await newEmployeeUser.getRoles(),
        }
    }
}


module.exports = DatabaseAccessService