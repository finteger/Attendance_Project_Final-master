const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    session_id: {
        type: String,
        required: true,
        unique: true, // Ensure that the session_id is unique
        index: true // Create an index on session_id for faster queries
    },
    timestamp: {
        type: Date,
        required: true
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

