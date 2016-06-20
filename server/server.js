var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
/*var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'logs/all-logs.log' })
    ]
});

logger.log('info', 'Hello distributed log files!');
logger.info('Hello again distributed logs');*/

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

  require('./push/push-manager')(app);

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
