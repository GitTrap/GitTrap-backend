/**
 * SpotifyController
 *
 * @description :: Server-side logic for managing spotifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var spotifyWebApi = require('spotify-web-api-node'),
  spotifyApi = new spotifyWebApi({
    clientId: 'facb15ba8f00473bb0282e3e576c62b9',
    clientSecret: '8fe1488ddcf2408fa1e687ebf7925df2',
    redirectUri: 'http://localhost:1337/spotify/callback'
  }),
  authorizeURL = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'auth');

module.exports = {

	/**
	 * redirects to authorization page
	 *
	 * @description :: gets the access token from spotify and sets the access token
	 */

  auth: function(req, res) {
    res.redirect(authorizeURL);
  },

  /**
   * Call back function from spotify
   *
   * @description :: gets the access token from spotify and sets the access token
   */

  callback: function(req, res) {
    spotifyApi.authorizationCodeGrant(req.params.code)
      .then(function(data) {
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        res.redirect('/spotify/splaylist')
      }, function(err) {
        res.serverError();
      });
  },

  /**
   * Select playlist from user
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */

  sPlaylist: function(req, res) {
    spotifyApi.getMe()
      .then((data) => {
        Devpool.update(1, {
          playlist_owner: data.body.id
        }).exec((err, obj) => {
          if (err)
            res.json(err);
        });
        spotifyApi.getUserPlaylists(data.body.id)
          .then((data) => {
            res.json(data.body);
          }, function(err) {
            res.json(err);
          });
      }, (err) => {
        res.json(err);
      });
  },

  /**
   * sets playlist
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */

  setPlaylist: function(req, res) {
    Devpool.update(1, {
      playlist: req.params.playlist
    }).exec((err, obj) => {
      (err) ? res.json(err) : res.json("Success")
    });
  },

  /**
   * return playlist
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */

  getPlaylist: function(req, res) {
    Devpool.findOne(1).exec((err, obj) => {
      (err) ? res.json(err) : res.json(obj.playlist);
    })
  },

  /**
   * return playlist user
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */

  getPlaylistUser: function(req, res) {
    Devpool.findOne(1).exec((err, obj) => {
			err ? res.json(err) : res.json(obj.playlist_owner);
    })
  }
};
