const express = require('express');
const path = require('path');
const morgan = require('morgan')
const mongoose = require('mongoose');
const app = express();

const {truckRouter} = require('./controllers/truckController'); 
const {authRouter} = require('./controllers/authController'); 
const {userRouter} = require('./controllers/userController'); 
const {loadRouter} = require('./controllers/loadController'); 

const {authMiddleware} = require('./middlewares/authMiddleware'); 

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);

app.use(authMiddleware);
app.use('/api/trucks', truckRouter);

app.use('/api/users/me', userRouter);

app.use('/api/loads', loadRouter);


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://alext:test1@cluster0.8zekx.mongodb.net/hw3db?retryWrites=true&w=majority', {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        app.listen(8080);
    } catch (err) {
        console.error(`Error on server startup: ${err.message}`);
    }
}

start();

app.use(errorHandler)

function errorHandler (err, req, res, next) {
  console.log(err)
  res.status(500).send({'message': 'Server error'});
}

