const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');

class Pudding extends Player {
    // Absolutely no chemical substance or toxic ingredient added...
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 3;
		// life
		this.hp = Constants.PLAYER_MAX_HP * 0.8;
		// force
		this.bulletDamage = 0.7 * Constants.BULLET_DAMAGE;
		//speed
		this.playerSpeed= 1.3 * Constants.PLAYER_SPEED;
		//firespeed
		this.fireCooldowntime= 0.7 * Constants.PLAYER_FIRE_COOLDOWN;
		//power
		this.bulletSpeed=1* Constants.bulletSpeed;
	}
	fire() {
		if (this.fireCooldown <= 0) {
		  this.fireCooldown = this.fireCooldowntime;
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

module.exports = Pudding;
