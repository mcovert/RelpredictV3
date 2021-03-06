'use strict';
var rp = require('../../server/relpredict.js');

module.exports = function(Model) {

    Model.nextversion = function (model_class, model_name, cb) {
    	//console.log('Finding next version for ' + model_class + "/" + model_name);
    	var version = 1;
      Model.find({where: {and: [{model_class: model_class}, {name: model_name}]}, order: "version DESC", limit: 1}, function(err, models) {
            if (!!models && models.length > 0) version = models[0].version + 1;
            cb(null, version);
      });
    };
    Model.remoteMethod(
   	'nextversion', {
   		http: {
   			path: '/nextversion',
   			verb: 'get'
   		},
   		accepts: [ {
            arg:  'model_class',
            type: 'string'
   		},
   		{
   			arg:  'model_name',
   			type: 'string'
   		}],
   		returns: {
   			arg:  'version',
   			type: 'number'
   		}
   	});

    Model.setcurrent = function (model_class, model_name, model_version, cb) {
    	//console.log('Setting current version for ' + model_class + "/" + model_name + " to " + model_version);
    	var version = 1;
        Model.findOne({where: {and: [{model_class: model_class}, {name: model_name}, {current: true}]}}, function(err, model) {
            //console.log('old'); console.log(model);
            if (!!model) model.updateAttribute('current', false, function(err, model) {
                //console.log(model);
            });
        });
        Model.findOne({where: {and: [{model_class: model_class}, {name: model_name}, {version: model_version}]}}, function(err, model) {
            //console.log('new'); console.log(model);
            if (!!model) model.updateAttribute('current',  true, function(err, model) {
                //console.log(model);
            });
        });
        cb(null, "OK");
    };
    Model.remoteMethod(
   	'setcurrent', {
   		http: {
   			path: '/setcurrent',
   			verb: 'get'
   		},
   		accepts: [ {
            arg:  'model_class',
            type: 'string'
   		},
   		{
   			arg:  'model_name',
   			type: 'string'
   		},
   		{
   			arg:  'model_version',
   			type: 'number'
   		}],
   		returns: {
   			arg:  'success',
   			type: 'string'
   		}
   	});
    Model.convert = function (model, cb) {
        console.log(model);
        cb(null, rp.convertModel(model));
    };
    Model.remoteMethod(
    'convert', {
      http: {
        path: '/convert',
        verb: 'post'
      },
      accepts: [ {
            arg:  'model',
            type: 'object'
      }],
      returns: {
        arg:  'returned_object',
        type: 'string'
      }
    });
   Model.createmodel = function(model, overwrite, cb) {
      var ret = rp.saveModel(model, overwrite);
      //console.log(ret);
      cb(null, ret);
   };   
  Model.remoteMethod('createmodel', {
      http: {
        path: '/createmodel',
        verb: 'post'
      },
      accepts: [ 
      {
            arg:  'model',
            type: 'object'
      },
      {
            arg:  'overwrite',
            type: 'boolean'
      }],
      returns: [
      {
        arg:  'returned_object',
        type: 'string'
      }]
    });
   Model.listmodels = function(req, cb) {
      var retFiles = rp.getModels();
      //console.log(retFiles);
      cb(null, retFiles);
   };   
   Model.remoteMethod('listmodels', {
      http: {
        path: '/listmodels',
        verb: 'get'
      },
      accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
      }], 
      returns: {
        arg:  'models',
        type: 'array'
      }
    })
   Model.getmodel = function(model_class, model_name, model_version, cb) {
      var retFile = rp.getModel(model_class, model_name, model_version);
      cb(null, retFile);
   };   
   Model.remoteMethod('getmodel', {
      http: {
        path: '/getmodel',
        verb: 'post'
      },
      accepts: [
            {
               arg: 'model_class',
               type: 'string'
            },
            {
               arg: 'model_name',
               type: 'string'
            },
            {
               arg: 'model_version',
               type: 'string'
            }
      ], 
      returns: {
        arg:  'model',
        type: 'object'
      }
    })

}
