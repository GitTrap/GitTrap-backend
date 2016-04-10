/**
 * GithubController
 *
 * @description :: Server-side logic for managing githubs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */ //find, create, update, destroy
 var GitHubApi = require("github"),
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
  user: function(req, res){
    github.user.getFrom({
      user: req.params.username || 'darkfadr'
    }, (err, data) => {
      res.json(data);
    });
  },
  repos(req, res){
    github.repos.getFromUser({
      user: req.params.username || 'darkfadr'
    }, (err, data) => {
      res.json(data);
    });
  },
  stats: function(req, res){
    github.repos.getStatsCommitActivity({
      user: req.params.username || 'darkfadr',
      repo: req.params.repo || 'floridatechhack'
    }, (err, data) => {
      res.json(data);
    });
  }
};

