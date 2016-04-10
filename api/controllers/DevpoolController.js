/**
 * DevpoolController
 *
 * @description :: Server-side logic for managing devpools
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
  var devpool = ['darkfadr', 'kennetpostigo'],
     GitHubApi = require("github"),
     github = new GitHubApi({
        // required
        version: "3.0.0",
        // optional
        debug: true,
        protocol: "https",
        host: "api.github.com", // should be api.github.com for GitHub
        timeout: 5000,
        headers: {
            "user-agent": "My-Cool-GitTrap-App" // GitHub is happy with a unique user agent
        }
    });

 github.authenticate({
   type: 'oauth',
   key: 'e150fb6c92687771aea5',
   secret: '3d15e008ae060b3b65a0821994bfeaf488114a50'
 });

module.exports = {

  starred(req, res){
    var data = [];
    devpool.forEach((usr, i) => {
        github.repos
          .getStarredFromUser({user: usr}, (err, star) => {
            err && res.json({err});
            data.push({ user: usr, starred: star});
            (i === devpool.length-1)  && res.json(data);
          });
      });
  },
  add(req, res){
    User.findOrCreate({
      username: req.body.username
    }, (err, usr) => {
      Devpool.findOne(req.body.devpool_id)
        .populate('users')
        .exec((err, devpool) => {
          console.log(err, devpool)
          devpool.users.add(usr.id);
          devpool.save((err, pool) => {
            res.json(devpool);
          });
        });
    });
  }
};

