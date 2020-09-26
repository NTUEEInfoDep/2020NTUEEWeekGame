const ObjectClass = require("./object");
const Bullet = require("./bullet");
const Constants = require("../shared/constants");
const { plugins } = require("../../webpack.config");

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
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown = 0;
    }

    return null;
  }

  // Receive keyboard input and move character
  move(e) {
    if (e[1] === "ArrowLeft") {
      this.direction = -Math.PI / 2;
    }
    if (e[1] === "ArrowRight") {
      this.direction = Math.PI / 2;
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
        this.id,
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
    this.fireDirection = dir;
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
