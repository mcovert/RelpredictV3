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
   console.log('There are ' + models.length + ' Loopback defined:');
   models.forEach(function(m) { console.log(m.modelName)});
}
//var log         = app.models.Log;

/*******************************************************************************/
/*    RelPredict system configuration taken from environment variables         */
/*******************************************************************************/
var config = {
	home:         process.env.RELPREDICT_HOME,
	scripts:      process.env.RP_SCRIPTS,
  uploads:      process.env.RP_UPLOADDIR,
	archives:     process.env.RP_ARCHIVEDIR,
	datafiles:    process.env.RP_DATAFILEDIR,
	datamaps:     process.env.RP_DATAMAPDIR,
	jobs:         process.env.RP_JOBDIR,
	jobtemplates: process.env.RP_JOBTEMPLATEDIR,
	models:       process.env.RP_MODELDIR
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
	var i = jobservers.indexOf(server);
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
	if (cmd == 'spark') return 'http://' + server + ':4040';
	else return '';
};
/* Ouput log is sent back to the handlers below. They can be written to log files! */
exports.runJob = (cmd) => {
    var server = acquireServer();
    var fullCmd = path.join(config.scripts, cmd.command);
    console.log("Connecting to "+ server);
    ssh.connect({ host: server, username: cmd.username, privateKey: '/home/' + cmd.username + '/.ssh/id_rsa'})
        .then(function() {
            console.log("Running " + fullCmd);
            ssh.execCommand(fullCmd, 
                { cwd: config.home,
	               onStdout(chunk) { console.log('stdoutChunk', chunk.toString('utf8'))},
                   onStderr(chunk) { console.log('stderrChunk', chunk.toString('utf8'))}
                }
            );
            releaseServer(server);
        });
    return JSON.stringify({ 'server': server, 'monitor': getCommandMonitor(cmd.jobtype, server)});
}; 
/* Run local commands from home bin directory */
exports.runLocal = (cmd, parms) => {
	var cmdpath = config.home + '/bin/' + cmd;

	if (!fs.existsSync(cmdpath)) {
		console.log('Command script ' + cmdpath + ' was not found');
		return;
	}
    const cmdrun = spawn(cmdpath, parms, { cwd: config.scripts});
    cmdrun.stdout.on('data', (data) => { console.log(`${data}`); });
    cmdrun.stderr.on('data', (data) => { console.error(`${data}`);});
    cmdrun.on('exit', function (code, signal) { console.log('Command ' + cmd + ' exited with ' + `code ${code}`); } );
}
exports.getJobTemplate = () => {
	var fullFileName = path.join(config.jobtemplates, 'jobs.json');
	if (fs.existsSync(fullFileName)) {
       var fileStat = fs.statSync(fullFileName);
       var jtContent = fs.readFileSync(fullFileName, 'utf8').replace(/\n|\r|\t/g, " ");
       console.log(jtContent);
       return jtContent;
    }
    else return '';	
}
/*******************************************************************************/
/*                         Data management functions                           */
/*******************************************************************************/
exports.getDatafiles = () => { 
  dirTree.reset();
	return dirTree(config.datafiles);
}
getFileFormat = (ftype) => {
	if (ftype === ".csv") return "CSV";
	if (ftype === ".tsv") return "TSV";
	if (ftype === ".txt") return "TXT";
	if (ftype.startsWith(".")) return ftype.substring(1);
	if (ftype === "") return "?";
	return ftype;	
}
getDatafilesForDir = (dir) => {
  dirTree.reset(); 
  return JSON.parse(JSON.stringify(dirTree(dir)).replace(new RegExp(dir + '/','g'), '')); 
}
exports.getDatafileInfo = (fileName) => {
	//var fullFileName = path.join(config.datafiles, fileName);
	var fullFileName = fileName;
	if (fs.existsSync(fullFileName)) {
       var fileStat = fs.statSync(fullFileName);
       var fileType = "Directory";
       if (fileStat.isFile()) fileType = "File";
       var fparse = path.parse(fullFileName);
       return { 'datafile_name'    : fparse.name,
                'datafile_size'    : fileStat.size,
                'datafile_created' : fileStat.ctime,
                'datafile_format'  : getFileFormat(fparse.ext),
                'datafile_dir'     : fparse.dir,
                'datafile_type'    : fileType,
                'datafile_fullname': fullFileName
              };
    }
    else return {};
}
var buff_size = 8192;
var buffer = new Buffer(buff_size);
exports.getDatafileHeader = (fileName) => {
	//let fullFileName = path.join(config.datafiles, fileName);
	let fullFileName = fileName;
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
    if (fullFileName.endsWith('.datamap')) dmType = 'Datamap';
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
	//var fullFileName = path.join(config.datamaps, map_id);
	var fullFileName = map_id;
	if (fs.existsSync(fullFileName)) {
       var dmContent = fs.readFileSync(fullFileName, 'utf8');
       return dmContent;
    }
    else return "{}";
	
};
exports.saveDatamap = (datamap, dir, overwrite) => {
	//var fullFileName = path.join(config.datamaps, map_id);
  if (dir =="") dir = config.datamaps;
	var fullFileName = path.join(dir, datamap.datamap_name + ".datamap");
	if (!fs.existsSync(fullFileName) || overwrite) {
       fs.writeFileSync(fullFileName, JSON.stringify(datamap));
       return "Datamap saved";
    }
    else return 'The datamap exists and overwrite was not specified';
	
};
exports.deleteFile = (filename) => {
	//var fullFileName = path.join(config.datamaps, map_id);
	var fullFileName = filename;
	console.log(fullFileName);
    var fileStat = fs.statSync(fullFileName);
	if (fileStat.isFile()) {
       fs.unlinkSync(fullFileName);
       return "File deleted"
    }
    else {
    	let files = fs.readdirSync(fullFileName);
    	for (let i = 0; i < files.length; i++) {
    		console.log(files[i]);
    		fs.unlinkSync(path.join(fullFileName, files[i]));
    	}
    	fs.rmdirSync(fullFileName);
        return "Directory deleted";
    }
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
		parmStr = parmStr + parms[i].parm_name + '=' + parms[i].parm_value;
	}
    return parmStr;
}
createFeature = function(feature) {
    return '     feature '   + quoted(feature.name) +
           ' type '        + quoted(feature.type) +
           ' description ' + quoted(feature.label) +
           ' parameters  ' + quoted(createParms(feature.parms)) + '\n';
}
createAlgorithms = function(alg) {
	var algStr = '';
	if (alg == null) return algStr;
	for (var i = 0; i < alg.length; i++) {
		algStr = algStr + "algorithm=" + alg[i].short_name;
		var parmStr = createParms(alg[i].parms);
		if (parmStr != '') algStr = algStr + "," + parmStr + ";";
		else algStr = algStr + ";";
	}
	return algStr;
}                     
createTarget = function(target) {
    return '     target '    + quoted(target.name) +
           ' type '        + quoted(target.type) +
           ' description ' + quoted(target.description) +
           ' predictedby ' + quoted(createAlgorithms(target.algorithms)) + 
           ' parameters '  + quoted(createParms(target.parms)) + '\n';
}                     
convertModel = (model) => {
	console.log(model);
	var modelStr = 'model '    + quoted(model.name) + 
	               ' version ' + quoted(model.version) +
	               ' description ' + quoted(model.description) + '\n' +
	               '    featureset fset id ' + quoted(model.identifier) + '\n';
	for (var i = 0; i < model.features.length; i++)
		modelStr = modelStr + createFeature(model.features[i]);
	for (var i = 0; i < model.targets.length; i++)
		modelStr = modelStr + createTarget(model.targets[i]);
	console.log(modelStr);
    return modelStr;
}
exports.convertModel = convertModel; 
getModelPath = function(model) {
  console.log(config.models + " " + model.model_class + " " + model.name + " " + model.version.toString());
	return path.join(config.models, 
    	             model.model_class, 
    	             model.name,
    	             model.version.toString());
}
mkDir2 = (base, dirList) => {
  var newPath = base;
  for (var i = 0; i < dirList.length; i++) {
    console.log(newPath + " adding " + dirList[i]);
    newPath = path.join(newPath, dirList[i]);
    if (!fs.existsSync(newPath))
       fs.mkdirSync(newPath);
  }
  console.log(newPath);
  return newPath;
}
exports.getModelPath = getModelPath;
saveModel = (model, overwrite) => {
    var modelDef = convertModel(model);
    var modelJSON = JSON.stringify(model);
    var modelPath = mkDir2(config.models, [model.model_class, model.name, model.version.toString()]);
    for (var i = 0; i < model.targets.length; i++) {
    	for (var j = 0; j < model.targets[i].algorithms.length; j++) {
    		mkDir2(modelPath, [model.targets[i].name, model.targets[i].algorithms[j].short_name]);
    	}
    }
    var md = path.join(modelPath, model.name + '.modeldef');
    console.log(md);
    if (fs.existsSync(md) && !overwrite)
      return "Model exists and overwrite was not specified";
    fs.writeFileSync(path.join(md), modelDef);
    fs.writeFileSync(path.join(modelPath, model.name + '.json'), modelJSON);
    return "OK";
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
getModels = () => {
  var models = [];
  var model_classes = fs.readdirSync(config.models);
  for (var i = 0; i < model_classes.length; i++) {
    var mcdir = path.join(config.models, model_classes[i]);
    //console.log(mcdir);
    var model_names = fs.readdirSync(mcdir);
    for (var j = 0; j < model_names.length; j++) {
      var mdir = path.join(mcdir, model_names[j]);
      //console.log(mdir);
      var model_versions = fs.readdirSync(mdir);
      for (var k = 0; k < model_versions.length; k++) {
        var mjsondir = path.join(mdir, model_versions[k]);
        //console.log(mjsondir);
        var fjson = path.join(mjsondir, model_names[j] + ".json");
        //console.log(fjson);
        var model_json = fs.readFileSync(path.join(fjson));
        var model = JSON.parse(model_json);
        //console.log(model);
        models.push(model);
      }
    }
  }
  //console.log(models);
  return models;
}
exports.getModels = getModels;