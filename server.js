const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require("path");

const { createProxyMiddleware } = require('http-proxy-middleware');

var DIST_DIR = path.join(__dirname, "dist");
var app = express();

var options = {
	key: fs.readFileSync('secrets/privkey.pem'),
	cert: fs.readFileSync('secrets/fullchain.pem')
};

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

app.use('/api', createProxyMiddleware({
    target: "https://[::1]:3000",
    pathRewrite: {
        [`^/api`]: '',
    },
}));

//Send index.html when the user access the web
app.get("*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

https.createServer(options, app).listen(443, () => {
    console.log('Server started.');
});
