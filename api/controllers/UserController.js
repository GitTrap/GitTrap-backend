/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
  dashboard(req, res){
    github.user.getFollowingFromUser({
      user: req.params.username || 'darkfadr',
      per_page: 5
    }, (err, data) => {
      var itr = 0,
          stream = [],
          followers = data.map(f => f.login);

      function iterate(i){
        github.events.getFromUser({
          user: followers[i],
          per_page: 3
        }, (err, data) => {
          data.map(e => {
            return {
              id:e.id,
              type:e.type,
              actor:e.actor,
              repo:e.repo,
              payload:e.payload
            };
          }).forEach(evnt => {
            stream.push(evnt);
          });

          if (i === followers.length-1){
            res.json(stream);
          }
        });
      }

      for(var i = 0; i < followers.length; i++){
        iterate(i);
      }
    });
  },


  leaderboards(req, res){
    res.json({hello: 'not yet implemented'})
  },

  streaks(req, res){},

  commits(req, res){},

  contributions(req, res){},

  events(req, res){
    github.events.getFromUser({
      user: req.body.username || 'darkfadr'
    }, (err, data) => {
      var events = data.map(e => {
        return {
          id:e.id,
          type:e.type,
          actor:e.actor,
          repo:e.repo,
          payload:e.payload
        };
      });

      res.json(events);
    });
  },


  followers(req, res){
    github.user.getFollowingFromUser({
      user: req.params.username || 'darkfadr'
    }, (err, data) => {
      res.json(data);
    })
  }
};

