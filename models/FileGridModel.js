const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    //filedata: String,
    chunkSize: String,
    length: String,
    //size: Number,
    key: String,
    email: String,
    contentType: String,
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FileGrid', fileSchema, 'fs.files');
