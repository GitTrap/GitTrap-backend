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
      err && res.json({err});
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

  frequency(req, res){
    github.repos
      .getFromUser({user: req.body.user || 'darkfadr'}, (err, repos) => {
        var freq = [];

        repos.forEach((repo, i) => {
          github.repos
            .getStatsCodeFrequency({
              user: req.body.user || 'darkfadr',
              repo: repo.name || 'floridatechhack'
            }, (err, data) => {

              freq.push({
                repo: repo.name,
                frequency: data
              });

              // var add = freq.map(f => {return f.frequency;})
              //             .map(f => {return f[1]})
                          // .map(f => {return f[1]})
                          // .reduce((a, b) => a.concat(b))
                          // .reduce((p, n) => p + n);

              // console.log( '=======>', repos.length, add);
              (i === repos.length -1) && res.json(freq);
            });
        });
      });
  },

  topRepos(req, res){
    github.repos
      .getFromUser({user: req.body.user || 'darkfadr'}, (err, repos) => {
        var activ = [];
        repos.forEach((repo, i) => {
          github.repos
            .getStatsCommitActivity({
              user: req.body.user || 'darkfadr',
              repo: repo.name || 'floridatechhack'
            }, (err, data) => {
              var tot = data.map(f => {return f.total;})
                            .reduce((a, b) => {return a + b})
                            // .sort((a, b)  => { return (a.frequency > b.frequency && 1) || (a.frequency === b.frequency && 0) || (-1) ;});

              activ.push({
                repo: repo.name,
                frequency: tot
              });

              // var add = activ.map(f => {return f.frequency;})
              //             .map(f => {return f[1]})
                          // .map(f => {return f[1]})
                          // .reduce((a, b) => a.concat(b))
                          // .reduce((p, n) => p + n);

              // console.log( '=======>', repos.length, add);
              (i === repos.length -1) && res.json(activ);
            });
        });
      });
  },
  languages(req, res){
    github.repos
      .getFromUser({user: req.body.user || 'darkfadr'}, (err, repos) => {
        var freq = [];

        repos.forEach((repo, i) => {
          github.repos
            .getLanguages({
              user: req.body.user || 'darkfadr',
              repo: repo.name || 'floridatechhack'
            }, (err, data) => {
              delete data.meta;
              freq.push({
                repo: repo.name,
                frequency: data
              });

              if(i === repos.length -1){
                var lang = {
                  JavaScript: 0,
                  CSS: 0,
                  HTML: 0,
                  Python: 0,
                  Java: 0
                }
                freq.forEach(r => {
                  for (var attr in r.frequency) {
                    lang[attr] = lang[attr] && (lang[attr] + r.frequency[attr]) || r.frequency[attr] }
                });
                res.json(lang)
              };
            });
        });
      });
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

