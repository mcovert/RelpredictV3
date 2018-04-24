var fs = require('fs')
var path = require('path')
var node_ssh = require('node-ssh')
var ssh = new node_ssh()

var config = {
	home:       process.env.RELPREDICT_HOME,
    uploads:    process.env.RP_UPLOADDIR,
	archives:   process.env.RP_ARCHIVEDIR,
	datafiles:  process.env.RP_DATAFILEDIR,
	batches:    process.env.RP_BATCHDIR,
	datamaps:   process.env.RP_DATAMAPDIR,
	jobs:       process.env.RP_JOBDIR,
	models:     process.env.RP_MODELDIR
};

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
exports.runcmd = (cmd) => {
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