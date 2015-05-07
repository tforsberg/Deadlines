var mongoose = require('mongoose'),
    http = require("http");

var username = 'kahdev15';
var password = 'Clermont16';

mongoose.connect('mongodb://'+username+':'+password+'@ds053370.mongolab.com:53370/com_khalidhoffman_mongodb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('successfully connected.');
});

var TaskSchema = new mongoose.Schema({
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

var newTask = new Task({
    name: 'updated task name',
    dueDate: new Date(),
    notes: 'task Notes',
    comments: []
});

//Task.findOneAndUpdate

//newTask.save(function (err) {
//    if (err) {
//        console.log('error:', err);
//    }
//    console.log('success');
//});


http.createServer(function(request,response){
    console.log(request);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('hello world\n');
    response.write('request:\n');
    response.write(request.url);
    response.end();
}).listen(8080);