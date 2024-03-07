const { default: mongoose } = require("mongoose");

const PaymentSchema = mongoose.Schema({
    email: {type: String},
    price: {type: Number},
    transactionId: {type: String},
    date: {type: String},
    status: {type: String},
})

const PaymentModels = mongoose.model('payments', PaymentSchema);
module.exports = PaymentModels;