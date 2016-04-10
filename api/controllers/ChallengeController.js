/**
 * ChallengeController
 *
 * @description :: Server-side logic for managing challenges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getChallenge: function(req, res) {
    Challenge.findOne({
      username: req.body.username
    }).exec((err, obj) => {
      (err) ? res.json(err): res.json(obj);
    })
  }

};
