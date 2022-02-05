const DatabaseAccessService = require('../services/DatabaseAccessService');
const databaseAccessService = new DatabaseAccessService()

let db = require('./TestDatabase')

test.skip('does not find this user in the database', async () => {
    const service = new DatabaseAccessService()
    let user = await service.find('user', {email: "userxxxxxx@mail.com"})
    expect(user).toBeNull();
});


test.skip('finds admin user in the database', async () => {
    const service = new DatabaseAccessService()
    let user = await service.find('user', {email: "admin@mail.com"})
    expect(user).toBeDefined();
});

test.skip('gets an account from the database using email', async () => {
    const service = new DatabaseAccessService()
    let account = await service.getAccount("admin@mail.com")
    expect(account).toBeDefined();
});

describe.skip('tests creation of a user', () => {

    let users = db.users

    test('tests connection to data source', async () => {
        expect(users.length).toBeGreaterThan(0)
    })

    test('tests creation of new user', async () => {
        let userData = {
            email: '300@mail.com'
        }
        console.log(`in test, about to create user`)
        let user = await databaseAccessService.create('user', userData)
        console.log(`in test, created user is`)
        console.log(user)
        expect(user.email).toBe(userData.email)
    })
})

describe('tests getting a user from the database', () => {

    let users = db.users

    test.skip('tests connection to data source', async () => {
        expect(users.length).toBeGreaterThan(0)
    })

    test.skip('tests getting a user with find', async () => {
        let userData = {
            email: '300@mail.com'
        }
        console.log(`in test, about to load a user from database`)
        let user = await databaseAccessService.findOne('user', userData)
        console.log(`in test, created user is`)
        console.log(user)
        expect(user.email).toBe(userData.email)
    })

    test('tests getting an account', async () => {
        let userData = {
            email: 'admin@mail.com'
        }
        console.log(`in test, about to load an account from database`)
        let acct = await databaseAccessService.getAccount(userData.email)
        console.log(`in test, loaded account is`)
        console.log(acct)
        expect(acct.userId).toBe(1)
    })
})

