var mongoose = require('mongoose'),
    os = require("os"),
    Hapi = require('hapi'),
    Bell = require('bell');

//var fs = require('fs'),
//    index = fs.readFileSync('index.html');


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
var UserSchema = new mongoose.Schema({
    id : String,
    firstName : String,
    lastName : String,
    pic : String,
    token : String
});
var Task = null,
    User = null
    isDevelopment = false;
if (os.hostname() == 'kah-E6410'){
    Task = mongoose.model('Task', TaskSchema, 'Deadlines_Development');
    User = mongoose.model('User', UserSchema, 'Deadlines_Users_Development');
    isDevelopment = true;
} else{
    Task = mongoose.model('Task', TaskSchema, 'Deadlines');
    User = mongoose.model('User', UserSchema, 'Deadlines_Users');
}


var server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 5000,
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

server.route({
    method: 'GET',
    path: '/user/{id}',
    handler: function (request, reply) {

        User.find({
            id : request.params.id
        }, function (err, docs) {
            if (err){
                console.log(err);
                return;
            }

            //response.statusCode = 200;
            //response.setHeader('Content-Type', 'application/json');
            //response.end(JSON.stringify(docs));
            console.log('(end) user read op');
            reply(docs);
        });
    }
});

server.register(Bell, function (err) {

    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: 'password',
        isSecure: false,
        // You'll need to go to https://console.developers.google.com and set up an application to get started
        // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
        // Next, go to "APIs & auth >> Credentials and Create new Client ID
        // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
        // This will net you the clientId and the clientSecret needed.
        // Also be sure to pass the redirect_uri as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
        clientId: '196527928799-s5fpgvs7un7lkmrqf15akk3lj0fdb8os.apps.googleusercontent.com',
        clientSecret: 'Hu-IkwGhHkqtrG4-GM-Cy3tX',
        providerParams: {
            //redirect_uri: server.info.uri + '/deadlines'
            redirect_uri: 'http://khalidhoffman.solutions/deadlines'
        }
    });

    // Use the 'twitter' authentication strategy to protect the
    // endpoint handling the incoming authentication credentials.
    // This endpoints usually looks up the third party account in
    // the database and sets some application state (cookie) with
    // the local application account information.
    server.route({
        method: '*',
        path: '/login',
        config: {
            auth: 'google',
            location: 'http://khalidhoffman.solutions',
            handler: function (request, reply) {
                var credentials = request.auth.credentials;
                User.findOneAndUpdate(
                    { id: credentials.id},
                    {
                        id : credentials.profile.id,
                        firstName : credentials.profile.name.first,
                        lastName : credentials.profile.name.last,
                        pic : credentials.profile.raw.picture,
                        token : credentials.token
                    },
                    {
                        upsert: true
                    }, function (err) {
                        //response.end('Successfully updated task');
                        //response.end();
                        //reply().code(204);
                        if(isDevelopment){
                            reply.redirect('http://192.168.1.9/deadlines#'+credentials.profile.id);
                        } else{
                            reply.redirect('http://khalidhoffman.solutions/deadlines#'+credentials.profile.id);
                        }

                        if (err){
                            console.log('(end) FAILED update op:', err);
                        } else{
                            console.log('(end) update op');
                        }
                    });
                // Perform any account lookup or registration, setup local session,
                // and redirect to the application. The third-party credentials are
                // stored in request.auth.credentials. Any query parameters from
                // the initial request are passed back via request.auth.credentials.query.
                //reply(request.auth.credentials).redirect('http://192.168.1.9/deadlines');
                //reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
            }
        }
    });

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});
