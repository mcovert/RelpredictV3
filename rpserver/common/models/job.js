'use strict';

var path, node_ssh, ssh, fs
 
var fs = require('fs')
var path = require('path')
var node_ssh = require('node-ssh')
var ssh = new node_ssh()

module.exports = function(Job) {
    Job.submit = function (job_class, job_name, job_parms, cb) {
    	console.log('Submitting job ' + job_class + "/" + job_name + " using " + job_parms);
        ssh.connect({ host: 'ai18', username: 'mcovert', privateKey: '/home/mcovert/.ssh/id_rsa'})
           .then(function() {
                 ssh.execCommand('bin/runsmall.sh', 
                 	             { cwd:'/home/mcovert/RelPredict',     
                 	               onStdout(chunk) { console.log('stdoutChunk', chunk.toString('utf8'))},
                                   onStderr(chunk) { console.log('stderrChunk', chunk.toString('utf8'))}
                                 }
                 );
           });
        cb(null, 'OK', 'ai18:4040');
    };
    Job.remoteMethod(
   	'submit', {
   		http: {
   			path: '/submit',
   			verb: 'post'
   		},
   		accepts: [ 
   		{
            arg:  'job_class',
            type: 'string'
   		},
   		{
            arg:  'job_name',
            type: 'string'
   		},
   		{
   			arg:  'job_parms',
   			type: 'string'
   		}],
   		returns: [
   		{
   			arg:  'status',
   			type: 'string'
   		},
   	    {   arg:  'url',
   	        type: 'string'
   	    }]
   	});

};
