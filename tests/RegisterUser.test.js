let RegisterUser = require('../usecases/RegisterUser');
const UserRepository = require('../services/UserRepository');
const DatabaseAccessService = require('../services/DatabaseAccessService');

let UserRepo = class {
    
    constructor () {
        this.users = [
            {
                id: 1,
                email: "admin@mail.com",
                country:"Nigeria"
            },
            {
                id: 2,
                email: "user@mail.com",
                country:"United States"
            }
        ]
        
        console.log('UserRepo created')

        this.roles = [
            {
                id: 1,
                name: 'trader',
                description: 'Crypto Trader'
            },
            {
                id: 2,
                name: 'merchant',
                description: 'Online merchant'
            }
        ]

        this.userRoles = []

        this.accounts = [
            {
                userId: 1,
                firstName: 'fName1',
                middleName:'mName1',
                lastName: 'lName1'
            }
        ]

        this.idTypes = [
            {
                id: 1,
                name: "DL",
                description: "Driver's License"
            }
        ]

        this.countries = [
            {
                id: 1,
                name: "Nigeria",
                continent: "Africa",
                region: "West Africa"
            },
            {
                id: 2,
                name: "Ghana",
                continent: "Africa",
                region: "West Africa"
            }
        ]

        this.currencies = [
            {
                id: 1,
                symbol: "NGN",
                description: "Nigerian Naira"  
            },
            {
                id: 2,
                symbol: "CED",
                description: "Ghanian Cedis"  
            }
        ]

        this.TraderCurrencies = [
            {
                traderId: 1,
                currencyId: 1
            },
            {
                traderId: 2,
                currencyId: 1
            }
        ]
    }
        
    async userExists (userData) {
        console.log(`about to check if user exists, email is ${userData.email}`)
        let exists = !(this.users.find(user => {
            return user.email === userData.email
        })) ? false : true
        console.log(`user exists is ${exists}`)
        return exists
    }
  
    async createUser (userData) {
        console.log('about to create user')
        console.log(userData.email)
        userData.id = this.users.length + 1
        this.users.push[userData]
        return userData
    }

    async getUser(email){
        
        if(!email){return}

        let user = this.users.find(user => user.email === email)

        if(user){
            return user
        }
    }

    async createTraderRoleForUser(email){
        console.log(`In createTraderRoleForUser email is ${email}`)
        if(!email){return}

        // get role
        let role = this.roles.find(role => role.name === 'trader')
        console.log(role)

        if(!role){return}

        // associate with user
        let user = await this.getUser(email)
        console.log(user)
        if(!user){return}

        this.userRoles.push({
            userId: user.id,
            roleId: role.id
        })

        return {user, role}
    }

    async getAccount(userData) {  
        // get user using email        
        let user = this.users.find(user => user.email === userData.email)
        
        let nullAccountAResponse = { traderAccount: null, msg: 'Account not found'}
        if(!user){
            console.log(`user for new account not found`)
            return nullAccountAResponse
        }
        console.log(`user for new account has email: ${user.email}`)
        
        let account = this.accounts.find(acct => acct.userId === user.id)
        console.log(`user account in db is: ${account}`)

        return !account ? nullAccountAResponse : { traderAccount: account }
    }

    async getIdDoc(docId){
        return this.idTypes.find(idType => idType.id === docId)
    }

    async getDefaultCurrency(countryName){
        let country = this.countries.find(cnty => cnty.name === countryName)
        let defaultCurrency = this.currencies.find(curr => curr.id === country.id)
        console.log(defaultCurrency)
        return defaultCurrency
    }

    async getCurrencies(userId){
        let traderCurrencies = this.TraderCurrencies.filter(tcurr => tcurr.traderId === userId)
        let currencies = traderCurrencies.map(tcurr => this.currencies.find(curr => curr.id === tcurr.currencyId))
        console.log(currencies)
        return currencies
    }

    async createTraderAccount({ email, accountData }) {
        console.log(email)
        let user = this.users.find(user => user.email === email)
        accountData.userId = user.id
        this.accounts.push(accountData)
        console.log("in create trader account")
        console.log(this.accounts[this.accounts.length - 1])
        return this.accounts[this.accounts.length - 1]
    }

    async addWalletAccount({ email, walletAccountData}) {
        let user = this.users.find(user => user.email === email)
        let account = this.accounts.find(acct => acct.userId === user.id)

        console.log('account is:')
        console.log(account)

        account.cryptoAccounts = []
        account.cryptoAccounts.push(walletAccountData)

        console.log(account)
        return account
    }
}

describe('', () => {

    let dataSource = new DatabaseAccessService()
    let repo = new UserRepository(dataSource) //new UserRepo()
    let registerUser = new RegisterUser(repo)
    
    test.skip('creates user successfully', async () => {  

        let user = await registerUser.createUser({email: "userxxyyyxxxx@mail.com", country: "Nigeria"})
        expect(user).toBeTruthy();
        expect(user.id).toBeGreaterThan(0)
    });

    test('creates an account', async() => {
        let email = 'user16@mail.com'
        let accountData = {
            firstName: 'xxFirstName',
            middleName: 'xxMiddleName',
            lastName: 'xxLastName',
            address: 'home',
            idTypeId: 1,
            idPath: "\\images\\xxFirstName",
            country: 'Nigeria'
        }

        let {traderAccount} = await registerUser.createTraderAccount({ email, accountData })
        // let traderAccount = result.traderAccount
        console.log(traderAccount)
        expect(traderAccount.firstName).toBe(accountData.firstName)
        expect(traderAccount.middleName).toBe(accountData.middleName)
        expect(traderAccount.lastName).toBe(accountData.lastName)
        // expect(traderAccount.id).toBeGreaterThan(0)
        expect(traderAccount.idType.id).toBe(accountData.idTypeId)
        expect(traderAccount.idPath).toBe(accountData.idPath)
        expect(traderAccount.roles.length).toBeGreaterThan(0)
        expect(traderAccount.country).toBe(accountData.country)
        
        expect(traderAccount.defaultCurrency.symbol).toBe('NGN')
        // expect(traderAccount.currencies.length).toBeGreaterThan(0)
    })

    test.skip('adds cryptocurrency wallet to user account', async () => {

        let email = 'admin@mail.com'

        let walletAccountData = { 
            address: 'opei9wei023reki2ied3r3fdsdfr34r3ie23ee',
            privateKey: 'klodfi0wepwodokqodkqedp23okqpdkwdoqwd23dkjqdoqnwuidhquwdqfkqwfd'  //encoded
        }

        let { traderAccount } = await registerUser.addWalletAccount({ email, walletAccountData }) 

        expect(traderAccount.cryptoAccounts.length).toBeGreaterThan(0)
    })    
})
