const managePayments = require("../usecases/index").managePayments


describe('payment tests',  () => {
    test('create new payment and return id', async () => {
        let inputs = {
            key: "pqowpeqweqwe",
            currency: "NGN", 
            email: "olamideokunola@yahoo.com", 
            amount: 10000, 
            storeId: "qweqe3-qweewr3-erewer", 
            ref: "456789" 
        }

        // console.log(managePayments.createPayment)
        let { success, paymentId, msg } = await managePayments.createPayment(inputs)

        console.log({ success, paymentId, msg })

        expect(success).toBe(true)
        expect(paymentId).toBeGreaterThan(0)
    })
})