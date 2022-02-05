let RegisterMerchant = class {

    constructor(merchantRepository) {
        this.merchantRepository = merchantRepository
        this.noAccountResponse = { merchantAccount: null, msg: 'Account does not exist' } 
        this.accountExistsResponse = { merchantAccount: null, msg: 'Account already exists, no need to create' } 
    }

    async createMerchantAccount(merchantData){
        try {
            return await this.merchantRepository.createMerchantAccount(merchantData)
        } catch (error) {
            console.error(error) 
            return   
        }   
    }
}

module.exports = RegisterMerchant