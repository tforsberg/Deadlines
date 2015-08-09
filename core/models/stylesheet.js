var basePath = require('../utils.js').basePath;

/**
 *
 * @param href
 * @returns {CSS}
 * @constructor
 */
var CSS = function(href){

    this.href = basePath + href || 'http://localhost'; // get host url;
    return this;
};

module.exports = CSS;