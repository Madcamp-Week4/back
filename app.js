const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const mailRoutes = require('./routes/mailRoutes');


const app = express();
const port = 5000;

connectDB();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Content-Disposition'],
    origin: true,
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/mail', mailRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
