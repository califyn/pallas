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
var not_secure = express();

// Create an HTTP service.
http.createServer(not_secure).listen(80);

// set up a route to redirect http to https
not_secure.get('*', function(req, res) {  
	res.redirect('https://' + req.headers.host + req.url);
})

// Create an HTTPS service identical to the HTTP service.
var app = express();
https.createServer(options, app).listen(3000);

app.get('/', function (req, res) {
	res.json({message: 'Welcome to Athemath!'});
});
