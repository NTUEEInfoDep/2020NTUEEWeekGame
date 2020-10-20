import io from "socket.io-client";
import { throttle } from "throttle-debounce";
import { processGameUpdate } from "./state";
import { randommap } from "./render";

const $id = (element) => document.getElementById(element);

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
      console.log("Disconnected from server...");
      $id("join-page").classList.add("hidden");
      $id("crt-page").classList.add("hidden");
      $id("rule-page").classList.add("hidden");
      $id("game-over-page").classList.add("hidden");
      $id("alert-page").classList.remove("hidden");
      $id("alert-title").innerHTML = "Disconnected";
      $id("alert-button").innerHTML = "reconnect";
      $id("alert-button").onclick = () => {
        window.location.reload();
      };
    });
  });

export const play = (roomName, crtSelected) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, [
    roomName,
    [window.innerWidth, window.innerHeight],
    crtSelected,
  ]);
};

export const queueEnd = new Promise((resolve) => {
  socket.on(Constants.MSG_TYPES.QUEUE_END, () => {
    resolve();
  });
});

socket.on(Constants.MSG_TYPES.MAP, randommap);

export const checkRoom = (roomID) => {
  socket.emit(Constants.MSG_TYPES.CHECK_ROOMNAME, roomID);
  socket.on(Constants.MSG_TYPES.CHECK_ROOMNAME, (num) => {
    if (`${num}` === "2") {
      $id("join-page").classList.add("hidden");
      $id("crt-page").classList.add("hidden");
      $id("alert-page").classList.remove("hidden");
      $id("alert-title").innerHTML = "Room is Full ...";
      $id("alert-button").innerHTML = "change a room";
      $id("alert-button").onclick = () => {
        window.location.reload();
      };
    }
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
