var {  Payer, Payment, MerchantAccount } = require('../db/models')

class PaymentsDatabaseAccessService {

    async paymentExists(ref) {
        console.log(`in paymentDoesNotExist of PaymentsDatabaseAccessService`)

        let result = await Payment.findOne({where: {reference: ref}})

        return result
    }

    async createPayer(email){
        let payer = await Payer.create({email})

        return payer
    }

    async createPayment({ currency, email, amount, storeId, ref }) {
        console.log(`in createPayment of PaymentsDatabaseAccessService`)
        // console.log({ currency, email, amount, storeId, ref })
        
        let paymentId

        // if vendorId does not exist return or
        let merchant = await MerchantAccount.findOne({where: {storeId}})
        console.log(merchant)
        console.log(merchant?.id)
        if(!merchant) return { success: false, msg: 'Invalid store id!' }

        // if buyer does not exist, create
        let payer = await Payer.findOne({where: {email}})
        console.log(payer)
        console.log(payer?.id)
        if(!payer) {
            console.log('No payer!')
            // create payer
            payer = await this.createPayer(email)    
        }

        // create payment and associate with vendor and payer
        let payment = await Payment.create({
            amount,
            paymentStartDate: new Date(),
            currency,
            status: "STARTED",
            payerId: payer.id,
            merchantAccountId: merchant.id,
            reference: ref
        })

        console.log(payment)

        return { success: true, paymentId: payment.id }
    }
}

module.exports = PaymentsDatabaseAccessService