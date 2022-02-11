const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 10

class User extends Model {}
class Role extends Model {}
class EmployeeAccount extends Model {}
class TraderAccount extends Model {}
class MerchantAccount extends Model {}
class IdType extends Model {}
class CryptoAccount extends Model {}
class Country extends Model {}
class Currency extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    twoFaCode: {
        type: DataTypes.STRING,
    },
    passwordResetToken: {
        type: DataTypes.STRING,
    },
    changePassword: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize,
    modelName: 'User'
})

EmployeeAccount.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "EmployeeAccount"
})

Role.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Role'
})

IdType.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type:DataTypes.STRING
    },
}, {
    sequelize,
    modelName: 'IdType'
})

CryptoAccount.init({
    address: {
        type: DataTypes.STRING
    },
    privateKey: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'WalletAccounts'
})

TraderAccount.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    idPath: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'TraderAccount'
})

MerchantAccount.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    registrationNumber: {
        type: DataTypes.STRING
    },
    store: {
        type: DataTypes.STRING
    },
    storeUrl: {
        type: DataTypes.STRING
    },
    companyName: {
        type: DataTypes.STRING
    },
    storeId: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'MerchantAccount'
})

Country.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    continent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Country'
})

Currency.init({
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Currency'
})

// relationships
User.TraderAccount = User.hasOne(TraderAccount)
TraderAccount.belongsTo(User)

User.EmployeeAccount = User.hasOne(EmployeeAccount)
EmployeeAccount.belongsTo(User)

Role.belongsToMany(User, { through: 'UserRoles'})
User.belongsToMany(Role, { through: 'UserRoles'})

IdType.hasMany(TraderAccount)
TraderAccount.belongsTo(IdType)

TraderAccount.hasMany(CryptoAccount)
CryptoAccount.belongsTo(TraderAccount)

Country.Currency = Country.hasOne(Currency)
Currency.belongsTo(Country)

TraderAccount.belongsToMany(Currency, { through: 'TraderAccountCurrencies' })
Currency.belongsToMany(TraderAccount, { through: 'TraderAccountCurrencies' })

let countries = [
    {
        name: 'Nigeria',
        code: 'NG',
        continent: 'Africa',
        region: 'West Africa',
        currency: {
            symbol: 'NGN',
            description: 'Nigerian Naira'
        }
    },
    {
        name: 'Ghana',
        code: 'GH',
        continent: 'Africa',
        region: 'West Africa',
        currency: {
            symbol: 'CED',
            description: 'Ghanian Cedis'
        }
    },
    {
        name: 'Kenya',
        code: 'KE',
        continent: 'Africa',
        region: 'East Africa',
        currency: {
            symbol: 'KES',
            description: 'Kenyan Shillings'
        }
    }
]

let idTypes = [
    { 
        name: 'DL',
        description: "Driver's License"
    }
]

let roles = [
    {
        name: 'trader',
        description: 'Stable coin traders'
    },
    {
        name: 'admin',
        description: 'System administrator'
    },
    {
        name: 'basicEmployee',
        description: 'Basic Employee with minimum authorizations'
    },
    {
        name: 'merchant',
        description: 'Merchants, online store owners'
    },
    {
        name: 'csaEmployee',
        description: 'Customer Service Employee with elevated authorizations'
    },
]

let users = [
    {
        email: 'olamideokunola@yahoo.com',
        password: 'allow',
        country: 'Nigeria',
        twoFaCode: '',
        passwordResetToken: '',
        roles: [
            {
                id: 1,
                name: 'trader',
                description: 'Stable coin traders'
            },
            {
                id: 2,
                name: 'admin',
                description: 'System administrator'
            },
            {
                id: 3,
                name: 'basicEmployee',
                description: 'Basic Employee with minimum authorizations'
            }
        ],
        traderAccount: {
            firstName: 'Olamide',
            middleName:'Olawale',
            lastName: 'Okunola',
            address: "Olamide's home",
            idPath: '//mylicense',
            currencies: []
        },
        employeeAccount: {
            firstName: 'Olamide',
            middleName:'Olawale',
            lastName: 'Okunola',
            address: "Olamide's home",
            phoneNumber: "09090909090"
        }
    },
    {
        email: 'kenyan@cbt.com',
        password: 'enter',
        country: 'Kenya',
        twoFaCode: '',
        passwordResetToken: '',
        roles: [
            {
                id: 1,
                name: 'trader',
                description: 'Stable coin traders'
            }
        ],
        traderAccount: {
            firstName: 'Kenyan',
            middleName:'Test',
            address: "Kenyan's home",
            lastName: 'User',
            idPath: '//Kenyanlicense',
            currencies: []
        }
    },
    {
        email: 'ghanian@cbt.com',
        password: 'enter',
        country: 'Ghana',
        twoFaCode: '',
        passwordResetToken: '',
        roles: [
            {
                id: 2,
                name: 'trader',
                description: 'Stable coin traders'
            },
            {
                id: 3,
                name: 'csaEmployee',
                description: 'Stable coin traders'
            }
        ],
        traderAccount: {
            firstName: 'Ghanian',
            middleName:'Test',
            lastName: 'User',
            address: "Ghanian's home",
            idPath: '//Ghanianlicense',
            currencies: []
        },
        employeeAccount: {
            firstName: 'Ghanian',
            middleName:'Test',
            lastName: 'User',
            address: "Ghanian's home",
            phoneNumber: "09090909090"
        }
    }
]

let merchants = [
    {
        id: 100,
        companyName: 'Company XYZ',
        registrationNumber: '00012121',
        firstName: 'John',
        middleName: 'Ron',
        lastName: 'Smith',
        phoneNumber: '0909090',
        email: 'qwe@mail.com',
        address: 'Company XYZ Address, Lagos',
        country: 'Nigeria',
        state: 'Lagos',
        storeId: 'qweqe3-qweewr3-erewer',
        store: 'XyZ Stores',
        storeUrl: 'https://xyz.com/stores'
    },
    {
        id: 200,
        companyName: 'Company ABC',
        registrationNumber: '12121000',
        firstName: 'Smith',
        middleName: 'Ron',
        lastName: 'James',
        phoneNumber: '0808080',
        email: 'srj@mail.com',
        address: 'Company ABC Address, Lagos',
        country: 'Ghana',
        state: 'Accra',
        storeId: 'erewer-qweewr3-qweqe3',
        store: 'AbC Stores',
        storeUrl: 'https://abc.com/stores'
    }
]

sequelize.sync({ force: true })
.then(async() => {
    // save seed data to dataase
    countries.forEach(async (country, index) => {
        await Country.create({
            name: country.name,
            code: country.code,
            continent: country.continent,
            region: country.region,
            Currency: {
                symbol: country.currency.symbol,
                description: country.currency.description
            }
        }, {
            include: [{
                association: Country.Currency
            }]
        })
    })

    idTypes.forEach(async idtype => {
        await IdType.create({...idtype})
    })

    roles.forEach(async role => {
        await Role.create({...role})
    })

    users.forEach(async user => {
        await User.create({
            email: user.email,
            password: await bcrypt.hash(user.password, saltRounds),
            country: user.country,
            twoFaCode: user.twoFaCode,
            passwordResetToken: user.passwordResetToken,
            Roles: [...user.roles],
            TraderAccount: {
                firstName: user.traderAccount.firstName,
                middleName: user.traderAccount.middleName,
                lastName: user.traderAccount.lastName,
                address: user.traderAccount.address,
                idPath: user.traderAccount.idPath,
                currencies: []
            }
        }, {
            include: [
                {
                    association: User.TraderAccount
                }
            ]
        })

        let userModel = await User.findOne({where:{email: user.email}})

        user.roles.forEach(async role => {
            let rl = await Role.findOne({where:{name: role.name}})
            await userModel.addRole(rl)
        })
        
        if(user.employeeAccount){
            await userModel.createEmployeeAccount({
                firstName: user.employeeAccount.firstName,
                middleName: user.employeeAccount.middleName,
                lastName: user.employeeAccount.lastName,
                address: user.employeeAccount.address,
                phoneNumber: user.employeeAccount.phoneNumber,
            })
        }
    })

    merchants.forEach(async merchant => {
        await MerchantAccount.create({...merchant})
    })

})






// .then(async() => {
//     // if devUser does not exist create
//     let admin
//     let role
//     try{
//         async function getAdmin() {
//             console.log('In getAdmin')

//             console.log(`admin is ${admin}`)

//             let query = {
//                 attributes: ['email', 'country', 'password'],
//                 where: {
//                     email: 'admin@mail.com'
//                 }
//             }

//             let allUsers = await User.findAll(query)
            
//             admin = await User.findOne(query)

//             console.log(`number of users is ${allUsers.length}`)

//             if(admin === null) {
//                 console.log('admin not found ...')                
//             } else {
//                 console.log('admin found ...')
//                 console.log(`admin is ${admin.toJSON()}`)
//                 bcrypt.compare('allow', admin.password).then((result) => {
//                     // result == true
//                     console.log(`${result ? 'Password match!' : 'Password mismatch!'}`)
//                 });
//             }
//         }

//         await getAdmin()

//         if(admin === null){
//             console.log('admin not existing in database')
//             console.log('creating admin...')
            
//             let pwd = 'allow'

//             bcrypt.hash(pwd, saltRounds)
//             .then((hash) => {
//                 // Store hash in your password DB.
//                 console.log(`about to save`)
//                 User.create({
//                     email: 'admin@mail.com',
//                     country: 'Nigeria',
//                     password: hash
//                 })
//                 .then(res => {
//                     admin = res

//                     console.log(`new admin user created: ${admin.toJSON()}`)
//                     console.log(`password hash is ${admin.password}`)
//                 })
//                 .then(() => {
//                     return Role.create({
//                         name: 'admin',
//                         description: 'Administrator'
//                     })
//                 })
//                 .then(role => {
//                     console.log(`new admin role created: ${role.toJSON()}`)
//                     admin.addRole(role)
//                 })
//                 .catch(err => {
//                     console.log(`error creating dev user: ${err}`)
//                 })
//             });            
//         } else {
//             console.log(`admin user existing: ${admin.toJSON()}`)
//             console.log(`password hash is ${admin.password}`)
//         }

//     } catch (e) {
//         console.log(e)
//     }
// })

module.exports = { User, Role, TraderAccount, IdType, CryptoAccount, Country, Currency, MerchantAccount, EmployeeAccount }