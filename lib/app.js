import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const expressValidator = require('express-validator');

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const houseRouter = require('./routes/house');

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', houseRouter);

app.listen(8800, () => {
  console.log(`Server Started at ${8800}`);
});
