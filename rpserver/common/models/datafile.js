'use strict';

var fs = require('fs');

var getFiles = function(dirName) {
   var files = fs.readdirSync(dirName);
   var fstat = [];
   for (var i = 0; i < files.length; i++) {
   	  	var fileName = dirName + files[i]; 
   	  	var stat = fs.statSync(fileName);
   	  	if (stat.isDirectory()) fstat.push(getFiles(fileName + "/"));
   	  	else fstat.push({ dir_name: dirName, file_name: files[i], stats: stat});
   }
   return fstat;	
} 

module.exports = function(Datafile) {
   Datafile.listAll = function(cb) {
   	  cb(null, getFiles(global.baseDir + 'data/datafiles/'));
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
   Datafile.listAllForBatch = function(batch, cb) {
   	  //var files = fs.readdirSync('/home/mcovert/testfiles/' + batch);
   	  cb(null, getFiles(global.baseDir + 'data/datafiles/' + batch + "/"));
   } 	
   Datafile.remoteMethod(
   	'listAllForBatch', {
   		http: {
   			path: '/listAllForBatch',
   			verb: 'get'
   		},
   		accepts: {
            arg: ' batch',
            type: 'string'
   		},
   		returns: {
   			arg:  'files',
   			type: 'array'
   		}
   	})
};



