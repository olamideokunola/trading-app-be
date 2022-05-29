var express = require('express')
var router = express.Router()
var managePayments = require('../usecases/index').managePayments

router.get('/', (req, res) => {
    var msg = `in get of payments`
    console.log(msg)
    res.send(msg)
})

router.post('/', async (req, res) => {
    var msg1 = `in posts of payments`
    console.log(msg1)
    console.log(req.body)
    let {
        key,
        email,
        amount,
        currency,
        ref,
        storeId
    } = req.body
    // console.log(req.headers)

    
    // create payment
    let { success, paymentId, msg } = await managePayments.createPayment({
        key,
        email,
        amount,
        currency,
        ref,
        storeId
    })

    console.log({ success, paymentId, msg })

    // return id
    res.json({ success, paymentId, msg })
})

module.exports = router