var fs = require('fs')
var path = require('path')
var node_ssh = require('node-ssh')
var ssh = new node_ssh()

exports.jobservers = [ 'ai24', 'ai25', 'ai26', 'ai27'];
exports.running = [0, 0, 0, 0];
var serverNum = 0;
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
    return server;
}