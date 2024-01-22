const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema, 'file');
