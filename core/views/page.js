var fs = require('fs'),
    PageView = function(dataArgs){
        var pageData = require('../models/page.js')(dataArgs);
        //console.log('footer.pageData: ', pageData);
        return {
            _ : require('lodash'),
            data : pageData,
            html : fs.readFileSync(__dirname + '/html/page.html').toString(),
            views : {
                header : require('../views/header.js')({
                    data : pageData
                }),
                footer : require('../views/footer.js')({
                    data : pageData,
                    credentials : {
                        name : pageData.name || 'User',
                        given_name : pageData.given_name || 'User',
                        family_name : pageData.family_name || 'Name',
                        picture : pageData.picture || 'https://placehold.it/500x500'
                    }
                })
            }
        }
    };

module.exports = PageView;