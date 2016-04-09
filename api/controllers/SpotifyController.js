/**
 * SpotifyController
 *
 * @description :: Server-side logic for managing spotifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var SpotifyWebApi = require('spotify-web-api-node')
request = require('request'),


  spotifyApi = new SpotifyWebApi({
    clientId: 'facb15ba8f00473bb0282e3e576c62b9',
    clientSecret: '8fe1488ddcf2408fa1e687ebf7925df2',
    redirectUri: 'http://localhost:1337/spotify/callback'
  });

var authorizeURL = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'auth');

module.exports = {
  auth: function(req, res) {
    res.redirect(authorizeURL);
  },

  callback: function(req, res) {
    spotifyApi.authorizationCodeGrant(req.param('code'))
      .then(function(data) {
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is ' + data.body['refresh_token']);

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
				res.redirect('/spotify/splaylist')
			}, function(err) {
        res.serverError();
      });
  },
	splaylist: function(req, res){
		spotifyApi.getUserPlaylists('darkfadr')
		  .then(function(data) {
		    res.json(data);
		  }, function(err) {
		    res.json(err);
		  });
	}
};
