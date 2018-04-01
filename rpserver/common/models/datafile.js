'use strict';

var multer = require('multer');
var fs = require('fs');

var makeFileObject = function(file_type, file_format, dir_name, file_name, file_stat) {
	var retObj = { 'file_type':   file_type,
	               'file_format': file_format,
	               'directory':   dir_name,
	               'file_name':   file_name,
	               'stat':        file_stat
	             };
	return retObj;
}

var getFiles = function(baseDir, dirName, fileType) {
   var files = fs.readdirSync(baseDir + "/" + dirName);
   var fstat = [];
   for (var i = 0; i < files.length; i++) {
   	  	var fileName = dirName + "/" + files[i]; 
   	  	var stat = fs.statSync(baseDir + "/" + fileName);
   	  	if (stat.isDirectory()) {
   	  		var file_type = '';
   	  		if (files[i] === 'train') file_type = 'Train';
   	  		else if (files[i] === 'predict') file_type = 'Predict';
   	  		else if (files[i] === 'master_data') file_type = 'Master Data';
   	  		fstat.push(getFiles(baseDir, fileName, file_type));
   	  	} else {
   	  		var dotpos = fileName.indexOf("."); 
   	  		var	file_format = "?";
   	  		if (dotpos != -1 && dotpos < (fileName.length - 2)) {
   	  			file_format = fileName.substring(dotpos + 1);
   	  		}
   	  		fstat.push(makeFileObject(fileType, file_format, dirName, files[i], stat));
   	  	}
   }
   return fstat;	
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
    Datafile.upload = function (req, res, cb) {
    	console.log('Uploading...');
        var upload = multer({
            storage: storage
        }).array('file', 12);
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                res.json(err);
            }
            res.json(uploadedFileName);
        });        
    };

    Datafile.remoteMethod('upload',   {
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

   Datafile.listAll = function(cb) {
   	  var retFiles = [];
   	  retFiles.push(getFiles(global.baseDir + 'data/datafiles', '', ''));
   	  cb(null, retFiles);
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



