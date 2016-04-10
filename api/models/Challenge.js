/**
 * Challenge.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    description: {
      type: 'array'
    },
    points: {
      type: 'number'
    },
    retrieves: {
      type: 'array'
    },
    username: {
      type: 'string'
    },
    challengees: {
      type: 'array'
    },
    devpool: {
      collection: 'devpool',
      via: 'challenges'
    }
  }
};
