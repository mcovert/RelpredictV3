var fs          = require('fs');
var path        = require('path');
var node_ssh    = require('node-ssh');
var ssh         = new node_ssh();
var multer      = require('multer');
var firstline   = require('firstline');
const { spawn } = require('child_process');
const dirTree   = require('directory-tree');

/*******************************************************************************/
/*    RelPredict system configuration taken from environment variables         */
/*******************************************************************************/
var config = {
	home:       process.env.RELPREDICT_HOME,
	scripts:    process.env.RP_SCRIPTS,
    uploads:    process.env.RP_UPLOADDIR,
	archives:   process.env.RP_ARCHIVEDIR,
	datafiles:  process.env.RP_DATAFILEDIR,
	datamaps:   process.env.RP_DATAMAPDIR,
	jobs:       process.env.RP_JOBDIR,
	models:     process.env.RP_MODELDIR
};
exports.config = config;
printObject = function(o, indent) {
    var out = '';
    if (typeof indent === 'undefined') {
        indent = 0;
    }
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            var val = o[p];
            out += new Array(4 * indent + 1).join(' ') + p + ': ';
            if (typeof val === 'object') {
                if (val instanceof Date) {
                    out += 'Date "' + val.toISOString() + '"';
                } else {
                    out += '{\n' + printObject(val, indent + 1) + new Array(4 * indent + 1).join(' ') + '}';
                }
            } else if (typeof val === 'function') {

            } else {
                out += '"' + val + '"';
            }
            out += ',\n';
        }
    }
    return out;
}
exports.printObject = printObject;
/*******************************************************************************/
/*                   Job server management functions                           */
/*******************************************************************************/
var jobservers = process.env.RP_JOBSERVERS.split(",");
var running    = new Array(jobservers.length).fill(0);
var total      = new Array(jobservers.length).fill(0);
var serverNum  = 0;
acquireServer = function() {
	var runServer = jobservers[serverNum];
	running[serverNum] += 1;
	total[serverNum] += 1;
	serverNum += 1;
	if (serverNum >= jobservers.length) serverNum = 0;
    return runServer;
};
releaseServer = function(server) {
	var i = jobServers.indexOf(server);
	if (i != -1)
		running[i] -= 1;
};
exports.getJobServerStatus = () => {
	var result = [];
	for (var i = 0; i < jobservers.length; i++) {
        result.push( { 'server'     : jobservers[i],
                       'running'    : running[i],
                       'total_jobs' : total[i]
                     }
                   );
	}
	return results;
};

getCommandMonitor = function(cmd, server) {
	/* TO-DO: Want to use command name to handle this - i.e. spark is port 4040 */
	return server + ':4040';
};
exports.runJob = (cmd) => {
    var server = acquireServer();
    ssh.connect({ host: server, username: cmd.username, privateKey: '/home/' + cmd.username + '/.ssh/id_rsa'})
        .then(function() {
            ssh.execCommand(cmd.command, 
                { cwd:'/home/' + cmd.username }
            );
            releaseServer(server);
        });
    return { 'server': server, 'monitor': getCommandMonitor(cmd.command, server)};
}; 
/* Run local commands from home bin directory */
exports.runLocal = (cmd, parms) => {
	var cmdpath = config.home + '/bin/' + cmd;

	if (!fs.existsSync(cmdpath)) {
		console.log('Command script ' + cmdpath + ' was not found');
		return;
	}
    const cmdrun = spawn(cmdpath, parms);
    cmdrun.stdout.on('data', (data) => { console.log(`${data}`); });
    cmdrun.stderr.on('data', (data) => { console.error(`${data}`);});
    cmdrun.on('exit', function (code, signal) { console.log('Command ' + cmd + ' exited with ' + `code ${code}`); } );
}
/*******************************************************************************/
/*                         Data management functions                           */
/*******************************************************************************/
// var makeFileEntry = function(fullFileName, fileStat) {
//   var fPath = path.parse(fullFileName);
//   var fileName   = fPath.base;
//   var fileFormat = fPath.ext.replace(/\./g,' ').toUpperCase();
//   var dirName    = fPath.dir;
//   var fileType   = '?';
//   if (fullFileName.indexOf('predict')) fileType = 'Predict';
//   else if (fullFileName.indexOf('train')) fileType = 'Train';
//   else if (fullFileName.indexOf('lookup')) fileType = 'Lookup';
//   else if (fullFileName.indexOf('vocab')) fileType = 'Vocabulary';
//   var entry = { 'file_name'  : fileName,
//                 'file_type'  : fileType,
//                 'file_format': fileFormat,
//                 'file_stats' : fileStat};
//   return entry;
// };
// /* Recursively count all files below a directory path */
// var fileCount = function(dirName) {
//   var num = 0;
//   var files = fs.readdirSync(dirName);
//   for (var i = 0; i < files.length; i++) {
//     var fullFileName = path.join(dirName, files[i]);
//     var fileStat = fs.statSync(fullFileName);
//     if (fileStat.isDirectory()) num += fileCount(fullFileName);
//     else num += 1;
//   }
//   return num;
// };
exports.getDatafiles = () => { 
	return JSON.parse(JSON.stringify(dirTree(config.datafiles)).replace(new RegExp(config.datafiles + '/','g'), ''));
}
// exports.getBatches = (getAll) => {
//   var entries = [];
//   var files = fs.readdirSync(config.batches);
//   for (var i = 0; i < files.length; i++) {
//     var fullFileName = path.join(config.batches, files[i]);
//     var fileStat = fs.statSync(fullFileName);
//     if (fileStat.isDirectory()) {
//     	var batch = {   'batch_name' : files[i],
//                         'size'       : fileStat.size,
//                         'created'    : fileStat.ctime,
//                         'file_count' : fileCount(fullFileName)
//                       };
//     	if (getAll) {
//             batch.files = getDatafilesForDir(fullFileName);
//     	}
//     	entries.push(batch);
//     }
//   }
//   return entries;
// };
// getDatafilesForDir = (datafileDir) => {
//   var entries = [];
//   var files = fs.readdirSync(datafileDir);
//   for (var i = 0; i < files.length; i++) {
//     var fullFileName = path.join(datafileDir, files[i]);
//     var fileStat = fs.statSync(fullFileName);
//     if (fileStat.isFile()) {
//         var dmType = "?";
//         if (fullFileName.endsWith('.csv')) dmType = 'Comma delimited';
//         else if (fullFileName.endsWith('.tsv')) dmType = 'Tab delimited';
//     	entries.push( { 'datafile_name' : files[i],
//                         'datafile_type' : dmType,
//                         'size'          : fileStat.size,
//                         'created'       : fileStat.ctime                       
//                       }
//                     );
//     }
//     else entries.push(getDatafilesForDir(fullFileName));
//   }
//   return entries;
// };
// exports.getDatafiles = () => { return getDatafilesForDir(config.datafiles); }
// exports.getBatch = (batch_id) => {
// 	var fullFileName = path.join(config.batches, batch_id);
// 	if (path.existsSync(fullFileName)) {
//        var fileStat = fs.statSync(fullFileName);
//        return [{ 'batch_name' : batch_id,
//                  'size'       : fileStat.size,
//                  'created'    : fileStat.ctime,
//                  'file_count' : fileCount(fullFileName)
//                }];
//     }
//     else return [];
// };
/* Read an entire data file */
exports.getDatafileInfo = (fileName) => {
	var fullFileName = path.join(config.datafiles, fileName);
	if (path.existsSync(fullFileName)) {
       var fileStat = fs.statSync(fullFileName);
       var dmContent = fs.readfileSync(fullFileName, 'utf8');
       return { 'datafile_name'    : path.parse(files[i]).name,
                'datafile_content' : dmContent
              };
    }
    else return {};
}
exports.getDatafileHeader = (fileName) => {
	var fullFileName = path.join(config.datafiles, fileName);
	if (fs.existsSync(fullFileName)) {
	  firstline(fullFileName).then( (line) => {
         return { 'datafile_name'   : fileName,
                  'datafile_header' : line
              };
	  });
    }
    else return {};
}
exports.getDatamaps = () => {
  var entries = [];
  var files = fs.readdirSync(config.datamaps);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = path.join(config.datamaps, files[i]);
    var fileStat = fs.statSync(fullFileName);
    var dmType = "?";
    if (fullFileName.endsWith('.dmap')) dmType = 'Datamap';
    else if (fullFileName.endsWith('.xlate')) dmType = 'Translation';
    if (fileStat.isFile()) {
    	entries.push( { 'datamap_name' : path.parse(files[i]).name,
                        'datamap_type' : dmType
                      }
                    );
    }
  }
  return entries;

};
exports.getDatamap = (map_id) => {
	var fullFileName = path.join(config.datamaps, map_id);
	if (path.existsSync(fullFileName)) {
       var fileStat = fs.statSync(fullFileName);
       var dmContent = fs.readfileSync(fullFileName, 'utf8');
       return [ { 'datamap_name' : path.parse(files[i]).name,
                  'datamap_type' : dmType,
                  'datamap'      : JSON.parse(dmContent)
                }
              ];
    }
    else return [];
	
};
/*******************************************************************************/
/*                         Model management functions                          */
/*******************************************************************************/
/*           Convert a JSON model to a relpredict modeldef file                */ 
quoted = function(str) { return '"' + str + '"'; } 
createParms = function(parms) {
	var parmStr = '';
	if (parms == null) return parmStr;
	for (var i = 0; i < parms.length; i++) {
		if (i > 0) parmStr = parmStr + ",";
		parmStr = parmStr + parms[i].parm + '=' + parms[i].parm_value;
	}
    return parmStr;
}
createFeature = function(feature) {
    return '   feature '   + quoted(feature.name) +
           ' type '        + quoted(feature.type) +
           ' description ' + quoted(feature.label) +
           ' parameters  ' + quoted(createParms(feature.parms)) + '\n';
}
createAlgorithms = function(alg) {
	var algStr = '';
	if (alg == null) return algStr;
	for (var i = 0; i < alg.length; i++) {
		algStr = algStr + "algorithm=" + alg[i].algorithm;
		var parmStr = createParms(alg[i].parms);
		if (parmStr != '') algStr = algStr + "," + parmStr + ";";
		else algStr = algStr + ";";
	}
	return algStr;
}                     
createTarget = function(target) {
    return '   target '    + quoted(target.name) +
           ' type '        + quoted(target.type) +
           ' description ' + quoted(target.description) +
           ' predictedby ' + quoted(createAlgorithms(target.algorithms)) + 
           ' parameters '  + quoted(createParms(target.parms)) + '\n';
}                     
exports.convertModel = (model) => {
	var modelStr = 'model '    + quoted(model.name) + 
	               ' version ' + quoted(model.version) +
	               ' description ' + quoted(model.description) + '\n' +
	               '  featureset fset id ' + quoted(model.identifier) + '\n';
	for (var i = 0; i < model.features.length; i++)
		modelStr = modelStr + createFeature(model.features[i]);
	for (var i = 0; i < model.targets.length; i++)
		modelStr = modelStr + createTarget(model.targets[i]);
    return modelStr;
} 