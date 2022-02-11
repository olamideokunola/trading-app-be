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

    async updateMerchantAccount(merchantData){
        try {

            let merchant =  await this.merchantRepository.updateMerchantAccount(merchantData)

            if(!merchant) return { success: false, message: 'Merchant update returned null!' }

            return { success: true, message: 'Merchant updated', merchant }

        } catch (error) {
            console.error(error) 
            return   
        }   
    }

    async getMerchants(){
        try {
            let merchants =  await this.merchantRepository.getMerchants()

            if(!merchants) return { success: false, message: 'Merchants returned null from database!' }

            return { success: true, message: 'Merchants loaded', merchants }
        } catch (error) {
            console.error(error) 
            return { success: false, message: error }
        }
    }

    async getMerchant(id){
        try {
            let merchant =  await this.merchantRepository.getMerchant(id)

            if(!merchant) return { success: false, message: 'Merchant returned null from database!' }

            return { success: true, message: 'Merchant loaded', merchant }
        } catch (error) {
            console.error(error) 
            return { success: false, message: error }
        }
    }
}

module.exports = RegisterMerchant