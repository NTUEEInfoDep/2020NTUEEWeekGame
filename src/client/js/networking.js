// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking

import io from "socket.io-client";
import { throttle } from "throttle-debounce";
import { processGameUpdate } from "./state";
// import { getCharacterNum } from "./render";

const Constants = require("../../shared/constants");

const socketProtocol = window.location.protocol.includes("https")
  ? "wss"
  : "ws";
const socket = io(`${socketProtocol}://${window.location.host}`, {
  reconnection: false,
});
const connectedPromise = new Promise((resolve) => {
  socket.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("Connected to server!");
    resolve();
  });
});

export const connect = (onGameOver) =>
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log("Disconnected from server.");
      document.getElementById("disconnect-window").classList.remove("hidden");
      document.getElementById("reconnect-button").onclick = () => {
        window.location.reload();
      };
    });
  });

export const play = (roomName, characterSelected) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, [
    roomName,
    [window.innerWidth, window.innerHeight],
    characterSelected,
  ]);
};

export const queueEnd = new Promise((resolve) => {
  socket.on(Constants.MSG_TYPES.QUEUE_END, () => {
    // eslint-disable-next-line no-console
    console.log("QE!");
    resolve();
  });
});

export const roomNA = (roomID) => {
  socket.emit(Constants.MSG_TYPES.CHECK_ROOMNAME, roomID);
  socket.on(Constants.MSG_TYPES.CHECK_ROOMNAME, (num) => {
    //
    //
    // eslint-disable-next-line no-alert
    // alert(`There are ${num} players in this room.`);
    // Redesign if possible
    //
  });
};

export const updateDirection = throttle(20, (dir) => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
});

export const updateMovement = throttle(20, (movement) => {
  socket.emit(Constants.MSG_TYPES.KEY_INPUT, movement);
});

export const updateCamera = throttle(20, (mouseXY) => {
  socket.emit(Constants.MSG_TYPES.MOVE_CAMERA, mouseXY);
});
