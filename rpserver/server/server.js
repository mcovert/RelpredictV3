'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var bodyParser = require('body-parser');
/* Logger */
app.use(bodyParser.urlencoded( { extended: false}));
app.use(bodyParser.json());
var logger = function(req, res, next) {
  //console.log(req.accessToken);
  //console.log("Token=" + req.accessToken.id);
  //console.log("userId=" + req.accessToken.userId);
  if (req.accessToken) {
    app.models.User.findById(req.accessToken.userId, function(err, user) {
      if (!user) return;
      req.currentUser = user.email;
      console.log("UserId=" + user.email + " REQ: " + req.url);
    });
  }
  else  {
    console.log("UserId=<unknown> REQ: " + req.url);
    req.currentUser = "<unknown>";    
  }
  next();
}
app.use(loopback.token());
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
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
