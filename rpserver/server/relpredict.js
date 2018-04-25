var fs       = require('fs');
var path     = require('path');
var node_ssh = require('node-ssh');
var ssh      = new node_ssh();
var multer   = require('multer');

/*******************************************************************************/
/*    RelPredict system configuration taken from environment variables         */
/*******************************************************************************/
exports.config = {
	home:       process.env.RELPREDICT_HOME,
    uploads:    process.env.RP_UPLOADDIR,
	archives:   process.env.RP_ARCHIVEDIR,
	datafiles:  process.env.RP_DATAFILEDIR,
	batches:    process.env.RP_BATCHDIR,
	datamaps:   process.env.RP_DATAMAPDIR,
	jobs:       process.env.RP_JOBDIR,
	models:     process.env.RP_MODELDIR
};
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
}
releaseServer = function(server) {
	var i = jobServers.indexOf(server);
	if (i != -1)
		running[i] -= 1;
}
exports.getJobServerStatus = () => {
	var result = [];
	for (var i = 0; i < jobservers.length; i++) {
        result.push( { 'server'     : jobservers[i],
                       'running'    : running[i],
                       'total_jobs' : total[i]
                     });
	}
	return results;
}
getCommandMonitor(cmd, server) {
	/* TO-DO: Want to use command name to handle this - i.e. spark is port 4040 */
	return server + ':4040';
}
exports.runJob = (cmd) => {
    var server = acquireServer();
    ssh.connect({ host: server, username: cmd.username, privateKey: '/home/' + cmd.username + '/.ssh/id_rsa'})
        .then(function() {
            ssh.execCommand(cmd.command, 
                { cwd:'/home/' + cmd.username,     
       	               onStdout(chunk) { console.log('stdoutChunk', chunk.toString('utf8'))},
                       onStderr(chunk) { console.log('stderrChunk', chunk.toString('utf8'))}
                }
            );
            releaseServer(server);
        });
    return { 'server': server, 'monitor': getCommandMonitor(cmd.command, server});
}
/*******************************************************************************/
/*                         Data management functions                           */
/*******************************************************************************/
var makeFileEntry = function(fullFileName, fileStat) {
  var fPath = path.parse(fullFileName);
  var fileName   = fPath.base;
  var fileFormat = fPath.ext.replace(/\./g,' ').toUpperCase();
  var dirName    = fPath.dir;
  var fileType   = '?';
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
/* Recursively count all files below a directory path */
var fileCount = function(dirName) {
  var num = 0;
  var files = fs.readdirSync(dirName);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = path.join(dirName, files[i]);
    var fileStat = fs.statSync(fullFileName);
    if (stat.isDirectory()) num += fileCount(fullFileName);
    else num += 1;
  }
  return num;
}
exports.getBatches = () => {
  var entries = [];
  var files = fs.readdirSync(config.batches);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = path.join(config.batches, files[i]);
    var fileStat = fs.statSync(fullFileName);
    if (stat.isDirectory()) {
    	entries.push( { 'batch_name' : files[i],
                        'size'       : fileStat.size,
                        'created'    : fileStat.ctime,
                        'files'      : fileCount(fullFileName)
                      }
                    );
    }
  }
  return entries;
}
exports.getDatafiles = (datafileDir) => {
  var entries = [];
  var files = fs.readdirSync(datafileDir);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = path.join(datafileDir, files[i]);
    var fileStat = fs.statSync(fullFileName);
    var dmType = "?";
    if (fullFileName.endsWith('.csv')) dmType = 'Comma delimited';
    else if (fullFileName.endsWith('.tsv')) dmType = 'Tab delimited';
    if (stat.isDirectory()) {
    	entries.push( { 'datafile_name' : files[i],
                        'datafile_type' : dmType,
                        'size'          : fileStat.size,
                        'created'       : fileStat.ctime,                        
                      }
                    );
    }

}
exports.getBatch = (batch_id) => {
	var fullFileName = path.join(config.batches, batch_id);
	if (path.existsSync(fullFileName)) {
       var fileStat = fs.statSync(fullFileName);
       return [{ 'batch_name' : batch_id,
                 'size'       : fileStat.size,
                 'created'    : fileStat.ctime,
                 'files'      : fileCount(fullFileName)
               }];
    }
    else return [];
}
exports.getDatamaps = () => {
  var entries = [];
  var files = fs.readdirSync(config.datamaps);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = path.join(config.datamaps, files[i]);
    var dmType = "?";
    if (fullFileName.endsWith('.dmap')) dmType = 'Datamap';
    else if (fullFileName.endsWith('.xlate')) dmType = 'Xlate';
    if (stat.isDirectory()) {
    	entries.push( { 'datamap_name' : files[i],
                        'datamap_type' : dmType
                      }
                    );
    }
  }
  return entries;

}
exports.getDatamap = (map_id) => {
	var fullFileName = path.join(config.datamaps, map_id);
	if (path.existsSync(fullFileName)) {
       var fileStat = fs.statSync(fullFileName);
       return [{ 'datamap_name' : files[i],
                 'datamap_type' : dmType
              }];
    }
    else return [];
	
}
/*******************************************************************************/
/*                         Model management functions                          */
/*******************************************************************************/
/* Convert a JSON model to a relpredict modeldef file                          */
exports.convertModel = (model) => {
	var modelStr = '';
    return modelStr;
}