const Constants = require("../shared/constants");
const Player = require("./player");
const Camera = require("./camera");
const applyCollisions = require("./collisions");
const { join } = require("lodash");

class Game {
  constructor() {
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

    // Ridection or alert for this is still needed.
    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.3 + Math.random() * 0.2);
    const y = Constants.MAP_SIZE * (0.3 + Math.random() * 0.2);

    // Adding player to rooms and store the name. The first player joined 
    // goes to waitrooms. The second player will be join and move the room
    // from waitrooms to playrooms. If a third player is coming, it will be blocked.
    if (username in this.playrooms) {
      console.log('The room is too crowd');
    }
    else if (username in this.waitrooms) {
      socket.join(username);
      this.playrooms[username] = (this.waitrooms[username]);
      this.playrooms[username].push(socket.id);
      delete this.waitrooms[username];
    }
    else {
      socket.join(username);
      this.waitrooms[username] = [];
      this.waitrooms[username].push(socket.id);
      this.cameras[username] = new Camera(socket.id, username, x, y);
    }
    console.log(this.playrooms);
    console.log(this.waitrooms);
    
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  // Simply remove player from game
  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  // Deal with disconnected player and its room
  removeDisconnectedPlayer(socket) {
    Object.keys(this.playrooms).forEach((roomname) => {
      const playerIDs = this.playrooms[roomname]
      if (playerIDs.includes(socket.id)){
        this.removeRoom(roomname, playerIDs);
      };
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
      console.log(key);
      if (keyType === "keydown"){
        if (key === "Space") {
          const newBullet = player.fire();
          if (newBullet) this.bullets.push(newBullet);
        }
        if (key === "ArrowLeft" || key === "ArrowRight") player.move(key);
        if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(key)) camera.move(key);
      }
      if (keyType === "keyup") {
        if (key === "ArrowLeft" || key === "ArrowRight") player.stop();
        if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(key)) camera.stop();
      }
    }
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

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
      player.update(dt);
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
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(
      (bullet) => !destroyedBullets.includes(bullet)
    );
    
    // Check if any game ended in the playrooms
    Object.keys(this.playrooms).forEach((roomname) => {
      const playerIDs = this.playrooms[roomname];
      const hps = playerIDs.map((playerID) => (this.players[playerID].hp));
      if (hps[0]<=0 || hps[1]<=0) {
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
          )
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
          )
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
  createRoomUpdate(roomname,playerIDs, leaderboard) {
    const camera = this.cameras[roomname];
    const playerInRoom = playerIDs.map(
      (playerID)=>(this.players[playerID])
    );
    
    const bulletInRoom = this.bullets.filter(
      (b) => (b.distanceTo(camera) <= Constants.MAP_SIZE / 2 && playerIDs.includes(b.parentID))
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
