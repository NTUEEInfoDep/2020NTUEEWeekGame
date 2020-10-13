const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');

class PinkAss extends Player {
    // Firm body and nice shape...
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 2;
		// life
		this.hp = Constants.PLAYER_MAX_HP * 2;
		// force
		this.bulletDamage = 0.5 * Constants.BULLET_DAMAGE; 
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

module.exports = PinkAss;
