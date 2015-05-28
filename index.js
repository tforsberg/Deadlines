var mongoose = require('mongoose'),
    http = require("http"),
    os = require("os"),
    passport = require('passport'),
    GoogleAuth = require('passport-google'),
    Hapi = require('hapi'),
    bell = require('bell');

//var fs = require('fs'),
//    index = fs.readFileSync('index.html');

passport.use(
    new GoogleAuth.Strategy(
        {
            returnURL: 'http://khalidhoffman.solutions/deadlines',
            realm: 'http://khalidhoffman.solutions/'
        },
        function(identifier, profile, done) {
            console.log('google login 1.2');
            User.findOrCreate({ openId: identifier }, function(err, user) {
                console.log('google login 1.1');
                done(err, user);
            });
        }
    )
);

var username = 'kahdev15';
var password = 'Clermont16';

mongoose.connect('mongodb://'+username+':'+password+'@ds053370.mongolab.com:53370/com_khalidhoffman_mongodb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
    console.log('successfully connected.');
});

var TaskSchema = new mongoose.Schema({
    id : String,
    mongoId : String,
    name: String,
    dueDate: {type: Date, default: Date.now},
    notes: String,
    comments: [
        {
            body: String,
            author: String,
            postTime: {type: Date, default: Date.now}
        }
    ]
});
var Task;
if (os.hostname() == 'kah-E6410'){
    Task = mongoose.model('Task', TaskSchema, 'Deadlines_Development');
} else{
    Task = mongoose.model('Task', TaskSchema, 'Deadlines');
}


var server = new Hapi.Server();
server.connection({
    port: 5000,
    routes: {
        cors: true
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        // send collection json

        Task.find({}, function (err, docs) {
            if (err){
                console.log(err);
                return;
            }

            //response.statusCode = 200;
            //response.setHeader('Content-Type', 'application/json');
            //response.end(JSON.stringify(docs));
            console.log('(end) read op');
            reply(docs);
        });
    }
});
//
//server.route({
//    method: 'GET',
//    path: '/{name}',
//    handler: function (request, reply) {
//        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
//    }
//});

server.route({
    method: 'GET',
    path: '/auth/google',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'GET',
    path: '/auth/google/return',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'DELETE',
    path: '/',
    handler: function (request, reply) {
        var deletedTask = request.payload;
        console.log('Removing: ', deletedTask);
        Task.remove({
            id : deletedTask.mongoId
        }, function (err) {
            //response.end('Successfully removed task');
            //response.end();
            if (err){
                console.log('(end) Failed remove op:', err);
                reply('Failed to remove task');
            } else{
                console.log('(end) remove op');
                reply('Successfully removed task');
            }
        });
    }
});

server.route({
    method: ['PUT', 'POST'],
    path: '/',
    handler: function (request, reply) {
        var taskData = request.payload;
        console.log('save task: ',taskData);
        Task.findOneAndUpdate(
            { id: taskData.mongoId},
            {
                mongoId : taskData.mongoId || -1,
                name: taskData.name || 'n/a',
                dueDate: taskData.dueDate || new Date(),
                notes: taskData.notes  || '',
                comments: taskData.comments || []
            },
            {
                upsert: true
            }, function (err) {
                //response.end('Successfully updated task');
                //response.end();
                reply().code(204);

                if (err){
                    console.log('(end) FAILED update op:', err);
                } else{
                    console.log('(end) update op');
                }
            });
    }
});

server.register(bell, function (err) {

    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: 'cookie_encryption_password',
        clientId: 'my_twitter_client_id',
        clientSecret: 'my_twitter_client_secret',
        isSecure: false     // Terrible idea but required if not using HTTPS
    });

    // Use the 'twitter' authentication strategy to protect the
    // endpoint handling the incoming authentication credentials.
    // This endpoints usually looks up the third party account in
    // the database and sets some application state (cookie) with
    // the local application account information.
    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/login',          // The callback endpoint registered with the provider
        config: {
            auth: 'twitter',
            handler: function (request, reply) {

                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }
                // Perform any account lookup or registration, setup local session,
                // and redirect to the application. The third-party credentials are
                // stored in request.auth.credentials. Any query parameters from
                // the initial request are passed back via request.auth.credentials.query.
                return reply.redirect('/home');
            }
        }
    });
    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});

//http.createServer(function(request,response){
//    var urlArray  = request.url.split('/'),
//        op = urlArray[(urlArray.length-1)],
//        requestPath = request.url;
//
//    //console.log('request: ',request);
//    console.log('New Request - method:',request.url);
//    //console.log('url:'+ URLParser.parse(request.url));
//    //console.log('headers: ', request.headers);
//    //request.on('close',function(){
//    //    console.log('close.trailers:', request.trailers);
//    //});
//
//    response.statusCode = 204;
//    response.setHeader('Content-Type', 'text/plain');
//    response.setHeader('Access-Control-Allow-Origin', '*');
//    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//    response.setHeader('Cache-Control', 'no-cache');
//
//    var requestData = '';
//
//    request.on('data', function(chunk) {
//        console.log('receiving request data');
//        requestData += chunk;
//    });
//
//    request.on('end', function(){
//        switch(request.method){
//            case 'DELETE':
//                var deletedTask = JSON.parse(requestData);
//                Task.remove({
//                    id : deletedTask.mongoId
//                }, function (err) {
//                    //response.end('Successfully removed task');
//                    response.end();
//                    if (err){
//                        console.log('(end) Failed remove op:', err);
//                    } else{
//                        console.log('(end) remove op');
//                    }
//                });
//                break;
//            case 'PUT':
//            case 'POST':
//                var taskData = JSON.parse(requestData);
//
//                if(op == 'list'){
//                    console.log('updating list:', requestData);
//                    //Task.find({}, function (err, docs) {
//                    //    if (err){
//                    //        response.end();
//                    //        console.log('(end) FAILED update list op: ', err);
//                    //        return;
//                    //    }
//                    //    docs = taskData;
//                    //    docs.save(function (err) {
//                    //        response.end();
//                    //        if (err) {
//                    //            console.log('(end) FAILED update list op: ', err);
//                    //        } else{
//                    //            console.log('(end) update list op');
//                    //        }
//                    //    });
//                    //});
//                    response.end();
//                    break;
//                }
//
//                switch(requestPath){
//                    case '/auth/google':
//                        console.log('google login 1.3');
//                        passport.authenticate('google');
//                        response.end();
//                        break;
//                    case '/auth/google/return':
//                        console.log('google login 1.3');
//                        passport.authenticate('google', {
//                            successRedirect : '/',
//                            failureRedirect : '/#failed'
//                        });
//                        response.end();
//                        break;
//                }
//
//                console.log('updating item');
//                Task.findOneAndUpdate(
//                    { id: taskData.mongoId},
//                    {
//                        mongoId : taskData.mongoId || -1,
//                        name: taskData.name || 'n/a',
//                        dueDate: taskData.dueDate || new Date(),
//                        notes: taskData.notes  || '',
//                        comments: taskData.comments || []
//                    },
//                    {
//                        upsert: true
//                    }, function (err) {
//                        //response.end('Successfully updated task');
//                        response.end();
//
//                        if (err){
//                            console.log('(end) FAILED update op:', err);
//                        } else{
//                            console.log('(end) update op');
//                        }
//                    });
//
//                break;
//            case 'GET':
//                // send collection json
//
//                switch(requestPath){
//                    case '/auth/google':
//                        console.log('google login 1.5', passport);
//                        passport.authenticate('google');
//                        response.end();
//                        break;
//                    case '/auth/google/return':
//                        console.log('google login 1.4');
//                        passport.authenticate('google', {
//                            successRedirect : '/',
//                            failureRedirect : '/#failed'
//                        });
//                        response.end();
//                        break;
//                }
//                Task.find({}, function (err, docs) {
//                    if (err){
//                        console.log(err);
//                        return;
//                    }
//
//                    response.statusCode = 200;
//                    response.setHeader('Content-Type', 'application/json');
//                    response.end(JSON.stringify(docs));
//                    console.log('(end) read op');
//                });
//                break;
//            case 'OPTIONS':
//
//                //console.log(op[(op.length-1)]);
//                //console.log('Operation: invalid: '+op);
//                //console.log('trailers:', request.trailers);
//                response.end();
//                console.log('(end) default OPTIONS no-op');
//                break;
//            default:
//                response.end();
//                console.log('(end) INVALID op');
//                break;
//        }
//    });
//}).listen(process.env.PORT || 5000);