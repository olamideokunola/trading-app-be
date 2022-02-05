var {  MerchantAccount } = require('../db/models')
let UUID = require("uuidjs");

class MerchantsDatabaseAccessService {

    constructor() {
        
    }

    async createMerchantAccount(merchantData){
        console.log(`in createMerchantAccount of MerchantsDatabaseAccessService`)

        let newMerchant = await MerchantAccount.findOne({where: {storeUrl: merchantData.storeUrl}})

        if(newMerchant) return 
        
        let storeId = UUID.generate()

        newMerchant = await MerchantAccount.create({...merchantData, storeId})

        return newMerchant
    }

}

module.exports = MerchantsDatabaseAccessService