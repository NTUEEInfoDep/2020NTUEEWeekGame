const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const socketio = require("socket.io");

const Constants = require("../shared/constants");
const Game = require("./game");
const webpackConfig = require("../../webpack.config.js");
const { check } = require("prettier");

// Setup an Express server
const app = express();
app.use(express.static("public"));

if (process.env.NODE_ENV === "development") {
  // Setup Webpack for development
  const compiler = webpack({ ...webpackConfig, mode: "development" });
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static("bundle"));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup the Game
const game = new Game();

function joinGame(userinfo) {
  game.addPlayer(this, userinfo);
}

// Handle keyboard input
function handleKeyInput(keyEvent) {
  game.handleKeyInput(this, keyEvent);
}

function onDisconnect() {
  game.removeDisconnectedPlayer(this);
}

function checkRoomname(roomname) {
  game.checkRoomname(this, roomname);
}
// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on("connection", (socket) => {
  console.log(`\nPlayer connected! (id: ${socket.id})`);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.KEY_INPUT, handleKeyInput);
  socket.on("disconnect", onDisconnect);
  socket.on(Constants.MSG_TYPES.CHECK_ROOMNAME, checkRoomname);
  // socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  // socket.on(Constants.MSG_TYPES.MOVE_CAMERA, handleCamera);
});
