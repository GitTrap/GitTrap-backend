/**
 * Challenge.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var m = require('moment');

module.exports = {

  attributes: {
    description:{
      type: 'text'
    },
    challenger:{
      type: 'string'
    },
    challengees:{
      type: 'array'
    },
    devpool:{
      collection:'devpool',
      via: 'challenges'
    }
  },
  beforeValidate(val, next){
    Challenge.findOne({created: {'>': '2016-04-10T00:05:23.018Z'}})
      .exec((err, challenge) => {
          if(err)
            return next(err);

          console.log(m(), challenge)
          if(!challenge)
            return next(new Error('Opps, but you can only have one challenge per week.'));

          next();
      });
  }


};
