var express = require('express');
var proxy = require('simple-http-proxy');

module.exports = function(host) {
  host = host || process.env.PROXY_HOST;

  if (!host) throw new Error('Missing proxy host');

  var app = express();

  var proxied = proxy(host, {timeout: false});

  app.use(function(req, res, next) {
    req.url = req._parsedUrl.path;
    req.headers['x-fproxy-host'] = req.headers.host;
    req.headers.host = '';
    proxied(req, res, next);
  });

  return app;
};
