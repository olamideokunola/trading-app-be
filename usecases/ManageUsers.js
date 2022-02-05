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
}

module.exports = ManageUsers