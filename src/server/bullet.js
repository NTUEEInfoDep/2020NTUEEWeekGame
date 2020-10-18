/* eslint-disable no-underscore-dangle */
const shortid = require("shortid");
const ObjectClass = require("./object");
const Constants = require("../shared/constants");

class Bullet extends ObjectClass {
  constructor(_parent, x, y, dir, username, role, speed, mode) {
    super(shortid(), x, y, dir, speed);
    this._parent = _parent;
    this.username = username;
    this.role = role;
    this.mode = mode;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);

    // Apply Gravity to speed and direction. May apply wind or other special effects
    const newSpeed =
      ((this.speed * Math.sin(this.direction)) ** 2 +
        (this.speed * Math.cos(this.direction) -
          Constants.BULLET_GRAVITY * dt) **
          2) **
      0.5;
    const newDirection = Math.atan2(
      this.speed * Math.sin(this.direction),
      this.speed * Math.cos(this.direction) - Constants.BULLET_SPEED * dt
    );
    this.speed = newSpeed;
    this.direction = newDirection;

    return (
      this.x < 0 ||
      this.x > Constants.MAP_SIZE_LENGTH ||
      this.y < 0 ||
      this.y >
        (Constants.MAP[Math.floor(this.x / 10)] * (10 - (this.x % 10)) +
          Constants.MAP[Math.floor(this.x / 10 + 1)] * (this.x % 10)) /
          10
    );
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      role:this.role,
      mode: this.mode
    };
  }
}

module.exports = Bullet;
