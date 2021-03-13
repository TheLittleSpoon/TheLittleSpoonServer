// This is the starting point of this application.
// Here we are calling all the routes, middlewares and other nessaccery packages we need.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// It doesn't work - or maybe package.json is not configured properly... => TODO
// const wsServer = new ws({
//   httpServer: server
// })

app.use(bodyParser.urlencoded({ extended: false }));

// All incoming request can parse json data
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Allow any (*) domain to my resource
  res.setHeader('Access-Control-Allow-Origin', '*');
  // This incoming request may have this headers
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-auth-token');
  res.setHeader('Access-Control-Allow-Methods',
    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
  next();
})

const server = require("http").createServer(app);
const config = require("config");
const logger = require("./startup/logging");
const startupDebug = require("debug")("app:startup");
const socketDebug = require("debug")("app:socket");
const io = require("socket.io")(server,  {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
  }
});

// Startup folder loading.
require("./startup/logging");
require("./startup/validation")();
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/prod")(app);

// Config variables
const port = config.get("port");
const appName = config.get("name");

let validOrigins = ['http://localhost:6200', 'http://35.192.214.216/']
let users = [];
io.on("connection", (socket) => {
  socketDebug("a user connected.");

  socket.on("login", (data) => {
    let address = socket.handshake.headers.origin
    console.log(address)
    if (validOrigins.includes(address)) {
      users.push({
        username: data,
      });
      console.log(users.length);
      // broadcast - because we only want to inform the other users
      // about the new connection and not the user that connected!
    }
    console.log("sending joind");
    socket.emit("joined", users);
  });

  socket.on("disconnect", () => {
    socketDebug("a user disconnected.");
    users.splice(0, 1);
    console.log(users.length);
    console.log("sending diconnectedUser");
    socket.emit("disconnectedUser", users);
  });
});

const mainServer = server.listen(port, () => {
  startupDebug(`${appName} started on port ${port}`);
  logger.info(`${appName} started on port ${port}`);
  console.log('listening on port ', port);
});

module.exports = mainServer;
