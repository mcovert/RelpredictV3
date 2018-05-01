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
    var uploaded_files = [];
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
            uploaded_files.push(uploadedFileName);
            console.log(fileName);
            var user = req.currentUser;
            cb(null, fileName);
        }
    });
    Datafile.uploadfiles = function (req, res, cb) {
    	console.log('Uploading files...');
    	console.log(req.file);
        var upload = multer({
            storage: storage
        }).array('file[]', 12);
        upload(req, res, function (err) {
          console.log(uploaded_files);
            if (err) {
                // An error occurred when uploading
                rp.writeLog('DATAFILE', 'ERROR', 'FAILED', 'UPLOAD', 'File upload failed',  { file: uploaded_files }, req.currentUser);
                res.json(err);
            }
            rp.writeLog('DATAFILE', 'INFO', 'OK', 'UPLOAD', 'File uploaded',  { files: uploaded_files }, req.currentUser);
            res.json(uploaded_files);
            uploaded_files = [];
        });   
    };

    Datafile.remoteMethod('uploadfiles',   {
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
             type: 'string'
        }
    });
   Datafile.listdatafiles = function(req, cb) {
      rp.writeLog('DATAFILE', 'INFO', 'OK', 'LIST', 'List data files',  {}, req.currentUser);
   	  var retFiles = rp.getDatafiles();
   	  cb(null, retFiles);
   }; 	
   Datafile.remoteMethod('listdatafiles', {
   		http: {
   			path: '/listdatafiles',
   			verb: 'get'
   		},
      accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
      }], 
   		returns: {
   			arg:  'filedir',
   			type: 'array'
   		}
   	})
   Datafile.getheader = function(filename, cb) {
      var ret = rp.getDatafileHeader(filename);
      cb(null, ret);
   };   
   Datafile.remoteMethod('getheader', {
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



