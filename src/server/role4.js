const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');

class Banana extends Player {
    // Soft body and strong mind
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 4;
		// life
		this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP.Banana;
		// force
		this.bulletDamage =1 * Constants.BULLET_DAMAGE;
		//speed
		this.playerSpeed= 1 * Constants.PLAYER_SPEED;
		//firespeed
		this.fireCooldowntime=1 * Constants.PLAYER_FIRE_COOLDOWN;
		//power
		this.bulletSpeed=1 * Constants.BULLET_SPEED;
	};
	fire() {
		if (this.fireCooldown <= 0) {
		  this.fireCooldown = this.fireCooldowntime;
		  return new Bullet(
			this,
			this.x,
			this.y,
			this.fireDirection,
			this.username,
			this.role,
			this.bulletSpeed
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
