var _ = require('lodash');

var Page = function(passedArgs){
    //console.log('passedArgs: ', passedArgs);
    var self = {};
    _.extend(self, {
        title : 'Title',
        charset: 'utf-8',
        url : 'https://localhost', // get host url
        favicon : 'deadlines/favicon.ico',
        body : {
            className : 'bodyclass'
        },
        scripts : [],
        stylesheets : []
    });

    _.assign(self, passedArgs);
    return self;
};

module.exports = Page;