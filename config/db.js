const mongoose = require('mongoose');
const { createModel } = require('mongoose-gridfs');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            dbName: "users"
        });
        Attachment = createModel();
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
