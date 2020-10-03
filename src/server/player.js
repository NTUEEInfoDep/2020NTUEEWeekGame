const ObjectClass = require("./object");
const Bullet = require("./bullet");
const Constants = require("../shared/constants");
// const { plugins } = require("../../webpack.config");

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    // faces toward left or right, currently right
    super(id, x, y, 0, 0);
    this.startx = this.x;
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireDirection = 0;
    this.fireCooldown = 0;
    this.friction = 0;
    this.score = 0;
    this.movearea = Constants.PLAYER_MOVE_AREA;
    //this.side = side;
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
    /*if(this.side)
      this.x = Math.max(Math.max(0, this.startx - this.movearea),
                        Math.min(Constants.MAP_SIZE_LENGTH / 2, this.x, this.startx + this.movearea));
    else*/ 
      this.x = Math.max(Math.max(0, this.startx - this.movearea),
                        Math.min(Constants.MAP_SIZE_LENGTH, this.x, this.startx + this.movearea));
    this.y = (Constants.MAP[Math.floor(this.x / 10)] * (10 - this.x % 10) +
              Constants.MAP[Math.floor(this.x / 10 + 1)] * (this.x % 10)) / 10;

    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown = 0;
    }

    return null;
  }

  setstartx(val){
    this.startx = val;
  }

  // Receive keyboard input and move character
  move(e) {
    if (e[1] === "ArrowLeft") {
      if(Constants.MAP[Math.floor(this.x / 10)] < Constants.MAP[Math.floor(this.x / 10 + 1)])
        this.direction = Math.atan((Constants.MAP[Math.floor(this.x / 10)] - Constants.MAP[Math.floor(this.x / 10 + 1)]) / 10);
      else
        this.direction = Math.atan((Constants.MAP[Math.floor(this.x / 10) + 1] - Constants.MAP[Math.floor(this.x / 10)]) / 10) - Math.PI / 2;
    }
    if (e[1] === "ArrowRight") {
      this.direction = Math.atan((Constants.MAP[Math.floor(this.x / 10 + 1)] - Constants.MAP[Math.floor(this.x / 10)]) / 10) + Math.PI / 2;
    }
    this.speed = Constants.PLAYER_SPEED;
  }

  // Stop the player's movement
  stop(e) {
    this.friction = Constants.PLAYER_FRICTION;
  }

  // Fire a bullet with cooldown limit
  fire() {
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(
        this,
        this.x,
        this.y,
        this.fireDirection,
        this.username
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

  setFireDirection(dir) {
    if (dir < Constants.FIRE_RANGE_MIN) {
      this.fireDirection = Constants.FIRE_RANGE_MIN;
    } else if (dir > Constants.FIRE_RANGE_MAX) {
      this.fireDirection = Constants.FIRE_RANGE_MAX;
    } else {
      this.fireDirection = dir;
    }
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      direction: this.direction,
      fireDirection: this.fireDirection,
      hp: this.hp,
    };
  }
}

module.exports = Player;
