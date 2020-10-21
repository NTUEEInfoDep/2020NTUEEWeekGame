const Player = require("./player");
const Constants = require("../shared/constants");
const Bullet = require("./bullet");

class Pudding extends Player {
  // Absolutely no chemical substance or toxic ingredient added...
  constructor(id, username, x, y, map) {
    super(id, username, x, y, map);
    this.role = 3;
    // life
    this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.Pudding;
    // force
    this.bulletDamage = 0.8 * Constants.BULLET_DAMAGE;
    //speed
    this.playerSpeed = 1 * Constants.PLAYER_SPEED;
    //firespeed
    this.fireCooldowntime = 0.7 * Constants.PLAYER_FIRE_COOLDOWN;
    //power
    this.bulletSpeed = 1.3 * Constants.BULLET_SPEED;
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
        1,
        this.map
      );
    }
    return null;
  }

  skill(power) {
    if(this.skillCooldown <= 0){
      this.skillCooldown = this.skillCooldowntime;
      return new Bullet(
        this,
        this.x,
        this.y,
        this.fireDirection,
        this.username,
        this.role,
        this.bulletSpeed*power,
        3,
        this.map
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
  
  setmap(map){
    this.map = map;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      role: this.role,
    };
  }
}

module.exports = Pudding;
