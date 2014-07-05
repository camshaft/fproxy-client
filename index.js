var express = require('express');
var proxy = require('simple-http-proxy');

module.exports = function(host) {
  host = host || process.env.PROXY_HOST;
  if (!host) throw new Error('Missing host');
  var app = express();

  app.use(function(req, res, next) {
    req.headers['x-host'] = req.headers.host;
    req.headers.host = '';
    next();
  });

  app.use(proxy(host, {timeout: false}));

  return app;
};
