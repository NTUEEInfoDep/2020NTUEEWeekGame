const Player = require('./player');
const Constants = require('../shared/constants');

class Cat extends Player {
    // A multi-life and timid cat...
    constructor(id, username, x, y){
        super(id, username, x, y);
	// life
	this.hp = Constants.PLAYER_MAX_HP * 9;
	// force
	this.bulletDamage = 0.1 * Constants.BULLET_DAMAGE;
    }
}

class PinkAss extends Player {
    // Firm body and nice shape...
    constructor(id, username, x, y){
	super(id, username, x, y);
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
    }
}

class Banana extends Player {
    // Soft body and strong mind
    constructor(id, username, x, y){
	super(id, username, x, y);
    };
}
