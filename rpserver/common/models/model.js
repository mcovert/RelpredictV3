'use strict';

module.exports = function(Model) {

    Model.nextversion = function (model_class, model_name, cb) {
    	console.log('Finding next version for ' + model_class + "/" + model_name);
    	var version = 1;
        Model.find({where: {and: [{model_class: model_class}, {name: model_name}]}, order: "version DESC", limit: 1}, function(err, models) {
        	console.log(models);
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
}
