const Player = require("./player");
const Constants = require("../shared/constants");
const Bullet = require("./bullet");

class Cat extends Player {
  // A multi-life and timid cat...
  constructor(id, username, x, y) {
    super(id, username, x, y);
    this.role = 1;
    // life
    this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.Cat;
    // force
    this.bulletDamage = 0.7 * Constants.BULLET_DAMAGE;
    //speed
    this.playerSpeed = 1.2 * Constants.PLAYER_SPEED;
    //firespeed
    this.fireCooldowntime = 1 * Constants.PLAYER_FIRE_COOLDOWN;
    //power
    this.bulletSpeed = 0.9 * Constants.BULLET_SPEED;
  }
  stop(e) {
    this.friction = Constants.PLAYER_FRICTION / 2;
  }
  fire(power) {
    if (this.fireCooldown <= 0) {
      this.fireCooldown = this.fireCooldowntime;
      return new Bullet(
        this,
        this.x,
        this.y,
        this.fireDirection,
        this.username,
        this.role,
        this.bulletSpeed*power
      );
    }
    return null;
  }
  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      role: this.role,
    };
  }
}

module.exports = Cat;
