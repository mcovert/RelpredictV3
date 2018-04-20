'use strict';

var multer = require('multer');
var fs = require('fs');
var path = require('path');

var batchDir    = global.baseDir + 'batches/';
var datafileDir = global.baseDir + 'datafiles/';
var uploadDir   = global.baseDir + 'uploads/';

var makeFileEntry = function(fullFileName, fileStat) {
  var fPath = path.parse(fullFileName);
  var fileName = fPath.base;
  var fileFormat = fPath.ext.toUpperCase();
  var fileType = '?';
  if (fullFileName.indexOf('predict')) fileType = 'Predict';
  else if (fullFileName.indexOf('train')) fileType = 'Train';
  else if (fullFileName.indexOf('lookup')) fileType = 'Lookup';
  else if (fullFileName.indexOf('vocab')) fileType = 'Vocabulary';
  var entry = { 'file_name'  : fileName,
                'file_type'  : fileType,
                'file_format': fileFormat,
                'file_stats' : fileStat};
  return entry;
}
var getAllFiles = function(dirName) {
  var entries = [];
  var files = fs.readdirSync(dirName);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = dirName + '/' + files[i];
    var fileStat = fs.statSync(fullFileName);
    if (stat.isDirectory()) entries.push(getAllFiles(fullFileName));
    else entries.push(makeFileEntry(fullFileName);)
  }
  return entries;
}
var getAllBatches = function() {
} 
var getAllBatchesAndFiles = function() {
} 

module.exports = function(Datafile) {
	/* File upload section */
    var uploadedFileName = '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // checking and creating uploads folder where files will be uploaded
            var dirPath = global.baseDir + 'data/uploads/';
            console.log(dirPath);
            cb(null, dirPath + '/');
        },
        filename: function (req, file, cb) {
            // file will be accessible in `file` variable
            //var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
            var fileName = Date.now() + file.originalname;
            uploadedFileName = fileName;
            console.log(fileName);
            cb(null, fileName);
        }
    });
    Datafile.uploadbatch = function (req, res, cb) {
    	console.log('Uploading batch...');
    	console.log(req);
        var upload = multer({
            storage: storage
        }).array('file[]', 12);
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                res.json(err);
            }
            var fromPath = global.baseDir + 'data/uploads/' + uploadedFileName;
            var toPath = global.baseDir + 'data/batches/hold/' + uploadedFileName;
            fs.rename(fromPath, toPath , function(err) {
                    if ( err ) console.log('ERROR: ' + err);
            });
            res.json(uploadedFileName);
        });   
    };

    Datafile.remoteMethod('uploadbatch',   {
        accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
        }, {
            arg: 'res',
            type: 'object',
            http: {
                source: 'res'
            }
        }],
        returns: {
             arg: 'result',
             type: 'string'
        }
    });
    Datafile.uploaddatafile = function (req, res, cb) {
      console.log('Uploading data file...');
      console.log(req);
        var upload = multer({
            storage: storage
        }).array('file[]', 12);
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                res.json(err);
            }
            else {
                var fromPath = uploadDir + uploadedFileName;
                var toPath = datafileDir + uploadedFileName;
                fs.rename(fromPath, toPath , function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
                res.json('OK - ' + uploadedFileName);
            }
        });   
    };

    Datafile.remoteMethod('uploaddatafile',   {
        accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
        }, {
            arg: 'res',
            type: 'object',
            http: {
                source: 'res'
            }
        }],
        returns: {
             arg: 'result',
             type: 'string'
        }
    });
   Datafile.listbatches = function(cb) {
      var retFiles = [];
      retFiles.push(getFiles(global.baseDir + 'data/batches/hold', '', ''));
      retFiles.push(getFiles(global.baseDir + 'data/batches/release', '', ''));
      cb(null, retFiles);
   }  
   Datafile.remoteMethod(
    'listbatches', {
      http: {
        path: '/listbatches',
        verb: 'get'
      },
      returns: {
        arg:  'files',
        type: 'array'
      }
    })

   Datafile.listdatafiles = function(cb) {
   	  var retFiles = [];
   	  retFiles.push(getFiles(global.baseDir + 'data/datafiles/hold', '', ''));
      retFiles.push(getFiles(global.baseDir + 'data/datafiles/release', '', ''));
   	  cb(null, retFiles);
   } 	
   Datafile.remoteMethod(
   	'listdatafiles', {
   		http: {
   			path: '/files',
   			verb: 'get'
   		},
   		returns: {
   			arg:  'files',
   			type: 'array'
   		}
   	})
   Datafile.listbatchfiles = function(batch, cb) {
   	  //var files = fs.readdirSync('/home/mcovert/testfiles/' + batch);
   	  cb(null, getFiles(global.baseDir + 'data/datafiles/' + batch + "/", 'batches', 'Batch'));
   } 	
   Datafile.remoteMethod(
   	'listAllForBatch', {
   		http: {
   			path: '/listAllForBatch',
   			verb: 'get'
   		},
   		accepts: {
            arg:  'batch',
            type: 'string'
   		},
   		returns: {
   			arg:  'files',
   			type: 'array'
   		}
   	})
};



