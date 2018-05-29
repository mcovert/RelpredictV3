'use strict';

var path, node_ssh, ssh, fs
 
var fs = require('fs')
var path = require('path')
var node_ssh = require('node-ssh')
var ssh = new node_ssh()
var rp = require('../../server/relpredict.js');

module.exports = function(Job) {
    Job.submitjob = function(job_info, cb) {
        var ret = rp.runJob(job_info);
        cb(null, ret);
    }
    Job.remoteMethod(
    'submitjob', {
      http: {
        path: '/submitjob',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'job_info',
            type: 'object'
      }],
      returns: {
        arg:  'returned_object',
        type: 'string'
      }
    });
    Job.getjobtemplate = function (cb) {
      //console.log('Getting job template');
        cb(null, rp.getJobTemplate());
    };
    Job.remoteMethod(
    'getjobtemplate', {
      http: {
        path: '/getjobtemplate',
        verb: 'get'
      },
      returns: [
      {
        arg:  'returned_object',
        type: 'string'
      }]
    });

};
