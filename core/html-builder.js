var _ = require('lodash'),
    config = require('../config');

module.exports = {
    /**
     *
     * @param pagePath
     * @param pageData
     * @returns {string}
     */
    compile: function (pagePath, pageData) {

        var Page = require('./views/' + (pagePath || "page")),
            data = {
                title: 'Deadlines',
                stylesheets: config.stylesheetList,
                scripts: config.scriptsList
            };

        if (pageData) {
            _.extend(data, pageData);
        }

        generatedPage = new Page(data);

        //console.log('newPage: ', newPageData);
        var compiler = _.template(generatedPage.html);
        //console.log('compiling...');

        var compiledHTML = compiler(generatedPage);
        //console.log('compiledHTML: ', compiledHTML);

        return compiledHTML;
    }
}