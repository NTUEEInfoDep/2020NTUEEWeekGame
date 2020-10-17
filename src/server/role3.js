const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');
//const Object = require('object');
const shortid = require('shortid');


// Snow
// Return a promise
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


class Pudding extends Player {
	// Absolutely no chemical substance or toxic ingredient added...
	// Big skill: snow
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 3;
		this.bulletDamage = Constants.BULLET_DAMAGE;
	
		this.bigSkill = new BigSkill(this, this.username, this.role);
		this.bigSkillName = "snow";
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

module.exports = Pudding;
