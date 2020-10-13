const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');

class Banana extends Player {
    // Soft body and strong mind
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 4;
		this.bulletDamage = Constants.BULLET_DAMAGE;
	};
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

module.exports = Banana;
