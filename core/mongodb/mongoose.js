var Task = null,
    User = null;

/**
 *
 * @param isDev
 */
module.exports.connect = function(isDev){
    var mongoose = require('mongoose'),
        isDevelopment = isDev || require('os').hostname().toLowerCase().indexOf('kah')>-1;

    var username = 'kahdev15',
        password = 'Clermont16';

    mongoose.connect('mongodb://'+username+':'+password+'@ds053370.mongolab.com:53370/com_khalidhoffman_mongodb');

    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function (callback) {
        console.log('successfully connected.');
    });

    var TaskSchema = new mongoose.Schema( require('./schemas/task'));
    var UserSchema = new mongoose.Schema( require('./schemas/user'));

    if (isDevelopment){
        console.log('Running in dev mode.');
        Task = mongoose.model('Task', TaskSchema, 'Deadlines_Development');
        User = mongoose.model('User', UserSchema, 'Deadlines_Users_Development');
    } else{
        Task = mongoose.model('Task', TaskSchema, 'Deadlines');
        User = mongoose.model('User', UserSchema, 'Deadlines_Users');
    };

    return {
        schemas : {
            Task : Task,
            User : User
        }
    }

};