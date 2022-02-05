var { User, Role } = require('../db/models')
var Web3 = require('web3')
var web3 = new Web3('http://localhost:8545');

var crypto = require('crypto');
var config = require('../config/auth.config')

let createUser = async(UserRepo, userData) => {

}

let createAccount = async (user) => {
    
    //await newUser.save()

    let { address, privateKey } = createBlockChainAccount(user)

    let encryptedPrivateKey = encrypt(privateKey)

    let newUser = await User.create({...user})

    await newUser.createCryptoAccount({ address, privateKey })
    
    console.log(newUser)

    console.log(`address is ${address}, encrypted private key is ${encryptedPrivateKey}`)

    return newUser
}

let createBlockChainAccount = (user) => {
    try {
        // Create new Account
        let acct = web3.eth.accounts.create(user.password)
        console.log(acct);

        return {
            address: acct.address,
            privateKey: acct.privateKey
        }
    } catch (err) {
        console.error(err)
    }
    
}

let encrypt = (privateKey) => {
    
    var cipher = crypto.createCipheriv('aes-128-cbc', config.secret, config.iv);
    var encrypted = cipher.update(privateKey, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
}

module.exports = { createUser }