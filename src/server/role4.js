const Player = require("./player");
const Constants = require("../shared/constants");
const Bullet = require("./bullet");

class Banana extends Player {
  // Soft body and strong mind
  constructor(id, username, x, y) {
    super(id, username, x, y);
    this.role = 4;
    // life
    this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.Banana;
    // force
    this.bulletDamage = 1 * Constants.BULLET_DAMAGE;
    //speed
    this.playerSpeed = 1 * Constants.PLAYER_SPEED;
    //firespeed
    this.fireCooldowntime = 1 * Constants.PLAYER_FIRE_COOLDOWN;
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
        this.bulletSpeed*power,
        1
      );
    }
    return null;
  }
  
  skill() {
    if(this.skillCooldown <= 0){
      this.skillCooldown = this.skillCooldowntime;
      return new Bullet(
        this,
        this.x,
        this.y,
        this.fireDirection,
        this.username,
        this.role,
        this.bulletSpeed,
        4
      );
    }
  }

  changemode(mode){
    if(mode === 1)
      this.mode = mode;
    else{
      this.mode = mode;
      this.abnormalmodeCooldown = this.abnormalmodeCooldowntime;
    }
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      role: this.role,
    };
  }
}

module.exports = Banana;
