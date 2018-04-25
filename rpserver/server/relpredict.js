var fs = require('fs')
var path = require('path')
var node_ssh = require('node-ssh')
var ssh = new node_ssh()
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
var serverNum  = 0;
acquireServer = function() {
	var runServer = jobservers[serverNum];
	running[serverNum] += 1;
	serverNum += 1;
	if (serverNum >= jobservers.length) serverNum = 0;
    return runServer;
}
releaseServer = function(server) {
	var i = jobServers.indexOf(server);
	if (i != -1)
		running[i] -= 1;
}
getCommandMonitor(cmd, server) {
	/* Want to use command name to handle this - i.e. spark is port 4040 */
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
var fileCount = function(dirName) {
  var num = 0;
  var files = fs.readdirSync(dirName);
  for (var i = 0; i < files.length; i++) {
    var fullFileName = dirName + '/' + files[i];
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
    var fullFileName = dirName + '/' + files[i];
    var fileStat = fs.statSync(fullFileName);
    if (stat.isDirectory()) {
    	entries.push( { 'batch_name' : files[i],
                        'size'       : fileStat.size,
                        'created'    : fileStat.created,
                        'files'      : fileCount(fullFileName)
                      }
                    );
    }
  }
  return entries;
}
exports.getDatafiles = () => {

}
exports.getBatch = (batch_id) => {

}
exports.getDatamaps = () => {

}
exports.getDatamap = (name) => {
	
}
/*******************************************************************************/
/*                         Model management functions                          */
/*******************************************************************************/
exports.convertModel = (model) => {

}