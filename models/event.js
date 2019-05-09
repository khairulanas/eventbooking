const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' } //one event created only by one user
});

module.exports = mongoose.model('Event', eventSchema); //'Event' is name of collection in mongodb