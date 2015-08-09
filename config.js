var CSS = require('./core/models/stylesheet.js'),
    Script = require('./core/models/script.js'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('site-config.json')),
    isDevMode = require('os').hostname().toLowerCase().indexOf('kah')>-1,
    hostnames = {
        development: 'localhost',
        production: 'www.khalidhoffman.solutions'
    };


module.exports = {
    hostname : (isDevMode)?hostnames['development']:hostnames['production'],
    hostnames : hostnames,
    basePath : '/deadlines',
    isDevMode : isDevMode,
    ports : {
        secure: process.env.PORT || config.ports.secure,
        unsecure: process.env.PORT || config.ports.unsecure
    },
    scriptsList : config.scripts.map(function(path, index, arr){
        return new Script({
            src : path
        });
    }),
    stylesheetList : config.stylesheets.map(function(path, index, arr){
        return new CSS(path);
    })
};