const ObjectClass = require("./object");
const Bullet = require("./bullet");
const Constants = require("../shared/constants");
// const { plugins } = require("../../webpack.config");

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    // faces toward left or right, currently right
    super(id, x, y, 0, 0);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireDirection = 0;
    this.fireCooldown = 0;
    this.friction = 0;
    this.score = 0;
    this.angleSpeed = 0;
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
      (Constants.MAP[Math.floor(this.x / 10)] * (10 - (this.x % 10)) +
        Constants.MAP[Math.floor(this.x / 10 + 1)] * (this.x % 10)) /
      10;

    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown = 0;
    }
    this.fireDirection += this.angleSpeed * dt;
    this.fireDirection = Math.max(
      Math.max(-Math.PI / 2, this.fireDirection + this.angleSpeed * dt),
      Math.min(Math.PI / 2, this.fireDirection + this.angleSpeed * dt)
    );
    return null;
  }

  // Receive keyboard input and move character
  move(e) {
    if (e === "ArrowLeft") {
      if (
        Constants.MAP[Math.floor(this.x / 10)] <
        Constants.MAP[Math.floor(this.x / 10 + 1)]
      )
        this.direction = Math.atan(
          (Constants.MAP[Math.floor(this.x / 10)] -
            Constants.MAP[Math.floor(this.x / 10 + 1)]) /
            10
        );
      else
        this.direction =
          Math.atan(
            (Constants.MAP[Math.floor(this.x / 10) + 1] -
              Constants.MAP[Math.floor(this.x / 10)]) /
              10
          ) -
          Math.PI / 2;
    }
    if (e === "ArrowRight") {
      this.direction =
        Math.atan(
          (Constants.MAP[Math.floor(this.x / 10 + 1)] -
            Constants.MAP[Math.floor(this.x / 10)]) /
            10
        ) +
        Math.PI / 2;
    }
    this.friction = 0;
    this.speed = Constants.PLAYER_SPEED;
  }

  // Stop the player's movement
  stop(e) {
    this.friction = Constants.PLAYER_FRICTION;
  }

  fireDirectionMove(e) {
    if (e === "KeyQ") {
      if (this.fireDirection <= -Math.PI / 2) {
        this.fireDirection = -Math.PI / 2;
        this.angleSpeed = 0;
      } else this.angleSpeed = -Constants.PLAYER_ANGLE_SPEED;
    } else if (e === "KeyE") {
      if (this.fireDirection >= Math.PI / 2) {
        this.fireDirection = Math.PI / 2;
        this.angleSpeed = 0;
      } else this.angleSpeed = Constants.PLAYER_ANGLE_SPEED;
    }
  }

  fireDirectionStop(e) {
    this.angleSpeed = 0;
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
