const mongoose = require('mongoose');
const config = require('config');
const logger = require('../startup/logging');
const dbDubug = require('debug')('app:db');

const mongoServer = config.get('mongo-server');
const dbName = config.get('db-name');
const mongoUser = config.get('mongo-user');
const mongoPassword = config.get('mongo-pass');

module.exports = function() {
    // Coonnect to mongodb
    mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            dbDubug('Connected to MongoDB successfuly');
            logger.info('Connected to MongoDB successfuly');
        })
}