var PaymentsRepository = require("./PaymentsRepository")
var PaymentsDatabaseAccessService = require("./PaymentsDatabaseAccessService")

let paymentsDatabaseAccessService = new PaymentsDatabaseAccessService()
let paymentsRepository = new PaymentsRepository(paymentsDatabaseAccessService)


module.exports = { paymentsRepository }