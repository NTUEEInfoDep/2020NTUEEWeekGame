const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');

class Cat extends Player {
    // A multi-life and timid cat...
    constructor(id, username, x, y){
        super(id, username, x, y);
		this.role = 1;
		// life
		this.hp = Constants.PLAYER_MAX_HP * 9;
		// force
		this.bulletDamage = 0.1 * Constants.BULLET_DAMAGE;
    }
    stop(e) {
	this.friction = Constants.PLAYER_FRICTION / 2;
	}
	fire() {
		if (this.fireCooldown <= 0) {
		  this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
		  return new Bullet(
			this,
			this.x,
			this.y,
			this.fireDirection,
			this.username,
			this.role
		  );
		}
		return null;
	  }
	serializeForUpdate(){
		return {
			...super.serializeForUpdate(),
			role: this.role,
		};
	}
}

module.exports = Cat;
