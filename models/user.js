const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdEvents: [ //create arrayObj so one user can have many event
        {
            type: Schema.Types.ObjectId,
            ref: 'Event', //ref to Event collection
        }
    ]
});

module.exports = mongoose.model('User', userSchema);