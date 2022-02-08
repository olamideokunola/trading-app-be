let { sendUserPasswordEmailNotification } = require("../mailer/emailNotification")

let ManageUsers = class {

    constructor(userRepository) {
        this.userRepository = userRepository
        // this.noAccountResponse = { merchantAccount: null, msg: 'Account does not exist' } 
        // this.accountExistsResponse = { merchantAccount: null, msg: 'Account already exists, no need to create' } 
    }

    async getUserAccounts(){
        try {
            return await this.userRepository.getUserAccounts()
        } catch (error) {
            console.error(error) 
            return   
        }   
    }

    async getRoles(){
        try {
            return await this.userRepository.getRoles()
        } catch (error) {
            console.error(error) 
            return   
        }   
    }

    async createEmployeeUser(userData){
        try {
            
            let userExists = await this.userRepository.userExists({email: userData.email})
            if(userExists) return { success: false, message:"User already exists!" }
            
            let pwd = this.userRepository.generateRandomPassword()
            let encoded = await this.userRepository.encodePassword(pwd)
            
            console.log(`password generated ${pwd}`)

            if (encoded) userData.password = encoded
            
            await sendUserPasswordEmailNotification(userData.email, pwd)
            
            return { success: true, newUserAccount: await this.userRepository.createEmployeeUser(userData) }
        } catch (error) {
            console.error(error) 
            return   
        }  
    }
}

module.exports = ManageUsers