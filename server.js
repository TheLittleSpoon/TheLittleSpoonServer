// This is the starting point of this application.
// Here we are calling all the routes, middlewares and other nessaccery packages we need.
const express = require('express');
const config = require('config');
const logger = require('./startup/logging');
const startupDebug = require('debug')('app:startup');
// const io = require('socket.io').server;

// Startup folder loading.
require('./startup/logging');
require('./startup/validation')();
require('./startup/config')();
require('./startup/db')();
const app = express();
require('./startup/routes')(app);

// Config variables
const port = config.get('port');
const appName = config.get('name'); 

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

app.listen(port, () => {
    startupDebug(`${appName} started on port ${port}`);
    logger.info(`${appName} started on port ${port}`);
});