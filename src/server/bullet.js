const shortid = require("shortid");
const ObjectClass = require("./object");
const Constants = require("../shared/constants");

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir, username) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.username = username;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);

    // Apply Gravity to speed and direction. May apply wind or other special effects
    const newSpeed = Math.pow(
      Math.pow(this.speed * Math.sin(this.direction), 2) +
        Math.pow(
          this.speed * Math.cos(this.direction) - Constants.BULLET_GRAVITY * dt,
          2
        ),
      0.5
    );
    const newDirection = Math.atan2(
      this.speed * Math.sin(this.direction),
      this.speed * Math.cos(this.direction) - Constants.BULLET_SPEED * dt
    );
    this.speed = newSpeed;
    this.direction = newDirection;

    return (
      this.x < 0 ||
      this.x > Constants.MAP_SIZE ||
      this.y < 0 ||
      this.y > Constants.MAP_SIZE
    );
  }
}

module.exports = Bullet;
