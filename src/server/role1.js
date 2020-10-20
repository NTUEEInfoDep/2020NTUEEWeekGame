const Player = require('./player');
const Constants = require('../shared/constants');
const Bullet = require('./bullet');
const Object = require('./object');
const shortid = require('shortid');


// Throw cans
class BigSkill extends Object {
    constructor(_parent, x, y, dir, speed, username, role) {
        // Fixed
        super(shortid(), x, y, dir, speed);
		this._parent = _parent;
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

class Cat extends Player {
	// A multi-life and timid cat...
	// Big skill: cans attack
    constructor(id, username, x, y){
        super(id, username, x, y);
		this.role = 1;
		// life
		this.hp = Constants.PLAYER_MAX_HP * Constants.PLAYER_HP_COEF.Cat;
		// force
		this.bulletDamage = 0.8 * Constants.BULLET_DAMAGE;
		//speed
		this.playerSpeed = 1.2 * Constants.PLAYER_SPEED;
		//firespeed
		this.fireCooldowntime = 1 * Constants.PLAYER_FIRE_COOLDOWN;
		//power
		this.bulletSpeed = 1 * Constants.BULLET_SPEED;
		// !!!!!!!!!!!!!!!!!!!! Need revision
		this.canSpeed = 700;
		// Five cans
		this.canArray = [];
		this.bigSkillName = "throw cans";
		// Throw five cans with different angle
		for (let differential_angle = -20; differential_angle < 3; differential_angle += 10){
			if (this.fireDirection + differential_angle < 0){
				this.fireDirection = 0
			} else {
				this.fireDirection += differential_angle;
			}
			this.canArray.push(new BigSkill(
				this,
				this.x,
				this.y,
				this.fireDirection,
				this.canSpeed,
				this.username,
				this.role
				)
			)
		}
		
	}
	
    stop(e) {
	this.friction = Constants.PLAYER_FRICTION / 2;
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
			this.role,
			this.bulletSpeed
		  );
		}
		return null;
	  }

	// Need revision
	emitBigSkill() {
		if (this.bigSkillTimes > 0){
			this.bigSkillTimes--;
			return {
				mode: this.bigSkillName,
				parentId: this.id,
				weapon: this.canArray
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

module.exports = Cat;
