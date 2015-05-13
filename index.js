var mongoose = require('mongoose'),
    http = require("http");

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

var Task = mongoose.model('Task', TaskSchema, 'Deadlines');

http.createServer(function(request,response){
    var urlArray  = request.url.split('/'),
        op = urlArray[(urlArray.length-1)];

    //console.log('request: ',request);
    console.log('New Request - method:'+request.method);
    //console.log('url:'+ URLParser.parse(request.url));
    //console.log('headers: ', request.headers);
    //request.on('close',function(){
    //    console.log('close.trailers:', request.trailers);
    //});

    response.statusCode = 204;
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    response.setHeader('Cache-Control', 'no-cache');

    var requestData = '';

    request.on('data', function(chunk) {
        console.log('receiving request data');
        requestData += chunk;
    });

    request.on('end', function(){
        switch(request.method){
            case 'DELETE':
                var deletedTask = JSON.parse(requestData);
                Task.remove({
                    id : deletedTask.id
                }, function (err) {
                    //response.end('Successfully removed task');
                    response.end();
                    if (err){
                        console.log('(end) Failed remove op:', err);
                    } else{
                        console.log('(end) remove op');
                    }
                });
                break;
            case 'PUT':
            case 'POST':
                var taskData = JSON.parse(requestData);

                if(op == 'list'){
                    console.log('updating list:', requestData);
                    //Task.find({}, function (err, docs) {
                    //    if (err){
                    //        response.end();
                    //        console.log('(end) FAILED update list op: ', err);
                    //        return;
                    //    }
                    //    docs = taskData;
                    //    docs.save(function (err) {
                    //        response.end();
                    //        if (err) {
                    //            console.log('(end) FAILED update list op: ', err);
                    //        } else{
                    //            console.log('(end) update list op');
                    //        }
                    //    });
                    //});
                    break;
                }

                console.log('updating item');
                Task.findOneAndUpdate(
                    { id: taskData.id},
                    {
                        name: taskData.name || 'n/a',
                        dueDate: taskData.dueDate || new Date(),
                        notes: taskData.notes  || '',
                        comments: taskData.comments || []
                    },
                    {
                        upsert: true
                    }, function (err) {
                        //response.end('Successfully updated task');
                        response.end();

                        if (err){
                            console.log('(end) FAILED update op:', err);
                        } else{
                            console.log('(end) update op');
                        }
                    });

                break;
            case 'GET':
                // send collection json

                Task.find({}, function (err, docs) {
                    if (err){
                        console.log(err);
                        return;
                    }

                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(docs));
                    console.log('(end) read op');
                });
                break;
            case 'OPTIONS':

                //console.log(op[(op.length-1)]);
                //console.log('Operation: invalid: '+op);
                //console.log('trailers:', request.trailers);
                response.end();
                console.log('(end) default OPTIONS no-op');
                break;
            default:
                response.end();
                console.log('(end) INVALID op');
                break;
        }
    });
}).listen(process.env.PORT || 5000);