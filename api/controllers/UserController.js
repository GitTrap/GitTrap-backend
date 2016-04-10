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
    github.user.getFrom({
      user: req.body.username || 'darkfadr'
    }, (err, user) => {
      github.events.getFromUser({
        user: req.params.username || 'darkfadr'
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
        user.activity_feed = events;
        res.json({
          login: user.login,
          id: user.id,
          avatar_url: user.avatar_url,
          name: user.name,
          location: user.location,
          activity_feed: events
        });
      });

      // res.json(data);
    });
  },
  leaderboards(req, res){
    res.json({hello: 'not yet implemented'})
  },
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
  },
  top(req, res){

  }
};

