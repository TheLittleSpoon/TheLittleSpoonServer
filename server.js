const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const startupDebug = require('debug')('app:startup');
const dbDubug = require('debug')('app:db');
const mongoose = require('mongoose');
// const io = require('socket.io').server;
// Routers
const homeRouter = require('./routes/home');
const recipeRouter = require('./routes/recipes');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Config variables
const port = config.get('port');
const appName = config.get('name'); 
const mongoServer = config.get('mongo-server');
const dbName = config.get('db-name');
const mongoUser = config.get('mongo-user');
const mongoPassword = config.get('mongo-pass');

if (!config.get('jwtPrivateKey')) {
    startupDebug('FATAL ERROR: jwtPrivateKey is not defined.' );
    process.exit(1);
}

const app = express();
app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static('public'))
    .use(morgan('tiny'))
    .use('/', homeRouter)
    .use('/api/recipes', recipeRouter)
    .use('/api/users', userRouter)
    .use('/api/auth', authRouter);

// Coonnect to mongodb
mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@${mongoServer}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => dbDubug('Connected to MongoDB successfuly'))
    .catch(err => dbDubug('Could not connect to MongoDB: ', err));

// It doesn't work - or maybe package.json is not configured properly... => TODO
// const server = http.createServer(app);
// const wsServer = new ws({
//   httpServer: server
// })
//
// io.on('connection', (socket) => {
//   // broadcast - because we only want to inform the other users
//   // about the new connection and not the user that connected!
//   socket.broadcast.emit('joined', '');

//   socket.on('disconnect', () => {
//     socket.broadcast.emit('disconnected', '');
//   });

//   socket.on('new message', (msg) => {
//     io.emit('new message', msg);
//   });
// });

app.listen(port, () => startupDebug(`${appName} started on port ${port}`));