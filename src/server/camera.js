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
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE_LENGTH, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE_WIDTH, this.y));
    
    return null;
  }

  // Receive keyboard input and move camera
  move(mouseXY) {
    if (mouseXY[1] === -1) this.direction = 0;
    if (mouseXY[1] === 1) this.direction =  Math.PI;
    if (mouseXY[0] === -1) this.direction = -Math.PI/2;
    if (mouseXY[0] === 1) this.direction = Math.PI/2;
    this.speed = Constants.CAMERA_SPEED;
  }
  
  // Stop the camera's movement
  stop(){
    this.friction = Constants.CAMERA_FRICTION;
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
