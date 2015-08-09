var basePath = require('../utils.js').basePath;

/**
 *
 * @param passedArgs {{src: (*|function()|string|string), type: (*|string), placement: {header: boolean, footer: boolean}}}
 * @returns {{src: (*|function()|string|string), type: (*|string), placement: {header: boolean, footer: boolean}}}
 * @constructor
 */
module.exports = function(passedArgs){
    var args = passedArgs || {};
    return {
        src: basePath + args.src || 'https://localhost', // get host url
        type: args.type || 'text/javascript',
        placement: {
            header : (args.isHeader)?args.isHeader:true,
            footer : (args.isHeader)?!args.isHeader:false
        }
    }
};