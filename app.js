const express = require('express');
const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const downloadRoutes = require('./routes/downloadRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const port = 5000;

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true
}));

app.use('/auth', authRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/download', downloadRoutes);
app.use('/files', fileRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
