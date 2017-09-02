(function () {
  'use strict';

  module.exports = function (app) {
    app.all('/:url(api|auth|login|logout)/*', function (req, res, next) {
      console.info('Request: { Method: ' + req.method + '; URL: ' + req.originalUrl + ' }');
      next();
    });

    // routes
    app.use('/auth', require('./api/auth'));
    app.use('/logout', require('./api/auth/controller').exit);
    app.use('/api', require('./api/employee'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|db-service|client|bower_components|node_modules)/*')
      .get(function (req, res) {
        res.status(404).send({error: 404});
      });

    // All other routes should redirect to the index.html
    var indexHtml = app.get('appPath') + '/index.html';
    app.route('/*')
      .get(function (req, res) {
        res.sendFile(indexHtml);
      });

  };
})();