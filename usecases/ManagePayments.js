
let ManagePayments = class {

    constructor(paymentsRepository) {
        this.paymentsRepository = paymentsRepository
    }

    keyIsValid(key) {
        return true
    }
    
    fieldsAreValid({ currency, email, amount, storeId, ref }) {
        return true
    }

    async paymentExists(ref) {
        return await this.paymentsRepository.paymentExists(ref)
    }

    async createPayment({ key, currency, email, amount, storeId, ref }) {
        if (!this.keyIsValid(key)) return { success:false, msg: 'Invalid key!' }
        if (!this.fieldsAreValid({ currency, email, amount, storeId, ref })) return { success:false, msg: 'Invalid inputs!' }
        
        console.log(`payment exists is ${await this.paymentExists(ref)}`)
        
        if (await this.paymentExists(ref)) return { success:false, msg: 'Possible duplicate payment!' }

        let { success, paymentId, msg } = await this.paymentsRepository.createPayment({ currency, email, amount, storeId, ref })
        if (!success) return { success, msg: 'Error creating payment!' }

        return { success:true, paymentId, msg }
    }
}

module.exports = ManagePayments