const Player = require("./player");
const Constants = require("../shared/constants");
const Bullet = require("./bullet");

class Cat extends Player {
  // A multi-life and timid cat...
  constructor(id, username, x, y, map) {
    super(id, username, x, y, map);
    this.role = 1;
    // life
    this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.Cat;
    // force
    this.bulletDamage = 0.6 * Constants.BULLET_DAMAGE;
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
        this.bulletSpeed*power,
        1,
        this.map
      );
    }
    return null;
  }

  skill(power) {
    if (this.skillCooldown <= 0) {
      this.skillCooldown = this.skillCooldowntime;
      return [
        new Bullet(this, this.x, this.y, this.fireDirection - Math.PI / 15, this.username, this.role, this.bulletSpeed*power, 0, this.map),
        new Bullet(this, this.x, this.y, this.fireDirection - Math.PI / 30, this.username, this.role, this.bulletSpeed*power, 0, this.map),
        new Bullet(this, this.x, this.y, this.fireDirection, this.username, this.role, this.bulletSpeed*power, 0, this.map),
        new Bullet(this, this.x, this.y, this.fireDirection + Math.PI / 30, this.username, this.role, this.bulletSpeed*power, 0, this.map),
        new Bullet(this, this.x, this.y, this.fireDirection + Math.PI / 15, this.username, this.role, this.bulletSpeed*power, 0, this.map)
      ]
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

module.exports = Cat;
