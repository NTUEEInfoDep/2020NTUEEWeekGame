const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');
//const Object = require('./object');
const shortid = require('shortid');


// Fart
// Return new promise, skill will last for 7 seconds
class BigSkill {
    constructor(_parent, username, role) {
        // Fixed
        this._parent = _parent;
        this.username = username;
        this.role = role;
	}
	
	Timer() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('Finish');
			}, 7000)
		})
	}
}


class PinkAss extends Player {
	// Firm body and nice shape...
	// Big skill: fart nightmare
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 2;
		// life
		this.hp = Constants.PLAYER_MAX_HP * 2;
		// force
		this.bulletDamage = 0.5 * Constants.BULLET_DAMAGE; 
		this.bigSkillName = "fart";
		this.bigSkill = new BigSkill();
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

	  // Need revision
	emitBigSkill (){
		if (this.bigSkillTimes > 0){
			this.bigSkillTimes--;
			return {
				mode: this.bigSkillName,
				parentId: this.id,
				weapon: null,
				timer: this.bigSkill.Timer
			}
		}
		return null
	}

	serializeForUpdate(){
		return {
			...super.serializeForUpdate(),
			role: this.role,
		};
	}
}

module.exports = PinkAss;
