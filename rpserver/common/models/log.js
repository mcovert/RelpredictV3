'use strict';

module.exports = function(Log) {
	Log.writeToLog = function(issuer, severity, result, action, msg, parms, user) {
        var dt = new Date();
        Log.create({  entry_date: dt.toISOString(),
   	                  issuer:     issuer,
   	                  severity:   severity,
   	                  result:     result,
   	                  action:     action,
   	                  msg:        msg,
   	                  userid:     user ? "user" : "<unknown>",
   	                  parms:      parms
                   });
	}
};