// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from "throttle-debounce";
import { MAP_SIZE_LENGTH, MAP_SIZE_WIDTH } from "../../shared/constants";
import { getAsset } from "./assets";
import { getCurrentState } from "./state";

const Constants = require("../../shared/constants");

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS } = Constants;

//  delete BELOW after characters are ready
//
const styleNum = Math.random();
//
//  remove ABOVE after characters are ready

// Get the canvas graphics context
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

setCanvasDimensions();

window.addEventListener("resize", debounce(40, setCanvasDimensions));

function renderBackground() {
  //  const backgroundX = MAP_SIZE_LENGTH / 2 - x + canvas.width / 2;
  //  const backgroundY = MAP_SIZE_WIDTH / 2 - y + canvas.height / 2;
  //  const backgroundGradient = context.createRadialGradient(
  //    backgroundX,
  //    backgroundY,
  //    MAP_SIZE_LENGTH / 10,
  //    backgroundX,
  //    backgroundY,
  //    MAP_SIZE_WIDTH / 2
  //  );
  //  backgroundGradient.addColorStop(0, "black");
  //  backgroundGradient.addColorStop(1, "gray");
  //  context.fillStyle = backgroundGradient;
  if (styleNum < 1 / 3) {
    context.fillStyle = "white";
  } else if (styleNum < 2 / 3) {
    context.fillStyle = "gray";
  } else {
    context.fillStyle = "black";
  }
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction, fireDirection } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw player
  context.save();
  context.translate(canvasX, canvasY);
  if (direction < 0) {
    context.scale(-1, 1);
  }
  let playerStyle = "bullet.svg";
  if (styleNum < 1 / 4) {
    playerStyle = "num1.png";
  } else if (styleNum < 2 / 4) {
    playerStyle = "num2.png";
  } else if (styleNum < 3 / 4) {
    playerStyle = "num3.png";
  } else {
    playerStyle = "num4.png";
  }
  context.drawImage(
    getAsset(playerStyle),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2
  );
  context.restore();

  // Draw health bar
  if (styleNum < 1 / 3) {
    context.fillStyle = "gray";
  } else {
    context.fillStyle = "white";
  }
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2
  );
  context.fillStyle = "red";
  context.fillRect(
    canvasX - PLAYER_RADIUS + (PLAYER_RADIUS * 2 * player.hp) / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2
  );

  // Draw fire range
  context.save();
  context.translate(canvasX, canvasY);
  context.beginPath();
  context.arc(
    0,
    0,
    PLAYER_RADIUS * 2.5,
    Constants.FIRE_RANGE_MIN - Math.PI / 2,
    Constants.FIRE_RANGE_MAX - Math.PI / 2,
    false
  );
  context.lineWidth = PLAYER_RADIUS / 5;
  context.lineCap = "round";
  if (styleNum < 1 / 3) {
    context.strokeStyle = "gray";
  } else {
    context.strokeStyle = "white";
  }
  context.stroke();
  context.restore();

  // Draw barrel
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(fireDirection - Math.PI);
  if (styleNum < 1 / 3) {
    context.strokeStyle = "tomato";
    context.lineWidth = 2;
    context.setLineDash([2, 2]);
    context.beginPath();
    context.moveTo(0, PLAYER_RADIUS);
    context.lineTo(0, PLAYER_RADIUS * 5);
    context.stroke();
  } else if (styleNum < 2 / 3) {
    context.strokeStyle = "lightblue";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(-PLAYER_RADIUS / 4, PLAYER_RADIUS);
    context.lineTo(-PLAYER_RADIUS / 4, PLAYER_RADIUS * 5);
    context.moveTo(PLAYER_RADIUS / 4, PLAYER_RADIUS);
    context.lineTo(PLAYER_RADIUS / 4, PLAYER_RADIUS * 5);
    context.stroke();
  } else {
    context.fillStyle = "LawnGreen";
    context.fillRect(
      -PLAYER_RADIUS / 3,
      PLAYER_RADIUS * 2,
      (BULLET_RADIUS * 2) / 3,
      PLAYER_RADIUS
    );
  }
  context.restore();
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;

  let bulletStyle = "bullet.svg";
  if (styleNum < 1 / 4) {
    bulletStyle = "bullet1.png";
  } else if (styleNum < 2 / 4) {
    bulletStyle = "bullet2.png";
  } else if (styleNum < 3 / 4) {
    bulletStyle = "bullet3.png";
  } else {
    bulletStyle = "bullet4.png";
  }
  context.drawImage(
    getAsset(bulletStyle),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE_LENGTH / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE_WIDTH / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  //
  // REMOVE the below after map is ready!!!
  //
  // Draw boundaries
  // if (styleNum < 1 / 3) {
  //   context.strokeStyle = "gray";
  // } else {
  //   context.strokeStyle = "white";
  // }
  // context.lineWidth = 10;
  // context.strokeRect(
  //   canvas.width / 2 - me.x,
  //   canvas.height / 2 - me.y,
  //   MAP_SIZE_LENGTH,
  //   MAP_SIZE_WIDTH
  // );
  //
  // REMOVE the above after map is ready!!!
  //

  // // TODO: Draw map
  context.drawImage(
    getAsset(`map${Constants.MAP_NUM + 1}.png`),
    canvas.width / 2 - me.x,
    canvas.height / 2 - me.y,
    MAP_SIZE_LENGTH,
    MAP_SIZE_WIDTH
  );
  // //

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
