
class PaymentsRepository {

    constructor(paymentsDatabaseAccessService) {
        this.paymentsDatabaseAccessService = paymentsDatabaseAccessService
    }

    async createPayment(paymentData) {
        console.log(`in createPayment of PaymentsRepository`)
        return await this.paymentsDatabaseAccessService.createPayment(paymentData)
    }

    async paymentExists(ref) {
        console.log(`in paymentDoesNotExist of PaymentsRepository`)
        return await this.paymentsDatabaseAccessService.paymentExists(ref)
    }

}

module.exports = PaymentsRepository