/**
 * Devpool.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    playlist: {
      type: 'string'
    },
    playlist_owner: {
      type: 'string'
    },
    challenges:{
      type: 'string'
    },
    users: {
      collection: 'user',
      via: 'devpools'
    }
  }
};
