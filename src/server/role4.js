const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');
const Object = require('./object');
const shortid = require('shortid');


// Banana peels
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


class Banana extends Player {
	// Soft body and strong mind
	// Big skill: throw banana peel
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 4;
		// life
		this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.Banana;
		// force
		this.bulletDamage = 1 * Constants.BULLET_DAMAGE;
		//speed
		this.playerSpeed = 1 * Constants.PLAYER_SPEED;
		//firespeed
		this.fireCooldowntime = 1 * Constants.PLAYER_FIRE_COOLDOWN;
		//power
		this.bulletSpeed = 1 * Constants.BULLET_SPEED;

		this.peelArray = [];
		this.bigSkill = new BigSkill(
			this,
			this.x,
			this.y,
			this.fireDirection,
			this.username,
			this.role
		)
		this.bigSkillName = "banana peel";
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

	  // Need revision
	emitBigSkill (){
		if (this.bigSkillTimes > 0){
			this.bigSkillTimes--;
			return {
				mode: this.bigSkillName,
				parentId: this.id,
				weapon: null
			}
		}
		return {}
	}

	serializeForUpdate(){
		return {
			...super.serializeForUpdate(),
			role: this.role,
		};
	}
}

module.exports = Banana;
