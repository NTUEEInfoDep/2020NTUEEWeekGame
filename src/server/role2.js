const Player = require("./player");
const Constants = require("../shared/constants");
const Bullet = require("./bullet");

class PinkAss extends Player {
  // Firm body and nice shape...
  constructor(id, username, x, y) {
    super(id, username, x, y);
    this.role = 2;
    // life
    this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.PinkAss;
    // force
    this.bulletDamage = 1.3 * Constants.BULLET_DAMAGE;
    //speed
    this.playerSpeed = 0.8 * Constants.PLAYER_SPEED;
    //firespeed
    this.fireCooldowntime = 1.3 * Constants.PLAYER_FIRE_COOLDOWN;
    //power
    this.bulletSpeed = 1 * Constants.BULLET_SPEED;
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

module.exports = PinkAss;
