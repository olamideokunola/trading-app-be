
class User{
    constructor({ id = null, email, country, twoFaCode, traderAccount, roles }) {
        console.log(`in User constructor`)
        this.id = id
        this.email = email
        this.country = country
        this.twoFaCode = twoFaCode
        this.traderAccount = traderAccount
        this.roles = roles
    }

    roles= []

    addRole(role){
        this.roles.push(role)
    }
}

class Role{
    constructor({id = null, name, description}) {
        this.id = id
        this.name = name
        this.description = description
    }
}

class IdType {
    constructor(id = null, name, description){
        console.log(id)
        this.id = id
        this.name = name
        this.description = description
    }
}

class TraderAccount{
    constructor({ firstName, middleName, lastName, address, cryptoAccounts = null, idPath, country },userId, role, idType,  defaultCurrency, currencies) {
        console.log(`firstName is ${firstName}`)
        console.log(`middleName is ${middleName}`)
        console.log(`lastName is ${lastName}`)
        console.log(`address is ${address}`)
        console.log(`country is ${country}`)
        console.log(`cryptoAccounts is ${cryptoAccounts}`)
        console.log(`userId is ${userId}`)
        role ? console.log(`roleId is ${role.id}`) : ""
        console.log(role)
        console.log(idType)
        this.id = userId
        this.firstName = firstName
        this.middleName = middleName
        this.lastName = lastName
        this.address = address
        this.cryptoAccounts = cryptoAccounts
        this.country = country
        role ? this.roles.push(new Role(role)) : {}
        idType ? this.idType = new IdType(idType.id, idType.name, idType.description) : {}
        this.idPath = idPath
        this.defaultCurrency = defaultCurrency
        this.currencies = currencies
        console.log(this.idType)
    }

    roles = []
    cryptoAccounts = []

    addCryptoAccount(cryptoAccount) {
        this.cryptoAccounts.push(cryptoAccount)
    }
}

class CryptoAccount{
    constructor(id = null, address, privateKey) {
        this.id = id
        this.address = address
        this.privateKey = privateKey
    }
}

module.exports = { User, Role, TraderAccount, CryptoAccount, IdType }