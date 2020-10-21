import { debounce } from "throttle-debounce";
import { MAP_SIZE_LENGTH, MAP_SIZE_WIDTH } from "../../shared/constants";
import { getAsset } from "./assets";
import { getCurrentState } from "./state";

const Constants = require("../../shared/constants");

const {
  PLAYER_RADIUS,
  PLAYER_MAX_HP,
  BULLET_RADIUS,
  PLAYER_HP_COEF,
} = Constants;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out"
  // so players can still see at least 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

setCanvasDimensions();

window.addEventListener("resize", debounce(40, setCanvasDimensions));

function renderBackground() {
  const r = 100 + 27 * Math.sin(Date.now() / 1009);
  const g = 100 + 27 * Math.sin(Date.now() / 2003);
  const b = 100 + 27 * Math.sin(Date.now() / 3001);

  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderMap(me, map) {
  if (map === 0) {
    ctx.drawImage(
      getAsset("map1.png"),
      canvas.width / 2 - me.x,
      canvas.height / 2 - me.y,
      MAP_SIZE_LENGTH,
      MAP_SIZE_WIDTH
    );
  }
  if (map === 1) {
    ctx.drawImage(
      getAsset("map2.png"),
      canvas.width / 2 - me.x,
      canvas.height / 2 - me.y,
      MAP_SIZE_LENGTH,
      MAP_SIZE_WIDTH
    );
  }
}

function renderPlayer(me, player) {
  const { x, y, direction, fireDirection, role, mode } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  //
  // Draw player
  ctx.save();
  ctx.translate(canvasX, canvasY - PLAYER_RADIUS / 2);
  if (direction < 0) {
    ctx.scale(-1, 1);
  }
  let playerStyle;
  if (role === 1) {
    if (mode === 3)
    {
      playerStyle = "num1_frozen.png";
    }
    else if (mode === 4)
    {
      playerStyle = "crt1_slipped.png"; 
    }
    else if  (mode === 2)
    {
      playerStyle = "crt1_distracted.PNG";
    }
    else
    {
      playerStyle = "crt1.png"; 
    }
  }
  if (role === 2) {
    if (mode === 3)
    {
      playerStyle = "num2_frozen.png";
    }
    else if (mode === 4)
    {
      playerStyle = "crt2_slipped.png"; 
    }
    else if  (mode === 2)
    {
      playerStyle = "crt2_distracted.png";
    }
    else
    {
      playerStyle = "crt2.png"; 
    }
  }
  if (role === 3) {
    if (mode === 3)
    {
      playerStyle = "num3_frozen.png";
    }
    else if (mode === 4)
    {
      playerStyle = "crt3_slipped.png"; 
    }
    else if  (mode === 2)
    {
      playerStyle = "crt3_distracted.PNG";
    }
    else
    {
      playerStyle = "crt3.png"; 
    }
  }
  if (role === 4) {
    if (mode === 3)
    {
      playerStyle = "num4_frozen.png";
    }
    else if (mode === 4)
    {
      playerStyle = "crt4_slipped.png"; 
    }
    else if  (mode === 2)
    {
      playerStyle = "crt4_distracted.PNG";
    }
    else
    {
      playerStyle = "crt4.png"; 
    }
  }
  ctx.drawImage(
    getAsset(playerStyle),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2
  );
  ctx.restore();

  //
  // Draw health info
  ctx.save();
  ctx.translate(canvasX - PLAYER_RADIUS, canvasY + PLAYER_RADIUS / 2 + 8);

  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, PLAYER_RADIUS * 2, 10);

  let hpW = (PLAYER_RADIUS * 2 * player.hp) / PLAYER_MAX_HP;
  if (role === 1) hpW /= PLAYER_HP_COEF.Cat;
  else if (role === 2) hpW /= PLAYER_HP_COEF.PinkAss;
  else if (role === 3) hpW /= PLAYER_HP_COEF.Pudding;
  else if (role === 4) hpW /= PLAYER_HP_COEF.Banana;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, hpW, 10);

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(Math.floor(player.hp), 0, -3);

  ctx.restore();

  //
  // Draw fire range
  ctx.save();
  ctx.translate(canvasX, canvasY - PLAYER_RADIUS / 2);

  ctx.beginPath();
  if (direction >= 0) ctx.arc(0, 0, PLAYER_RADIUS * 2, 0, -Math.PI / 2, true);
  else ctx.arc(0, 0, PLAYER_RADIUS * 2, -Math.PI / 2, -Math.PI, true);

  ctx.lineWidth = PLAYER_RADIUS / 20;
  ctx.lineCap = "round";
  if (role === 1) ctx.strokeStyle = "#c3b6b0";
  else if (role === 2) ctx.strokeStyle = "#ff9fc1";
  else if (role === 3) ctx.strokeStyle = "#e89b1a";
  else if (role === 4) ctx.strokeStyle = "#fff9dd";
  ctx.setLineDash([PLAYER_RADIUS / 10, PLAYER_RADIUS / 5]);
  ctx.stroke();

  ctx.restore();

  //
  // Draw barrel
  ctx.save();
  ctx.translate(canvasX, canvasY - PLAYER_RADIUS / 2);
  ctx.rotate(fireDirection - Math.PI);

  ctx.strokeStyle = "white";
  ctx.lineWidth = PLAYER_RADIUS / 20;
  ctx.beginPath();
  ctx.moveTo(-PLAYER_RADIUS / 20, PLAYER_RADIUS * 1.75);
  ctx.lineTo(-PLAYER_RADIUS / 20, PLAYER_RADIUS * 2.25);
  ctx.moveTo(PLAYER_RADIUS / 20, PLAYER_RADIUS * 1.75);
  ctx.lineTo(PLAYER_RADIUS / 20, PLAYER_RADIUS * 2.25);
  ctx.stroke();

  ctx.restore();
}

function renderBullet(me, bullet) {
  const { x, y, role, mode } = bullet;

  let bulletImg;
  if (role === 1) {
    bulletImg = "bullet1.png";
  } else if (role === 2) {
    bulletImg = mode === 2 ? "fart.png" : "bullet2.png";
  } else if (role === 3) {
    bulletImg = mode === 3 ? "ice.png" : "bullet3.png";
  } else {
    bulletImg = mode === 4 ? "banana.png" : "bullet4.png";
  }

  ctx.drawImage(
    getAsset(bulletImg),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2
  );
}

let map;

export function randommap(rm) {
  map = rm;
}

function render(powerbar) {
  const { me, bullets, others } = getCurrentState();
  if (!me) {
    return;
  }

  renderBackground();
  renderMap(me, map);
  bullets.forEach(renderBullet.bind(null, me));
  others.forEach(renderPlayer.bind(null, me));
  powerbar.update(me, others);
}

let renderInterval = setInterval(renderBackground, 1000 / 60);

export function startRendering(powerbar) {
  clearInterval(renderInterval);
  renderInterval = setInterval(() => {
    render(powerbar);
  }, 1000 / 60);
}

export function stopRendering(powerbar) {
  clearInterval(renderInterval);
  powerbar.stopListening();
  renderInterval = setInterval(renderBackground, 1000 / 60);
}
