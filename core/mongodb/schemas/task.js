
module.exports = {
    id : String,
    mongoId : String,
    name: String,
    dueDate: {type: Date, default: Date.now},
    notes: String,
    comments: [
        {
            body: String,
            author: String,
            iconUrl : String,
            postTime: {type: Date, default: Date.now}
        }
    ]
};