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
       // pathPrefix: "/api/v3", // for some GHEs; none for GitHub
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
  test: function(req, res){
    github.user.getFrom({
        // optional:
        // headers: {
        //     "cookie": "blahblah"
        // },
        user: "darkfadr"
    }, function(err, data) {
      res.json(data);
    });
  }
};

