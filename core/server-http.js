var https = require("https"),
    http = require("http"),
    cookie = require('cookie'),
    cookieIdString = '__deadlines_Id',
    config = require('../config'),
    portNumber = require('../config').ports.unsecure,
    googleAuthRedirectURI = 'http://'+((config.isDevMode)?config.hostnames.development+':'+portNumber:config.hostnames.production)+"/deadlines",
    _ = require('lodash'),
    fs = require('fs'),
    url = require('url'),
    utils = require('./utils'),
    querystring = require('querystring'),
    mime = require('mime'),
    mongoose = require('./mongodb/mongoose'),
    htmlBuilder = require("./html-builder"),
    users = [],
    devRegex = /kah/,
    scriptRegex = /\.(js)$/,
    imageRegex = /\.(jpg|jpeg|png|gif|svg)$/,
    htmlRegex = /\.(html)$/,
    baseRegex = /^\/deadlines/,
    isDevelopment = devRegex.test(require('os').hostname().toLowerCase()), fileTypeRegex = /\.(\w+)$/,
    mongoDB = mongoose.connect(isDevelopment);

function handleGoogleCredentials(request, response) {
    var path = String(request.url),
        pathObj = url.parse(path, true);

    //console.log('request.url: ' + path);
    //console.log('pathObj: ', pathObj);
    var postData = querystring.stringify({
        'code': pathObj.query['code'],
        'client_id': '196527928799-s5fpgvs7un7lkmrqf15akk3lj0fdb8os.apps.googleusercontent.com',
        'client_secret': 'Hu-IkwGhHkqtrG4-GM-Cy3tX',
        'redirect_uri': googleAuthRedirectURI,
        'grant_type': 'authorization_code'
    });

    var apiRequestOptions = {
        hostname: 'www.googleapis.com',
        path: '/oauth2/v3/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var req = https.request(apiRequestOptions, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data += chunk;
        });
        res.on('end', function (chunk) {
            var parsedData = JSON.parse(data);
            if (parsedData['access_token']) {

                console.log('login success!');
                //var id = 'user'+users.length;
                //console.log('pathObj: ', pathObj);
                console.log('api-request.data: ', pathObj, parsedData);
                var id = require('crypto').createHash('md5').update(pathObj.query['code']).digest('hex');
                users[id] = parsedData['access_token'];
                mongoDB.schemas.User.findOneAndUpdate({
                        'id': id
                    },
                    {
                        token : users[id]
                    },
                    {
                        upsert: true
                    }, function (err) {
                        if (err) {
                            console.error('Failed to save user credentials:', err);
                            console.warn('no access_token received: ', data);
                            response.writeHead(204);
                            response.end();
                        } else {
                            console.log('Saved user credentials');

                            //console.log('users: ', users);
                            response.writeHead(302, {
                                "Content-Type": "text/html",
                                'Set-Cookie' : cookie.serialize(cookieIdString, id, {
                                    maxAge : 60*60*24
                                }),
                                'Location': googleAuthRedirectURI
                            });
                            response.end();
                        }
                    });
            } else {
                console.warn('no access_token received: ', data);
                response.writeHead(204);
                response.end();
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

function handlePageRequest(request , response, id) {
    var path = String(request.url),
        id = id || false;
    if (request.headers['referer']) {
        var refererURL = url.parse(request.headers['referer'], true);
        console.log('refererURL: ', refererURL);
        if (refererURL.query['continue']) {
            var refererContinuePath = url.parse(refererURL.query['continue'], true);
            id = refererContinuePath.query['state'];
            console.log('refererContinuePath: ', refererContinuePath);
        }
    }

    var idCookie = cookie.parse(request.headers['cookie'])[cookieIdString];
    if(idCookie){
        id=idCookie;
        console.log('id:', id);
    }

    if(request.headers['etag']){
        console.log("request.headers['etag']: ", request.headers['etag']);
    }

    if(request.headers['via']){
        console.log("request.headers['via']:", request.headers['via']);
    }
    if(request.headers['ETag']){
        console.log('user '+request.headers['ETag']+' requested login');
    }
    //console.log('handlePageRequest: ', url.parse(path, true));
    mongoDB.schemas.User.find({
        'id' : id
    }, function (err, users) {
        if (err) {
            console.error(err);
        }
        if (users && users.length>0) {
            console.log('user key: ', users[0]);
            https.get({
                hostname: 'www.googleapis.com',
                path: '/userinfo/v2/me',
                headers: {
                    'Content-length': 0,
                    'Authorization': 'Bearer ' + users[0].token
                }
            }, function (res) {
                var data = '';
                res.on('data', function (incomingData) {
                    data += incomingData;
                });

                res.on('end', function () {
                    var credentials = JSON.parse(data);
                    console.log('credentials: ', credentials);
                    response.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    response.write(htmlBuilder.compile('page.js', credentials));
                    response.end();
                });

            }).on('error', function (e) {
                console.error('failed to get api: ', e);
            });

        } else {
            console.log('request.url: ' + path + ' without id');
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.write(htmlBuilder.compile('page.js'));
            response.end();
        }
    });

}

function handleFileRequest(request, response){
    var path = String(request.url),
        imageRegexResults = imageRegex.exec(path),
        scriptRegexResults = scriptRegex.exec(path),
        fileTypeRegexResults = fileTypeRegex.exec(path),
        htmlRegexResults = htmlRegex.exec(path);

    // send collection json
    if (fileTypeRegexResults) {
        //console.log('fileTypeRegex: ', fileTypeRegexResults);
        var correctedPath = fileTypeRegexResults['input'].replace(baseRegex, "./public");
        response.writeHead(200, {
            "Content-Type": mime.lookup(correctedPath)
        });
        fs.readFile(correctedPath, function (err, data) {
            if (err) {
                console.error(err);
            } else {
                response.write(data);
                response.end();
            }
        });
    }
    else if (imageRegexResults) {
        console.log('imageRegex: ', imageRegexResults);
    }
    else if (scriptRegexResults) {
        console.log('scriptRegexResults: ', scriptRegexResults);
    }
    else if (htmlRegexResults) {
        console.log('htmlRegex: ', htmlRegexResults);
    }
    else {
        handleDataRequest(request, response);
    }
}

function handleDataRequest(request, response){
    console.log('request - '+request.url+':', request.method);
    var pathDecipherRegex = /\/(\w+)\/(\w+)/,
        pathObj = url.parse(request.url),
        pathArgs = pathDecipherRegex.exec(pathObj.path),
        id = (pathArgs)? pathArgs[2]:-1;
    switch (request.method) {
        case 'DELETE':
            console.log('Removing id: ', id);
            mongoDB.schemas.Task.remove({
                '_id' : id
            }, function (err) {
                //response.end('Successfully removed task');
                console.log((err)?'(end) Failed remove op:':'(end) remove op');
                response.writeHead((err)?409:204);
                response.end();
            });
            break;
        case 'POST':
            utils.getDataFromRequest(request, function (err, taskData) {
                if (err || taskData == null){
                    console.error(err);
                    response.writeHead(409);
                    response.end();
                    return;
                }

                var task = new mongoDB.schemas.Task(
                    {
                        name: taskData.name || 'n/a',
                        dueDate: taskData.dueDate || new Date(),
                        notes: taskData.notes || '',
                        comments: taskData.comments || []
                    }
                );

                task.save( function (err) {
                        //response.end('Successfully updated task');
                        //response.end();

                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(task));
                    response.end();

                        if (err) {
                            console.error('(end) FAILED update op:', err);
                        } else {
                            console.log('(end) update op');
                        }
                    });

            });
            break;
        case 'PUT':
            utils.getDataFromRequest(request, function (err, taskData) {
                if (err || taskData == null){
                    response.writeHead(409);
                    response.end();
                    return;
                }

                console.log('updating: ', taskData['_id']);
                mongoDB.schemas.Task.findOneAndUpdate(
                    {
                        '_id': taskData['_id']
                    },
                    {
                        name: taskData.name || 'n/a',
                        dueDate: taskData.dueDate || new Date(),
                        notes: taskData.notes || '',
                        comments: taskData.comments || []
                    },
                    {
                        upsert: true
                    }, function (err) {
                        //response.end('Successfully updated task');
                        //response.end();

                        response.writeHead(204);
                        response.end();

                        if (err) {
                            console.log('(end) FAILED update op:', err);
                        } else {
                            console.log('(end) update op');
                        }
                    });

            });

            break;
        case 'GET':
        default:
            mongoDB.schemas.Task.find({}, function (err, docs) {
                if (err) {
                    console.error(err);
                    return;
                }
                //response.statusCode = 200;
                //response.setHeader('Content-Type', 'application/json');
                //response.end(JSON.stringify(docs));

                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(docs));
                response.end();
            });
            break;
    }
}

function handleLoginRequest(request, response){
    var path = String(request.url),
        googleLoginURI = '',
        googleLoginURIBase = 'https://accounts.google.com/o/oauth2/auth',
        id = 'user' + users.length,
        googleLoginParams = {
            'response_type': 'code',
            'redirect_uri': googleAuthRedirectURI,
            'client_id': '196527928799-s5fpgvs7un7lkmrqf15akk3lj0fdb8os.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'state': id
        },
        paramIndex = 0;

    console.log('request.url: ' + path);

    _.forEach(googleLoginParams, function (param, field, arr) {
        if (paramIndex == 0) {
            googleLoginURI += googleLoginURIBase + '?';
            googleLoginURI += field + '=' + param;
        } else {
            googleLoginURI += '&' + field + '=' + param;
        }
        paramIndex++;
    });
    console.log('redirecting to : ', googleLoginURI);
    response.writeHead(303, {
        "Content-Type": "text/html",
        'Location': googleLoginURI
    });
    response.end();
}

var server = http.createServer(
    function (request, response) {
        var path = String(request.url),
        pathObj = url.parse(path, true);
        response.setHeader('Access-Control-Allow-Origin', googleAuthRedirectURI);

        switch (pathObj.pathname) {
            case '/deadlines':
                //console.log('[/deadlines]request.url: ', pathObj);
                //console.log('[/deadlines]request.headers: ', request.headers);

                if (pathObj.query['code']) {
                    handleGoogleCredentials(request, response);
                } else {
                    handlePageRequest(request, response);
                }
                break;
            case '/login':
                handleLoginRequest(request,response);
                break;
            case '/tasklist':
                handleDataRequest(request,response);
                break;
            default :
                handleFileRequest(request, response);
                break;
        }
});
server.portNumber = portNumber;
module.exports = server;

