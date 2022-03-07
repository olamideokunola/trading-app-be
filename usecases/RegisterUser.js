const { TraderAccount } = require("../entities/entities")
let { sendPasswordResetEmailNotification, sendAccountDoesNotExistEmailNotification, sendPasswordChangeSuccessfulNotification } = require("../mailer/emailNotification")
const { decode } = require("jsonwebtoken")


let RegisterUser = class {

    constructor(userRepository) {
        this.userRepository = userRepository
        this.noAccountResponse = { traderAccount: null, msg: 'Account does not exist' } 
        this.accountExistsResponse = { traderAccount: null, msg: 'Account already exists, no need to create' } 
    }

    async createUser(userData) {
        try {
            // console.log('in usecase, about to create user')
            
            let userExists = await this.userRepository.userExists(userData)

            // console.log(`user exists is ${userExists}`)

            if(!userExists) {
                // console.log('user exists check completed!')
                return await this.userRepository.createUser(userData)
            }
        } catch (err) {
            console.error(err)
        }
    }

    async encodePassword(password){
        let encoded = await this.userRepository.encodePassword(password)
        return encoded
    }

    async createTraderAccount({ email, accountData }) {
        try {   
            console.log(`in CreateAccount.execute, email is ${email}`)
            //  if user exists and there are no accounts then create accountt
            let userExists = await this.userRepository.userExists({email})

            if(userExists) {
                console.log(`user exists`)
                
                let result = await this.userRepository.getAccount({ email })

                if(!result) return
                
                let traderAccount = result.traderAccount

                let newTradeAccount

                if(!traderAccount) {
                    console.log(`traderAccount does not exist, about to create!`)
                    traderAccount = await this.userRepository.createTraderAccount({ email, accountData })

                    console.log(traderAccount)

                    if(traderAccount) {
                        // Create role and associate with User in UserRole
                        let { role, user } = await this.userRepository.createTraderRoleForUser(email)

                        console.log(traderAccount)
                        console.log(role)
                        console.log(user)

                        let idType = await this.userRepository.getIdDoc(accountData.idTypeId)
                        console.log(idType)

                        let defaultCurrency = await this.userRepository.getDefaultCurrency(accountData.country)
                        console.log(defaultCurrency)

                        let currencies = await this.userRepository.getCurrencies(user.id)
                        console.log(currencies)
                        
                        traderAccount.country = user.country
                        newTradeAccount = new TraderAccount({...traderAccount}, user.id, role, idType, defaultCurrency, currencies)
                        console.log(newTradeAccount)
                    }
                    console.log(newTradeAccount)
                    return !newTradeAccount ? noAccountResponse : { traderAccount: newTradeAccount }
                }    
                console.log(`traderAccount already exist, no need to create!`)
                console.log(traderAccount)
                return this.accountExistsResponse
            }
            console.log(`In CreateAccount.execute user does not exist`)
            return this.noAccountResponse
        } catch (err) {
            console.error(err)
        }
    }

    async addWalletAccount({ email, walletAccountData }) {
        try {
            console.log(`In addWalletAccount, email is ${email}`)
            let userExists = await this.userRepository.userExists({email})

        if(userExists) {
            console.log(`user exists`)
            let { traderAccount } = await this.userRepository.getAccount({ email })
            
            if(!traderAccount) {
                console.log(`traderAccount does not exist, cannot add wallet account!`)
                return 
            }

            traderAccount  = await this.userRepository.addWalletAccount({email, walletAccountData})
            
            console.log(`traderAccount does exist, its crypto accounts is ${Object.keys(traderAccount.cryptoAccounts)}!`)
            console.log(traderAccount)
            return {traderAccount}
        }
            console.log(`In ResgiterUser.addWalletAccount, user does not exist`)
            return this.noAccountResponse
        } catch (err) {
            console.error(err)
        }
    }

    async checkAccount(email){
        console.log(`in checkAccountAndDeleteToken,  email is ${email}`)
        // check if account exists
        let userExists = await this.userRepository.userExists({email})
        console.log(`userExists is ${userExists}`)
        console.log(`1 email is ${email}`)
        
        // send notificattion that account does not exist
        if (!userExists) await sendAccountDoesNotExistEmailNotification(email)
            
        console.log(email)
        console.log(`2 email is ${email}`)
    }

    async deleteToken(email){
        // reset any tokens
        let tokenDeleted = await this.userRepository.deletePasswordResetToken({email})

        if(!tokenDeleted) return
    }

    async resetPassword(email) {
        
        await this.checkAccount(email)
        await this.deleteToken(email)
        
        // create and store new timestamped reset token
        let { newToken } = await this.userRepository.createPasswordResetToken({email})

        // send notificattion with password reset url
        await sendPasswordResetEmailNotification(email, newToken)

        return "Reset successful"
    
    }

    async verifyPasswordResetToken(email, passwordResetToken){
        console.log(`in verifyPasswordResetToken, passwordResetToken is ${passwordResetToken}`)

        // todo: check that token is valid, receive token from front end
        
        let tokenInDb = await this.userRepository.tokenInDb(email, passwordResetToken)

        if(!tokenInDb) {
            console.log('Password reset token not in db, it is invalid')
            return {successful: false, msg: "Token not in db, it is invalid"}
        }

        let decoded = this.userRepository.verifyToken(passwordResetToken)  

        console.log(`decoded: `)
        console.log(decoded)

        if(!decoded) return

        let currentTime = Number(new Date()) / 1000 

        console.log(`currentTime is ${currentTime}`)

        if(currentTime > decoded.exp) {
            console.log('Password reset token expired')
            return {successful: false, msg: "Token expired"}
        } else {
            console.log('Password reset token')
            return {successful: true, msg: "Token valid"}
        }
    }

    async changePassword(email, password) {

        console.log(`in changePassword, about to change password, email is ${email}`)

        // check account
        await this.checkAccount(email)   

        // encode and change password
        console.log(`in changePassword, about to encode password`)
        
        let encoded = await this.userRepository.encodePassword(password)
        let { success } = await this.userRepository.changePassword({email, password: encoded})

        if(success) console.log(`in changePassword, password changed`)

        // delete reset token
        await this.deleteToken(email)
        
        // send notificattion of success
        if(success) await sendPasswordChangeSuccessfulNotification(email)

        return { successful: true, msg: "Change successful" }
    }
}

module.exports = RegisterUser