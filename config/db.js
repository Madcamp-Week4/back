const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            dbName: "users"
        });
        // const conn = mongoose.connection;

        // let gfs;
        // Grid.mongo = mongoose.mongo;

        // conn.once('open', () => {
        // // GridFS 스트림 초기화
        // gfs = Grid(conn.db);
        // });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
