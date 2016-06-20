module.exports = function(app) {
  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;
  var Email = app.models.Email;

  function startPushServer() {
    // Add our custom routes
    var badge = 1;
    app.post('/notify/:id', function(req, res, next) {
      sendEmail(req.body.msg);
      var note = new Notification({
        expirationInterval: 3600, // Expires 1 hour from now.
        badge: badge++,
        sound: 'ping.aiff',
        title: 'Taxi',
        alert: req.body.msg,
        message: req.body.msg,
        messageFrom: 'Stephane'
      });

      PushModel.notifyById(req.params.id, note, function(err) {
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
        res.statusCode = 200;
        res.send('OK');
      });
    });

    PushModel.on('error', function(err) {
      console.error('Push Notification error: ', err.stack);
    });

    // Pre-register an application.
    // You should tweak config options in ./push-config.js

    var config = require('./push-config');

    var taxiApp = {
      id: config.appId,
      userId: config.appUserId,
      name: config.appName,
      description: config.appDescription,
      pushSettings: {
        apns: {
          certData: config.apnsCertData,
          keyData: config.apnsKeyData,
          pushOptions: {
            // Extra options can go here for APN
          },
          feedbackOptions: {
            batchFeedback: true,
            interval: 300
          }
        },
        gcm: {
          serverApiKey: config.gcmServerApiKey
        }
      }
    };

    updateOrCreateApp(function(err, appModel) {
      if (err) {
        throw err;
      }
      console.log('Application id: %j', appModel.id);
    });

    //--- Helper functions ---
    function updateOrCreateApp(cb) {
      Application.findOne({
          where: { id: taxiApp.id }
        },
        function(err, result) {
          if (err) cb(err);
          if (result) {
            console.log('Updating application: ' + result.id);
            delete taxiApp.id;
            result.updateAttributes(taxiApp, cb);
          } else {
            return registerApp(cb);
          }
        });
    }

    function registerApp(cb) {
      console.log('Registering a new Application...');
      // Hack to set the app id to a fixed value so that we don't have to change
      // the client settings
      Application.observe('before save', function validateAppName(ctx, next) {
        if (ctx.instance) {
          if (ctx.instance.name === taxiApp.name) {
            ctx.instance.id = config.appId;
          }
        }
        next();
      });
      Application.register(
        taxiApp.userId,
        taxiApp.name, {
          description: taxiApp.description,
          pushSettings: taxiApp.pushSettings
        },
        function(err, app) {
          if (err) {
            return cb(err);
          }
          return cb(null, app);
        }
      );
    }

    function sendEmail(msg) {
      Email.send({
        from: "Test User <p.raman83@gmail.com>", // sender address
        to: "stephane.trouilleau@gmail.com", // list of receivers
        subject: "Taxi", // Subject line
        html: "<b>" + msg + "</b>" // html body
      }, function(err) {
        if (err) {
          throw err;
        }
      })
    }
  }

  startPushServer();
};
