const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    filedata: String,
    path: String,
    size: Number,
    key: String,
    email: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema, 'file');
