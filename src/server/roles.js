const Player = require('./player');
const Constants = require('../shared/constants');

class Cat extends Player {
    // A multi-life and timid cat...
    constructor(id, username, x, y){
        super(id, username, x, y);
	this.role = 'Cat';
	// life
	this.hp = Constants.PLAYER_MAX_HP * 9;
	// force
	this.bulletDamage = 0.1 * Constants.BULLET_DAMAGE;
    }
    stop(e) {
	this.friction = Constants.PLAYER_FRICTION / 2;
    }
}

class PinkAss extends Player {
    // Firm body and nice shape...
    constructor(id, username, x, y){
	super(id, username, x, y);
	this.role = 'PinkAss';
	// life
	this.hp = Constants.PLAYER_MAX_HP * 2;
	// force
	this.bulletDamage = 0.5 * Constants.BULLET_DAMAGE; 
    }
}

class Pudding extends Player {
    // Absolutely no chemical substance or toxic ingredient added...
    constructor(id, username, x, y){
	super(id, username, x, y);
	this.role = 'Pudding';
	this.bulletDamage = Constants.BULLET_DAMAGE;
    }
}

class Banana extends Player {
    // Soft body and strong mind
    constructor(id, username, x, y){
	super(id, username, x, y);
	this.role = 'Banana';
	this.bulletDamage = Constants.BULLET_DAMAGE;
    };
}
