module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_FRICTION: 400,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_GRAVITY: 300,
  BULLET_DAMAGE: 10,

  FIRE_RANGE_MIN: -Math.PI / 3,
  FIRE_RANGE_MAX: Math.PI / 3,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: "join_game",
    GAME_UPDATE: "update",
    INPUT: "input",
    KEY_INPUT: "key_input",
    GAME_OVER: "dead",
  },
});
