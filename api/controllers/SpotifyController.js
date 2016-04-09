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
  authorizeURL = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'auth'),
  defaultP,
  playlistUser;

module.exports = {
  auth: function(req, res) {
    res.redirect(authorizeURL);
  },
  /**
   * Call back function from spotify
   *
   * @description :: gets the access token from spotify and sets the access token
   */
  callback: function(req, res) {
    spotifyApi.authorizationCodeGrant(req.param('code'))
      .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
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
      .then(function(data) {
        playlistUser = data.id;
        spotifyApi.getUserPlaylists(data.id)
          .then(function(data) {
            res.json(data.body);
          }, function(err) {
            res.json(err);
          });
      }, function(err) {
        res.send('Coul not find user');
      });
  },
  /**
   * sets playlist
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */
  setPlaylist: function(req, res) {
    defaultP = req.param('selected');
  },
  /**
   * return playlist
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */
  getPlaylist: function(req, res) {
    res.json(defaultP)
  },
  /**
   * return playlist user
   *
   * @description :: gets the current user and logs selects the playlists from the user
   */
  getPlaylistUser: function(req, res) {
    res.json(playlistUser)
  }
};
