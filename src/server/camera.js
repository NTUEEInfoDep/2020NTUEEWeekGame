const ObjectClass = require("./object");
const Constants = require("../shared/constants");
const { plugins } = require("../../webpack.config");

class Camera extends ObjectClass {
  constructor(id, username, x, y, windowSize) {
    super(id, x, y, Math.random() * 2 * Math.PI, 0);
    this.username = username;
    this.friction = 0;
    this.windowSize = windowSize;
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
    this.x = Math.max(this.windowSize[0]/2, Math.min(Constants.MAP_SIZE_LENGTH - this.windowSize[0]/2, this.x));
    this.y = Math.max(this.windowSize[1]/2, Math.min(Constants.MAP_SIZE_WIDTH - this.windowSize[1]/2, this.y));
    
    return null;
  }

  // Receive keyboard input and move camera
  move(key) {
    if (key === "KeyW") this.direction = 0;
    if (key === "KeyS") this.direction =  Math.PI;
    if (key === "KeyA") this.direction = -Math.PI/2;
    if (key === "KeyD") this.direction = Math.PI/2;
    this.friction = 0;
    this.speed = Constants.CAMERA_SPEED;
  }
  
  // Stop the camera's movement
  stop(){
    this.friction = Constants.CAMERA_FRICTION;
  }

  follow(player){
    this.x = player.x;
    this.y = player.y;
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
