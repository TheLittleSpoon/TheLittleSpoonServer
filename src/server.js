// Express
const express = require('express');
// Morgan
const morgan = require('morgan');
// Config
const config = require('config');
// Debug
const startupDebug = require('debug')('app:startup');
const dbDubug = require('debug')('app:db');
// Mongo
const mongoose = require('mongoose');
// Routers
const homeRouter = require('./routes/home');
const recipeRouter = require('./routes/recipe');

const app = express();

// Config variables
const port = config.get('port');
const appName = config.get('name');
const mongoServer = config.get('mongo-server');
const dbName = config.get('db-name');
const mongoUser = config.get('mongo-user');
const mongoPassword = config.get('mongo-pass');

// Coonnect to mongodb
mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => dbDubug('Connected to MongoDB successfuly'))
    .catch(err => dbDubug('Could not connect to MongoDB: ', err));

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static('public'))
    .use(morgan('tiny'))
    .use('/', homeRouter)
    .use('/api/recipes', recipeRouter);

app.listen(port, () => {
    console.log(`Listening on ${port}...`);
    startupDebug(`${appName} started on port ${port}`);
});