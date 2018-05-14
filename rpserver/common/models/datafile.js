'use strict';

var multer = require('multer');
var fs = require('fs');
var path = require('path');

var rp = require('../../server/relpredict.js');

module.exports = function(Datafile) {
	/* File upload section */
    var uploadedFileName = '';
    var uploaded_files = [];
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // checking and creating uploads folder where files will be uploaded
            var dirPath = rp.config.uploads;
            //console.log(dirPath);
            cb(null, dirPath + '/');
        },
        filename: function (req, file, cb) {
            // file will be accessible in `file` variable
            //var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
            var fileName = Date.now() + '_' + file.originalname ;
            uploadedFileName = fileName;
            uploaded_files.push(uploadedFileName);
            console.log(fileName);
            var user = req.currentUser;
            cb(null, fileName);
        }
    });
    Datafile.uploadfiles = function (req, res, cb) {
    	console.log('Uploading files ', req.file);
        var upload = multer({
            storage: storage
        }).array('file[]', 100);
        upload(req, res, function (err) {
            console.log(uploaded_files);
            if (err) {
                // An error occurred when uploading
                //rp.writeLog('DATAFILE', 'ERROR', 'FAILED', 'UPLOAD', 'File upload failed',  { file: uploaded_files }, req.currentUser);
                res.json(err);
            }
            //rp.writeLog('DATAFILE', 'INFO', 'OK', 'UPLOAD', 'File uploaded',  { files: uploaded_files }, req.currentUser);
               res.json(uploaded_files);
               rp.runLocal('rpdatautil.sh', uploaded_files);
               uploaded_files = [];
        });   
    };

    Datafile.remoteMethod('uploadfiles',   {
      http: {
        path: '/uploadfiles',
        verb: 'post'
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
             type: 'string'
        }
    });
   Datafile.listdatafiles = function(req, cb) {
   	  var retFiles = rp.getDatafiles();
      retFiles.isExpanded = true;
      //console.log(retFiles);
   	  cb(null, retFiles);
   }; 	
   Datafile.remoteMethod('listdatafiles', {
   		http: {
   			path: '/listdatafiles',
   			verb: 'get'
   		},
      accepts: [{ arg: 'req', type: 'object', http: { source: 'req' }
      }], 
   		returns: {
   			arg:  'filedir',
   			type: 'array'
   		}
   	})
   Datafile.getfileinfo = function(filename, cb) {
      var ret = rp.getDatafileInfo(filename);
      cb(null, ret);
   };   
   Datafile.remoteMethod('getfileinfo', {
      http: {
        path: '/getfileinfo',
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
   Datafile.getfileheader = function(filename, cb) {
      var ret = rp.getDatafileHeader(filename);
      cb(null, ret);
   };   
   Datafile.remoteMethod('getfileheader', {
      http: {
        path: '/getfileheader',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'filename',
            type: 'string'
      }],
      returns: [
      {
        arg:  'datafile_content',
        type: 'object'
      }]
    });
   Datafile.createdatamap = function(datamap, dir, overwrite, req, cb) {
      var ret = rp.saveDatamap(datamap, dir, overwrite);
      //rp.writeLog('DATAFILE', 'INFO', 'OK', 'CREATE', 'Datamap created',  { datamap: datamap }, req.currentUser);
      cb(null, ret);
   };   
   Datafile.remoteMethod('createdatamap', {
      http: {
        path: '/createdatamap',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'datamap',
            type: 'object'
      },
      {
            arg:  'dir',
            type: 'string'
      },
      {
            arg:  'overwrite',
            type: 'boolean'
      },
      {     
            arg: 'req', type: 'object', http: { source: 'req' } 
      }
      ],
      returns: [
      {
        arg:  'returned_object',
        type: 'string'
      }]
    });
   Datafile.getdatamap = function(datamap_name, cb) {
      var ret = rp.getDatamap(datamap_name);
      cb(null, ret);
   };   
   Datafile.remoteMethod('getdatamap', {
      http: {
        path: '/getdatamap',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'datamap_name',
            type: 'string'
      }],
      returns: [
      {
        arg:  'returned_object',
        type: 'string'
      }]
    });
   Datafile.deletefile = function(filename, req, cb) {
      var ret = rp.deleteFile(filename);
      //rp.writeLog('DATAFILE', 'INFO', 'OK', 'DELETE', 'File deleted',  { file: filename }, req.currentUser);
      cb(null, ret);
   };   
   Datafile.remoteMethod('deletefile', {
      http: {
        path: '/deletefile',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'filename',
            type: 'string'
      },
      {     
            arg: 'req', type: 'object', http: { source: 'req' } 
      }],
      returns: [
      {
        arg:  'returned_object',
        type: 'string'
      }]
    });
};



