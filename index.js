var express = require('express');
var proxy = require('simple-http-proxy');

module.exports = function(host) {
  host = host || process.env.PROXY_HOST;

  if (!host) throw new Error('Missing proxy host');

  var user = process.env.PROXY_USERNAME;
  var pass = process.env.PROXY_PASSWORD;
  var auth = user && pass ?
    'Basic ' + new Buffer(user + ':' + pass).toString('base64') : undefined;

  var app = express();

  var proxied = proxy(host, {timeout: false});

  app.use(function(req, res, next) {
    req.url = req._parsedUrl.path;
    req.headers['x-fproxy-host'] = req.headers.host;
    req.headers['x-fproxy-authorization'] = req.headers['proxy-authorization'] || auth;
    req.headers.host = '';
    delete req.headers['proxy-authorization'];
    proxied(req, res, next);
  });

  return app;
};
