var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
	key: fs.readFileSync('certs/privkey.pem'),
	cert: fs.readFileSync('certs/fullchain.pem')
};

// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

app.get('/', function (req, res) {
  res.json({message: 'Welcome to Athemath!'});
});
