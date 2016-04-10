/**
 * StripeController
 *
 * @description :: Server-side logic for managing stripes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
stripe = require('stripe')('sk_test_ghpk9f5u9EU0d5WvmuSrZXNk');

module.exports = {
  charge: function(req, res) {
    stripe.tokens.create({
      card: {
        "number": req.body.card,
        "exp_month": req.body.expmonth,
        "exp_year": req.body.expyear,
        "cvc": req.body.cvc
      }
    }, (err, token) => {
      stripe.charges.create({
        amount: 50,
        currency: "usd",
        source: token.id, // obtained with Stripe.js
        description: "Charge"
      }, (err, charge) => {
        if (err) {
          console.log(err);
        } else {
          Challenge.findOne({
            username: req.body.username
          }).exec((err, obj) => {
            retrieve = obj.retrieves ? obj.retrieves : [];
            Challenge.update({
              username: req.body.username
            }, {
              retrieves: retrieve.push(obj.id)
            }).exec((err, obj) => {
              res.json(obj);
            })
          });
        }
      })
    });
    res.send()
  },
  retrieve: function(req, res) {
    stripe.charges.retrieve("")
  }
};
