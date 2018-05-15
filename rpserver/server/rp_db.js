console.log('Start db');
// var db = require('node-any-jdbc');

// var config = {
//   libpath: '/home/mcovert/lib/HiveJDBC41.jar',
//   drivername: 'com.cloudera.hive.jdbc41.HS2DataSource',
//   uri: 'jdbc:hive2://ai04.analyticsinside.us:10000/relpredict',
//   user: 'mcovert',
//   password: 'airocks2016$'
// };

// var sql = 'SELECT * FROM relpredict.claim_status limit 10';
// db.execute(config, sql, function(results){
//   console.log(results);
// });
// var client = require('hive-thrift');
// console.log(JSON.stringify(client));
// client.connect(function (err, session) {
// 	console.log(err);
// 	console.log(session);
// 		client.getSchemasNames(session, function (err, resSchema) {
// 				console.log(err, resSchema);
// 				client.getTablesNames(session, 'relpredict', function (err, resTable) {
// 						console.log("Tables => " + JSON.stringify(resTable));
// 						var selectStatement = 'select * from relpredict.claim_status limit 10';
// 						client.executeSelect(session, selectStatement, function (error, result) {
// 								console.log(selectStatement + " => " + JSON.stringify(result));
// 						});	
// 				});
// 		});
//         client.disconnect(session, function(err, res){});
// });
var impala = require('node-impala'); 
var client = impala.createClient();
client.connect({host:       '192.168.100.108',
                port:        21000,
                resultType: 'json-array' })
        .then(message => console.log(message))
        .catch(error => console.error(error));
client.query("select * from relpredict.claim_status limit 10")
  .then(results => console.log(results))
  .catch(err => console.error(err));
client.close().catch((err) => console.error(err));
console.log('End db');