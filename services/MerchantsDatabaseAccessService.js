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

    async updateMerchantAccount(merchantData){
        console.log(`in updateMerchantAccount of MerchantsDatabaseAccessService`)

        let merchant = await MerchantAccount.findOne({where: {id: merchantData.id}})

        if(!merchant) return 

        await merchant.update({...merchantData})

        await merchant.save()

        return merchant
    }

    async getMerchants(){
        console.log(`in getMerchants of MerchantDatabaseAccessService`)
        
        let merchants = await MerchantAccount.findAll()

        if(!merchants) return

        console.log(merchants)

        console.log('about to log merchants accounts')

        return merchants
    }

    async getMerchant(id){
        console.log(`in getMerchant of MerchantDatabaseAccessService`)
        
        let merchant = await MerchantAccount.findOne({where: {id}})

        if(!merchant) return

        console.log(merchant)

        console.log('about to log merchant account')

        return merchant
    }
}

module.exports = MerchantsDatabaseAccessService