var _ =require('lodash'),
    fs = require('fs'),
    compiler = _.template(fs.readFileSync(__dirname + '/html/footer.html').toString());

module.exports = function(data){
    return {
        innerHTML : compiler(data)
    };
}