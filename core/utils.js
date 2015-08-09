var querystring = require('querystring');

module.exports = {
    basePath : '/deadlines',
    /**
     *
     * @param request
     * @param callback
     * @param thisArg
     */
    getDataFromRequest : function(request, callback, thisArg){
        var body = '';
        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                request.connection.destroy();
        });
        request.on('end', function () {
            try {
                var postData = JSON.parse(body);
                callback.call(thisArg, null, postData);
            } catch(e){
                console.error("Couldn't read data: ", body, e);
                callback.call(thisArg, e, null);
            }

        });
    }
};