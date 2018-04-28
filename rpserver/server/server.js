'use strict';

for (let j = 0; j < process.argv.length; j++) {  
    console.log(j + ' -> ' + (process.argv[j]));
}

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var bodyParser = require('body-parser');
/* Logger */
app.use(bodyParser.urlencoded( { extended: false}));
app.use(bodyParser.json());
var logger = function(req, res, next) {
  console.log("REQ: " + req.url + " >>> " + JSON.stringify(req.body, null, 2));
  next();
}
app.use(logger);
/* end logger */
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// app.middleware('initial', function logResponse(req, res, next) {
//   res.on('finish', function() {
//     console.log(res.body, req.originalUrl, res.statusCode);
//   });
//   next();
// });

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
