require("dotenv").config();
const PaymentModels = require("../models/payment");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.postPayment = async (req, res) => {
  const payment = req.body;
  console.log(payment)
  const paymentResult = await PaymentModels.create(payment);
  console.log("payment info", payment);
  res.send(paymentResult);
};
exports.PostPaymentIntents = async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  console.log(amount, "amount inside the intent");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
  
};
exports.GetPayment = async (req, res) => {
  const query = { email: req.params.email };
  if (req.params.email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  const result = await PaymentModels.find(query);
  res.send(result);
};
exports.GetPaymentMethod = async (req, res) => {
  const result = await PaymentModels.find();
  res.send(result);
};
