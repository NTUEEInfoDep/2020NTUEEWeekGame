const ObjectClass = require("./object");
const Bullet = require("./bullet");
const Constants = require("../shared/constants");
const { plugins } = require("../../webpack.config");

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, 0);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
<<<<<<< HEAD
    //this.fireCooldown = 0;
    //this.score = 0;
=======
    this.fireCooldown = 0;
    this.friction = 0;
    this.score = 0;
>>>>>>> 92ebfe8aa74e293dec4925583f18453c5aa38d75
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
<<<<<<< HEAD
    //this.score += dt * Constants.SCORE_PER_SECOND;

=======
    this.score += dt * Constants.SCORE_PER_SECOND;
    
    // Apply player friction
    if (this.speed > 0 && this.friction !==0) this.speed -= this.friction * dt;
    if (this.speed <= 0) {
      this.speed = 0;
      this.friction = 0;
    }
>>>>>>> 92ebfe8aa74e293dec4925583f18453c5aa38d75
    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

<<<<<<< HEAD
    // Fire a bullet, if needed
    /*this.fireCooldown -= dt;
=======
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 ){
      this.fireCooldown = 0;     
    }
    
    return null;
  }

  // Receive keyboard input and move character
  move(e) {
    if (e[1] === "ArrowLeft") {
      this.direction = -Math.PI/2;
    }
    if (e[1] === "ArrowRight") {
      this.direction = Math.PI/2;
    }
    this.speed = Constants.PLAYER_SPEED;
  }
  
  // Stop the player's movement
  stop(e){
    this.friction = Constants.PLAYER_FRICTION;
  }

  // Fire a bullet with cooldown limit
  fire(){
>>>>>>> 92ebfe8aa74e293dec4925583f18453c5aa38d75
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction, this.username);
    }
<<<<<<< HEAD

    return null;
  }*/
=======
  }
>>>>>>> 92ebfe8aa74e293dec4925583f18453c5aa38d75

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  /*onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }*/

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
