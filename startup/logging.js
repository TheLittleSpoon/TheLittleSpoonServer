const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

const mongoServer = config.get('mongo-server');
const dbName = config.get('db-name');
const mongoUser = config.get('mongo-user');
const mongoPassword = config.get('mongo-pass');

const logger = winston.createLogger({
    transports: [
        // new winston.transports.File({ 
        //     filename: 'logs/spoon.log'
        // }),
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        }),
        new winston.transports.MongoDB({
            db: `mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`,
            options: { useNewUrlParser: true, useUnifiedTopology: true }
        })
    ],
    exceptionHandlers: [
        // new winston.transports.File({ filename: 'logs/exceptions.log' }),
        new winston.transports.MongoDB({
            db: `mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`,
            options: { useNewUrlParser: true, useUnifiedTopology: true }
        }),
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        })
    ],
    rejectionHandlers: [
        // new winston.transports.File({ filename: 'logs/rejections.log' }),
        new winston.transports.MongoDB({
            db: `mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`,
            options: { useNewUrlParser: true, useUnifiedTopology: true }
        }),
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        })
    ]
});

module.exports = logger;