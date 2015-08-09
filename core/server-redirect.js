var http = require("http"),
    config = require('../config'),
    hostname = config.hostname,
    _ = require('lodash'),
    fs = require('fs'),
    url = require('url'),
    deadlinesRegex = /^\/deadlines/;

var server = http.createServer(function (request, response) {
    var pathObj = url.parse(request.url, true);
    if(deadlinesRegex.test(pathObj.pathname)){
        response.writeHead(302, {
            "location" : 'https://'+hostname+':'+config.ports.secure+'/deadlines'
        })
    } else{
        response.statusCode = 204;
    }
    response.end();
});

module.exports = server;

