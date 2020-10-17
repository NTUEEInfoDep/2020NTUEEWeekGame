const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');
const Object = require('./object');
const shortid = require('shortid');


// Banana peels
class BigSkill extends Object {
    constructor(_parent, x, y, dir, speed, username, role) {
        // Fixed
        super(shortid(), x, y, dir, speed);
		this._parent = _parent;
		this.x = x,
		this.y = y;
		this.direction = dir;
		this.speed = speed;
        this.username = username;
        this.role = role;
	}
	
	update (dt){
		super.update(dt);
		const newSpeed =
		((this.speed * Math.sin(this.direction)) ** 2 +
			(this.speed * Math.cos(this.direction) -
			Constants.BULLET_GRAVITY * dt) **
			2) **
		0.5;
		const newDirection = Math.atan2(
		this.speed * Math.sin(this.direction),
		this.speed * Math.cos(this.direction) - Constants.BULLET_SPEED * dt
		);
		this.speed = newSpeed;
		this.direction = newDirection;

		return (
		this.x < 0 ||
		this.x > Constants.MAP_SIZE_LENGTH ||
		this.y < 0 ||
		this.y >
			(Constants.MAP[Math.floor(this.x / 10)] * (10 - (this.x % 10)) +
			Constants.MAP[Math.floor(this.x / 10 + 1)] * (this.x % 10)) /
			10
		);
	}

	serializeForUpdate() {
		return {
		  ...super.serializeForUpdate(),
		  role:this.role,
		};
	  }
}


class Banana extends Player {
	// Soft body and strong mind
	// Big skill: throw banana peel
    constructor(id, username, x, y){
		super(id, username, x, y);
		this.role = 4;
		this.bulletDamage = Constants.BULLET_DAMAGE;
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
		  this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
		  return 

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
		return null
	}

	serializeForUpdate(){
		return {
			...super.serializeForUpdate(),
			role: this.role,
		};
	}
}

module.exports = Banana;
