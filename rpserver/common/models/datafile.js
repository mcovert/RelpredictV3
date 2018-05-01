'use strict';

var multer = require('multer');
var fs = require('fs');
var path = require('path');

var rp = require('../../server/relpredict.js');

//console.log(rp.printObject(rp.getDatafiles()));
//console.log(rp.getDatafileHeader('2018-04-23-ai.txt'));

module.exports = function(Datafile) {
	/* File upload section */
    var uploadedFileName = '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // checking and creating uploads folder where files will be uploaded
            var dirPath = rp.config.uploads;
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
    Datafile.uploadfiles = function (req, res, cb) {
    	console.log('Uploading files...');
    	console.log(req);
        var upload = multer({
            storage: storage
        }).array('file[]', 12);
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                res.json(err);
            }
            res.json(uploadedFileName);
        });   
    };

    Datafile.remoteMethod('uploadfiles',   {
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
   Datafile.listdatafiles = function(cb) {
      rp.showModels();
      rp.writeLog('TEST', 'mcovert@ai.com', 'Test message', 'INFO', 'none', 'datafile', 0, { seq: 0 });
   	  var retFiles = rp.getDatafiles();
   	  cb(null, retFiles);
   }; 	
   Datafile.remoteMethod(
   	'listdatafiles', {
   		http: {
   			path: '/listdatafiles',
   			verb: 'get'
   		},
   		returns: {
   			arg:  'filedir',
   			type: 'array'
   		}
   	})
   Datafile.getheader = function(filename, cb) {
      var ret = rp.getDatafileHeader(filename);
      cb(null, ret);
   };   
   Datafile.remoteMethod(
    'getheader', {
      http: {
        path: '/getheader',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'filename',
            type: 'string'
      }],
      returns: [
      {
        arg:  'datafile_info',
        type: 'object'
      }]
    });
};



