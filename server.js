const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const startupDebug = require('debug')('app:startup');
const dbDubug = require('debug')('app:db');
const mongoose = require('mongoose');
// Routers
const homeRouter = require('./routes/home');
const recipeRouter = require('./routes/recipe');

// Config variables
const port = config.get('port');
const appName = config.get('name'); 
const mongoServer = config.get('mongo-server');
const dbName = config.get('db-name');
const mongoUser = config.get('mongo-user');
const mongoPassword = config.get('mongo-pass');

const app = express();
app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static('public'))
    .use(morgan('tiny'))
    .use('/', homeRouter)
    .use('/api/recipes', recipeRouter);

// Coonnect to mongodb
mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => dbDubug('Connected to MongoDB successfuly'))
    .catch(err => dbDubug('Could not connect to MongoDB: ', err));

app.listen(port, () => startupDebug(`${appName} started on port ${port}`));