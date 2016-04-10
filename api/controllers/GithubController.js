/**
 * GithubController
 *
 * @description :: Server-side logic for managing githubs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */ //find, create, update, destroy
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
  user: function(req, res){
    github.user.getFrom({
      user: req.params.username || 'darkfadr'
    }, (err, data) => {
      res.json(data);
    });
  },
  // followers(req, res){
  //   github.user.getFollowingFromUser({
  //     user: req.params.username || 'darkfadr'
  //   }, (err, data) => {
  //     res.json(data);
  //   })
  // },
  repos(req, res){
    github.repos
      .getFromUser({user: req.params.username || 'darkfadr'}, (err, data) => {
        err && res.json({err});
        res.json(data);
      });
  },


  //commitACTIVITY
  stats(req, res){
    var data = [];
    Devpool.findOne(req.params.id || 1)
      .populate('users')
      .exec((err, pool) => {
        // start generating stats
        pool.users.forEach((usr, i) => {
          github.repos
            .getFromUser({user: usr.username}, (err, repos) => {
              usr.commits = [];
              repos.forEach((repo, j)=> {
                github.repos.getStatsCommitActivity({
                  user:  'darkfadr',
                  repo:   'floridatechhack',
                  per_page: 2
                }, (err, commits) => {
                  console.log('le commits', commits);

                  var stat = commits && commits.map(c => c.days)
                              .reduce((prev, next) => { return prev.concat(next)})
                              .reduce((prev, next) => prev + next) || 0
                  // if(err) {return res.json({err});}
                  console.log(stat);
                  usr.commits.push({name:repo.name, stat});
                });

                data.push(usr);
                (pool.users.length-1 === i && repos.length-1 === j) && res.json(data);
              });

            });
        });
      });

  }
};

