const express = require("express");
const http = require("http");
const ws = require("ws");
const io = require("socket.io").server;

const app = express();
const server = http.createServer(app);
const port = 8000;
const wsServer = new ws({
  httpServer: server,
});

const clients = {};
var text = "";

var recipeApi = require("recipes/api/recipe.api.ts");

app.post("/recipes/create-recipe", async (request, response) =>
  recipeApi.saveRecipe(request, response)
);

io.on("connection", (socket) => {
  // broadcast - because we only want to inform the other users
  // about the new connection and not the user that connected!
  socket.broadcast.emit("joined", "");

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnected", "");
  });

  socket.on("new message", (msg) => {
    io.emit("new message", msg);
  });
});

server.listen(process.env.PORT || port, () => {
  console.log(`listening on port ${port} ....`);
});
