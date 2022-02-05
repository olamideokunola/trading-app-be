const UserRepository = require('../services/UserRepository');
const DatabaseAccessService = require('../services/DatabaseAccessService')


let dbService = new DatabaseAccessService()
let repo = new UserRepository(dbService)

test.skip('does not find this user in the database', async () => {
    
    let user = await repo.userExists({email: "userxxxxxx@mail.com"})
    expect(user).not.toBeTruthy();
});

test.skip('finds admin user in the database', async () => {
    let dbService = new DatabaseAccessService()
    const repo = new UserRepository(dbService)
    let user = await repo.userExists({email: "admin@mail.com"})
    expect(user).toBeTruthy();
});

test('create email token', async() => {
    let token = await repo.createPasswordResetToken({email:'olamideokunola@yahoo.com'})

    console.log(token)
})