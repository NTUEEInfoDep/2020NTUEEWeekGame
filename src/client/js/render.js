// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from "throttle-debounce";
import { MAP_SIZE_LENGTH, MAP_SIZE_WIDTH } from "../../shared/constants";
import { getAsset } from "./assets";
import { getCurrentState } from "./state";

const Constants = require("../../shared/constants");

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS } = Constants;

let characterNum = Math.random() * 4 + 1;

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
  context.fillStyle = "black";
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

  let playerFile;
  if (characterNum === 1) playerFile = "num1.png";
  else if (characterNum === 2) playerFile = "num2.png";
  else if (characterNum === 3) playerFile = "num3.png";
  else if (characterNum === 4) playerFile = "num4.png";
  else playerFile = "ship.svg";

  context.drawImage(
    getAsset(playerFile),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2
  );
  context.restore();

  // Draw health bar
  context.fillStyle = "white";
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
  context.arc(0, 0, PLAYER_RADIUS * 2, 0, Math.PI, true);
  context.lineWidth = PLAYER_RADIUS / 20;
  context.lineCap = "round";
  if (characterNum === 1) context.strokeStyle = "#c3b6b0";
  else if (characterNum === 2) context.strokeStyle = "#ff9fc1";
  else if (characterNum === 3) context.strokeStyle = "#e89b1a";
  else if (characterNum === 4) context.strokeStyle = "#fff9dd";

  context.setLineDash([PLAYER_RADIUS / 10, PLAYER_RADIUS / 5]);
  context.stroke();
  context.restore();

  // Draw barrel
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(fireDirection - Math.PI);
  context.strokeStyle = "white";
  context.lineWidth = PLAYER_RADIUS / 20;
  context.beginPath();
  context.moveTo(-PLAYER_RADIUS / 20, PLAYER_RADIUS * 1.75);
  context.lineTo(-PLAYER_RADIUS / 20, PLAYER_RADIUS * 2.25);
  context.moveTo(PLAYER_RADIUS / 20, PLAYER_RADIUS * 1.75);
  context.lineTo(PLAYER_RADIUS / 20, PLAYER_RADIUS * 2.25);
  context.stroke();
  // // another style
  //   context.fillStyle = "white";
  //   context.fillRect(
  //     -PLAYER_RADIUS / 20,
  //     PLAYER_RADIUS * 1.75,
  //     PLAYER_RADIUS / 10,
  //     PLAYER_RADIUS / 2
  //   );
  context.restore();
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;

  let bulletFile;
  if (characterNum === 1) bulletFile = "bullet1.png";
  else if (characterNum === 2) bulletFile = "bullet2.png";
  else if (characterNum === 3) bulletFile = "bullet3.png";
  else if (characterNum === 4) bulletFile = "bullet4.png";
  else bulletFile = "bullet.svg";

  context.drawImage(
    getAsset(bulletFile),
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

  // Draw map
  context.drawImage(
    getAsset("map1.png"),
    canvas.width / 2 - me.x,
    canvas.height / 2 - me.y,
    MAP_SIZE_LENGTH,
    MAP_SIZE_WIDTH
  );

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  others.forEach(renderPlayer.bind(null, me));
  // renderPlayer(me, me);
}

export function getCharacterNum(val) {
  characterNum = val;
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
