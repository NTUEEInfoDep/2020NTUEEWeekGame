const ObjectClass = require("./object");
const Constants = require("../shared/constants");
const { plugins } = require("../../webpack.config");

class Camera extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, 0);
    this.username = username;
    this.friction = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);
    // Apply player friction
    if (this.speed > 0 && this.friction !==0) this.speed -= this.friction * dt;
    if (this.speed <= 0) {
      this.speed = 0;
      this.friction = 0;
    }
    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
    //console.log("x:" + this.x + " y:" + this.y);
    return null;
  }

  // Receive keyboard input and move camera
  move(e) {
    if (e === "KeyW") this.direction = 0;
    if (e === "KeyS") this.direction =  Math.PI;
    if (e === "KeyA") this.direction = -Math.PI/2;
    if (e === "KeyD") this.direction = Math.PI/2;
    this.speed = Constants.PLAYER_SPEED;
  }
  
  // Stop the camera's movement
  stop(){
    this.friction = Constants.PLAYER_FRICTION;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Camera;
