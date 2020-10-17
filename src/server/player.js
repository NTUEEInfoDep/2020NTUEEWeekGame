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
<<<<<<< Updated upstream
=======
    this.angleSpeed = 0;
    this.bigSkillTimes = 2;
    this.mode = 'normal';
    // Container for suffered skills' timers
    /*
    Format: {
      mode: string,
      timer: Promise
    }
    */
    this.sufferFrom = [];
>>>>>>> Stashed changes
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

  // According to mode(big skill emitted)
  // Receive keyboard input and move character
<<<<<<< Updated upstream
  move(e) {
    if (e[1] === "ArrowLeft") {
      this.direction = -Math.PI / 2;
    }
    if (e[1] === "ArrowRight") {
      this.direction = Math.PI / 2;
    }
    this.speed = Constants.PLAYER_SPEED;
  }
=======
	move(e) {
		if (this.mode === 'fart'){
			// Reverse direction
			if (e === "ArrowLeft"){
				e = "ArrowRight";
			} 
			
			if (e === "ArrowRight"){
				e = "ArrowLeft";
			}
		} else if (this.mode === 'snow'){
		  return;
    }

		// Move
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

>>>>>>> Stashed changes

  // Stop the player's movement
  stop(e) {
    this.friction = Constants.PLAYER_FRICTION;
  }

<<<<<<< Updated upstream
=======
  // According to mode(big skill emitted)
  fireDirectionMove(e) {
    // Reverse direction
		if (this.mode === 'fart'){
			if (e === "KeyQ"){
				e = "KeyE";
			} else if (e === "KeyE"){
				e = "KeyQ";
			}
		} else if (this.mode === 'snow'){
      return
    }

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

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  setFireDirection(dir) {
    if (dir < Constants.FIRE_RANGE_MIN) {
      this.fireDirection = Constants.FIRE_RANGE_MIN;
    } else if (dir > Constants.FIRE_RANGE_MAX) {
      this.fireDirection = Constants.FIRE_RANGE_MAX;
    } else {
      this.fireDirection = dir;
    }
=======

  // Reveive other big skill
  takeBigSkill(role) {
    this.mode = role.bigSkillName;
  }

  // Back to normal
  restoreToNormal() {
    this.mode = "mode";
>>>>>>> Stashed changes
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
