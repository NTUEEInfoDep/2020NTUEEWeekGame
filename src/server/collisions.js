/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
const Constants = require("../shared/constants");

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet._parent.id !== player.id &&
        player.distanceTo(bullet) <=
          Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS &&
        bullet.username === player.username
      ) {
        destroyedBullets.push(bullet);
        // judge by role instance
        player.takeBulletDamage(bullet._parent);
        if (bullet.mode === Constants.PLAYER_MODE.fart) player.changemode(Constants.PLAYER_MODE.fart);
        if (bullet.mode === Constants.PLAYER_MODE.snow) player.changemode(Constants.PLAYER_MODE.snow);
        if (bullet.mode === Constants.PLAYER_MODE.banana_peel) player.changemode(Constants.PLAYER_MODE.banana_peel);
        break;
      }
    }
  }
  return destroyedBullets;
}

module.exports = applyCollisions;
