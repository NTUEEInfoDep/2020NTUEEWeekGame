const { join } = require("lodash");
const Constants = require("../shared/constants");
const Player = require("./player");
const Camera = require("./camera");
const applyCollisions = require("./collisions");

class Game {
  constructor() {
    this.randomrooms = [];
    this.playrooms = {};
    this.waitrooms = {};
    this.sockets = {};
    this.players = {};
    this.cameras = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    const side = username in this.waitrooms;
    let x;
    if (side) x = Constants.MAP_SIZE_LENGTH * (0.6 + Math.random() * 0.2);
    else x = Constants.MAP_SIZE_LENGTH * (0.4 - Math.random() * 0.2);
    const y =
      (Constants.MAP[Math.floor(x / 10)] * (x % 10) +
        Constants.MAP[Math.floor(x / 10 + 1)] * (10 - (x % 10))) /
      10;
    // Adding player to rooms and store the name. The first player joined
    // goes to waitrooms. The second player will be join and move the room
    // from waitrooms to playrooms. If a third player is coming, it will be blocked.
    // Ridection or alert for this is still needed.
    if (username === "random") {
      console.log("random pair triggered!");
      this.randomrooms.push(socket.id);
      // this.players[socket.id] = new Player(socket.id, username, x, y, side);
      if (this.randomrooms.length >= 2) {
        const player1 = this.sockets[this.randomrooms.pop()];
        const player2 = this.sockets[this.randomrooms.pop()];
        this.addPlayer(player1, player1.id);
        this.addPlayer(player2, player1.id);
        // return;
      } else console.log("Waiting to be paired !!!");
    } else if (username in this.playrooms) {
      console.log("The room is too crowd");
      delete this.sockets[socket.id];
      // return;
    } else if (username in this.waitrooms) {
      socket.join(username);
      this.playrooms[username] = this.waitrooms[username];
      this.playrooms[username].push(socket.id);
      delete this.waitrooms[username];
      this.players[socket.id] = new Player(socket.id, username, x, y);
    } else {
      socket.join(username);
      this.waitrooms[username] = [];
      this.waitrooms[username].push(socket.id);
      this.cameras[username] = new Camera(socket.id, username, x, y);
      this.players[socket.id] = new Player(socket.id, username, x, y);
    }
    console.log(this.players);
    console.log("Playrooms:");
    console.log(this.playrooms);
    console.log("Waitrooms:");
    console.log(this.waitrooms);
  }

  // Simply remove player from game
  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  // Deal with disconnected player and its room
  removeDisconnectedPlayer(socket) {
    Object.keys(this.playrooms).forEach((roomname) => {
      const playerIDs = this.playrooms[roomname];
      if (playerIDs.includes(socket.id)) {
        this.removeRoom(roomname, playerIDs);
      }
    });
  }

  // Send Game over and remove room and players
  removeRoom(roomname, playerIDs) {
    delete this.playrooms[roomname];
    delete this.cameras[roomname];
    playerIDs.forEach((playerID) => {
      this.sockets[playerID].emit(Constants.MSG_TYPES.GAME_OVER);
      this.removePlayer(this.sockets[playerID]);
    });
  }

  // Acquire presssed key code and its keytype. Call functions to handle these
  // inputs accordingly. Arrowkey is to move the player and space to shot bullet.
  handleKeyInput(socket, keyEvent) {
    if (this.players[socket.id] && keyEvent) {
      const player = this.players[socket.id];
      const camera = this.cameras[player.username];
      const keyType = keyEvent[0];
      const key = keyEvent[1];
      if (keyType === "keydown") {
        if (key === "Space") {
          const newBullet = player.fire();
          if (newBullet) this.bullets.push(newBullet);
          this.cameras[player.username].follow(player);
        }
        if (key === "ArrowLeft" || key === "ArrowRight") player.move(key);
        if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(key)) camera.move(key);
        if (key === "KeyQ" || key == "KeyE") player.fireDirectionMove(key);
      }
      if (keyType === "keyup") {
        if (key === "ArrowLeft" || key === "ArrowRight") player.stop();
        if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(key)) camera.stop();
        if (key === "KeyQ" || key === "KeyE") player.fireDirectionStop(key);
      }
    }
  }

  /*handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setFireDirection(dir);
    }
  }*/
  /*
  handleCameraMove(socket, mouseXY) {
    if (this.players[socket.id]) {
      const player = this.players[socket.id];
      const camera = this.cameras[player.username];
      if (mouseXY[0] === 0 && mouseXY[1] === 0) camera.stop();
      else camera.move(mouseXY);
    }
  }
  */

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach((bullet) => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(
      (bullet) => !bulletsToRemove.includes(bullet)
    );

    // Update each player
    Object.keys(this.sockets).forEach((playerID) => {
      const player = this.players[playerID];
      if (player) player.update(dt);
    });

    //
    Object.keys(this.cameras).forEach((username) => {
      const camera = this.cameras[username];
      camera.update(dt);
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(
      Object.values(this.players),
      this.bullets
    );
    destroyedBullets.forEach((b) => {
      if (this.players[b._parent.id]) {
        this.players[b._parent.id].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(
      (bullet) => !destroyedBullets.includes(bullet)
    );

    // Check if any game ended in the playrooms
    Object.keys(this.playrooms).forEach((roomname) => {
      const playerIDs = this.playrooms[roomname];
      const hps = playerIDs.map((playerID) => this.players[playerID].hp);
      if (hps[0] <= 0 || hps[1] <= 0) {
        this.removeRoom(roomname, playerIDs);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();

      // Update for players in waitroom
      Object.keys(this.waitrooms).forEach((roomname) => {
        const playerIDs = this.waitrooms[roomname];
        playerIDs.forEach((playerID) => {
          const socket = this.sockets[playerID];
          const player = this.players[playerID];
          socket.emit(
            Constants.MSG_TYPES.GAME_UPDATE,
            this.createRoomUpdate(roomname, playerIDs, leaderboard)
          );
        });
      });

      // Update for players in playroom
      Object.keys(this.playrooms).forEach((roomname) => {
        const playerIDs = this.playrooms[roomname];
        playerIDs.forEach((playerID) => {
          const socket = this.sockets[playerID];
          const player = this.players[playerID];
          socket.emit(
            Constants.MSG_TYPES.GAME_UPDATE,
            this.createRoomUpdate(roomname, playerIDs, leaderboard)
          );
        });
      });

      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map((p) => ({ username: p.username, score: Math.round(p.score) }));
  }

  // Only create update object within the room
  createRoomUpdate(roomname, playerIDs, leaderboard) {
    const camera = this.cameras[roomname];
    const playerInRoom = playerIDs.map((playerID) => this.players[playerID]);

    const bulletInRoom = this.bullets.filter(
      (b) =>
        b.distanceTo(camera) <= Constants.MAP_SIZE_LENGTH / 2 &&
        playerIDs.includes(b._parent.id)
    );

    return {
      t: Date.now(),
      me: camera.serializeForUpdate(),
      others: playerInRoom.map((p) => p.serializeForUpdate()),
      bullets: bulletInRoom.map((b) => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
