'use strict';

var fs = require('fs');

module.exports = function(Datafile) {
   Datafile.listAll = function(cb) {
   	  var files = fs.readdirSync('/home/mcovert/testfiles');
   	  cb(null, files);
   } 	
   Datafile.remoteMethod(
   	'listAll', {
   		http: {
   			path: '/listAll',
   			verb: 'get'
   		},
   		returns: {
   			arg:  'files',
   			type: 'array'
   		}
   	})
};



