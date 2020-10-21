const ObjectClass = require("./object");
const Bullet = require("./bullet");
const Constants = require("../shared/constants");
// const { plugins } = require("../../webpack.config");

class Player extends ObjectClass {
  constructor(id, username, x, y, map) {
    // faces toward left or right, currently right
    super(id, x, y, 0, 0);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireDirection = 0;
    this.fireCooldown = 0;
    this.fireCooldowntime=0;
    this.friction = 0;
    this.score = 0;
    this.angleSpeed = 0;
    this.playerSpeed = 0;
    this.skillCooldown = 0;
    this.skillCooldowntime = Constants.PLAYER_SKILL_COOLDOWN;
    this.mode = 1;
    this.abnormalmodeCooldown = 0;
    this.abnormalmodeCooldowntime = Constants.PLAYER_MODE_COOLDOWN;
    this.map = map;
  }

  // Returns a newly created bullet, or null.
  update(dt) {  
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Apply player friction
    if (this.speed > 0 && this.friction !== 0) this.speed -= this.friction * dt;
    if (this.speed <= 0) {
      this.speed = 0;
      this.friction = 0;
    }
    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE_LENGTH, this.x));
    this.y =
      (Constants.MAP[this.map][Math.floor(this.x / 10)] * (10 - (this.x % 10)) +
        Constants.MAP[this.map][Math.floor(this.x / 10 + 1)] * (this.x % 10)) /
      10;

    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown = 0;
    }
    
    this.skillCooldown -= dt;
    if (this.skillCooldown <= 0){
      this.skillCooldown = 0;
    }

    this.abnormalmodeCooldown -= dt;
    if (this.abnormalmodeCooldown <= 0){
      this.abnormalmodeCooldown = 0;
      this.changemode(Constants.PLAYER_MODE.NORMAL);
    }

    this.fireDirection += this.angleSpeed * dt;
    if (this.direction >= 0){
      this.fireDirection = Math.max(
        0,
        Math.min(Math.PI / 2, this.fireDirection)
      );
    } else{
      this.fireDirection = Math.max(
        -Math.PI / 2,
        Math.min(0, this.fireDirection)
      );
    }
    return null;
  }

  // Receive keyboard input and move character
  move(e) {
    let shouldFollow = false;
    if(this.mode === 1 || this.mode === 4){
      if (e === "ArrowLeft") {
        if (this.fireDirection > 0){
          this.fireDirection = -this.fireDirection;
        }
        if (
          Constants.MAP[this.map][Math.floor(this.x / 10)] <
          Constants.MAP[this.map][Math.floor(this.x / 10 + 1)]
        )
          this.direction = Math.atan(
            (Constants.MAP[this.map][Math.floor(this.x / 10)] -
              Constants.MAP[this.map][Math.floor(this.x / 10 + 1)]) /
              10
          );
        else
          this.direction =
            Math.atan(
              (Constants.MAP[this.map][Math.floor(this.x / 10) + 1] -
                Constants.MAP[this.map][Math.floor(this.x / 10)]) /
                10
            ) -
            Math.PI / 2;
        if (this.x===0)
          this.x=Constants.MAP_SIZE_LENGTH;
          shouldFollow = true;
      }
      if (e === "ArrowRight") {
        if (this.fireDirection < 0){
          this.fireDirection = -this.fireDirection;
        }
        this.direction =
          Math.atan(
            (Constants.MAP[this.map][Math.floor(this.x / 10 + 1)] -
              Constants.MAP[this.map][Math.floor(this.x / 10)]) /
              10
          ) +
          Math.PI / 2;
        if (this.x===Constants.MAP_SIZE_LENGTH)
          this.x=0;
          shouldFollow = true;
      }
      this.friction = 0;
      this.speed = this.playerSpeed;
    }
    else if (this.mode === 2) {
      if (e === "ArrowRight") {
        if (this.fireDirection > 0){
          this.fireDirection = -this.fireDirection;
        }
        if (
          Constants.MAP[this.map][Math.floor(this.x / 10)] <
          Constants.MAP[this.map][Math.floor(this.x / 10 + 1)]
        )
          this.direction = Math.atan(
            (Constants.MAP[this.map][Math.floor(this.x / 10)] -
              Constants.MAP[this.map][Math.floor(this.x / 10 + 1)]) /
              10
          );
        else
          this.direction =
            Math.atan(
              (Constants.MAP[this.map][Math.floor(this.x / 10) + 1] -
                Constants.MAP[this.map][Math.floor(this.x / 10)]) /
                10
            ) -
            Math.PI / 2;
        if (this.x===Constants.MAP_SIZE_LENGTH)
          this.x=0;
          shouldFollow = true;
      }
      if (e === "ArrowLeft") {
        if (this.fireDirection < 0){
          this.fireDirection = -this.fireDirection;
        }
        this.direction =
          Math.atan(
            (Constants.MAP[this.map][Math.floor(this.x / 10 + 1)] -
              Constants.MAP[this.map][Math.floor(this.x / 10)]) /
              10
          ) +
          Math.PI / 2;
        if (this.x===0)
          this.x=Constants.MAP_SIZE_LENGTH;
          shouldFollow = true;
      }
      this.friction = Constants.PLAYER_FRICTION;
      this.speed = this.playerSpeed;
    }
    else if (this.mode === 3) {
      this.friction = Constants.PLAYER_FRICTION;
      this.speed = 0;
    }
    return shouldFollow;
  }

  // Stop the player's movement
  stop(e) {
    if(this.mode !== 4) {
      if ((e === "ArrowRight" && this.direction >0)|| (e === "ArrowLeft" && this.direction<0)){
        this.friction = Constants.PLAYER_FRICTION;
      }
    }
    else {
      this.friction = Constants.PLAYER_FRICTION / 400;
    }
    
  }

  fireDirectionMove(e) {
    if(this.mode !== 2){
      if (e === "ArrowUp") {
        if (this.direction >= 0) this.angleSpeed = -Constants.PLAYER_ANGLE_SPEED;
        else this.angleSpeed = Constants.PLAYER_ANGLE_SPEED;
    } else if (e === "ArrowDown") {
        if (this.direction >= 0) this.angleSpeed = Constants.PLAYER_ANGLE_SPEED;
        else this.angleSpeed = -Constants.PLAYER_ANGLE_SPEED;
    }
  }
    else{
      if (e === "ArrowDown") {
        if (this.direction >= 0) this.angleSpeed = -Constants.PLAYER_ANGLE_SPEED;
        else this.angleSpeed = Constants.PLAYER_ANGLE_SPEED;
  }   else if (e === "ArrowUp") {
        if (this.direction >= 0) this.angleSpeed = Constants.PLAYER_ANGLE_SPEED;
        else this.angleSpeed = -Constants.PLAYER_ANGLE_SPEED;
  }
}
}

  fireDirectionStop(e) {
    this.angleSpeed = 0;
  }

  // Fire a bullet with cooldown limit
  fire() {
    if (this.fireCooldown <= 0) {
      this.fireCooldown = this.fireCooldowntime;
      return new Bullet(
        this,
        this.x,
        this.y,
        this.fireDirection,
        this.username,
        1,
        this.map
      );
    }
    return null;
  }

  takeBulletDamage(role) {
    this.hp -= role.bulletDamage;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      direction: this.direction,
      fireDirection: this.fireDirection,
      hp: this.hp,
      mode: this.mode,
      skill: this.skillCooldown,
    };
  }
}

module.exports = Player;
