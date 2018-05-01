var fs          = require('fs');
var path        = require('path');
var node_ssh    = require('node-ssh');
var ssh         = new node_ssh();
var multer      = require('multer');
const { spawn } = require('child_process');
const dirTree   = require('directory-tree');
var app         = require('./server.js');

exports.showModels = () => {
   var models = app.models();
   console.log('There are ' + models.length + ' defined:');
   models.forEach(function(m) { console.log(m.modelName)});
}
//var log         = app.models.Log;

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
/*******************************************************************************/
/*                             Utility functions                               */
/*******************************************************************************/
getUserid = () => { return 'mcovert@ai.com'; };
writeLog = function(issuer, severity, result, action, msg, parms, user) {
   var dt = new Date();	
   app.models.Log.create({
   	 entry_date: dt.toISOString(),
   	 issuer:     issuer,
   	 severity:   severity,
   	 result:     result,
   	 action:     action,
   	 msg:        msg,
   	 userid:     user,
   	 parms:      parms
   });
}
exports.writeLog = writeLog;
writeLogEntries = function(entries) {
	for (var e in entries)
		writeLog(e);
}
exports.writeLogEntries = writeLogEntries;
makeDir = function(dir) {
	if (fs.existsSync) return;
	fs.mkdirSync(dir);
}
makeDirP = function(base, dir) {
	var dirList = dir.split(path.sep);
	var dirNew = base;
	for (var i = 0; i < dirList.length; i++) {
		dirNew = path.join(dirNew, dirList[i]);
		fs.makeDir(dirNew);
	}
}
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
exports.getDatafiles = () => { 
	return JSON.parse(JSON.stringify(dirTree(config.datafiles)).replace(new RegExp(config.datafiles + '/','g'), ''));
}
getDatafilesForDir = (dir) => { return JSON.parse(JSON.stringify(dirTree(dir)).replace(new RegExp(dir + '/','g'), '')); }
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
var buff_size = 8192;
var buffer = new Buffer(buff_size);
exports.getDatafileHeader = (fileName) => {
	let fullFileName = path.join(config.datafiles, fileName);
    let fd = fs.openSync(fullFileName, 'r');
    fs.readSync(fd, buffer, 0, buff_size, 0);
    fs.closeSync(fd);
    let inbuff = buffer.toString('utf8').split('\n');
	return { 'datafile_name'   : fileName,
             'datafile_header' : inbuff[0] || '',
             'datafile_record' : inbuff[1] || ''
           };
}
exports.getDatamapList = () => {
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
convertModel = (model) => {
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
exports.convertModel = convertModel; 
getModelPath = function(model) {
	return path.join(config.models, 
    	             model.model_class, 
    	             model.model_name,
    	             model.version);
}
exports.getModelPath = getModelPath;
saveModel = (model) => {
    var modelDef = convertModel(model);
    var modelJSON = JSON.stringify(model);
    var modelPath = getModelPath(model);
    makeDirP(modelPath);
    for (var i = 0; i < model.targets.length; i++) {
    	for (var j = 0; j < model.targets[i].algorithms.length; j++) {
    		makeDirP(path.join(modelPath, 
    			               model.targets[i].targetName,
    			               model.targets[i].algorithms[j].name));
    	}
    }
    fs.writeFileSync(path.join(modelPath, model_name + '.modeldef'), modelDef);
    fs.writeFileSync(path.join(modelPath, model_name + '.json'), modelJSON);
    return modelPath;
}
exports.saveModel = saveModel;
makeTrainedModel = (trained_model) => {
    var modelPath = getModelPath(model);
    var subdirs = fs.readdirSync(modelPath);
    var newdir = 0;
    for (var i = 0; i < subdirs.length; i++) {
       var dirNum = parseInt(subdirs[i]);	
       if (dirNum > newdir) newdir = dirNum;
    }
    newdir += 1;
    var dirPath = path.join(modelPath, newdir.toString());
    fs.mkdirSync(dirPath);
    return dirPath;
}
exports.makeTrainedModel = makeTrainedModel;
