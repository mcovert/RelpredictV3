'use strict';
var rp = require('../../server/relpredict.js');

module.exports = function(Config) {
    Config.stats = function (req, res, cb) {
    	cb(null, rp.getStats());
    };

    Config.remoteMethod('stats',   {
      http: {
        path: '/stats',
        verb: 'get'
      },
        accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
        }, 
        {
            arg: 'res',
            type: 'object',
            http: {
                source: 'res'
            }
        }],
        returns: {
             arg: 'result',
             type: 'object'
        }
    });

};
