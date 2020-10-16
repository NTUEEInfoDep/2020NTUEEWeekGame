// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play, queueEnd } from "./networking";
import { startRendering, stopRendering } from "./render";
import { startCapturingInput, stopCapturingInput } from "./input";
import { downloadAssets } from "./assets";
import { initState } from "./state";

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import "../css/bootstrap-reboot.css";
import "../css/main.css";

const playMenu = document.getElementById("play-menu");
const roomIDInput = document.getElementById("room-id");
const playButton = document.getElementById("play-menu-enter");
const characterMenu = document.getElementById("mode-menu");
const characterInput = document.getElementById("crt-input");
const characters = document.getElementsByClassName("characterContainer");
const gameRule = document.getElementById("game-rule");
const ruleInput = document.getElementById("rule-input");
const gameover = document.getElementById("gameover");
const gameoverInput = document.getElementById("gameover-input");
const win = document.getElementById("win");
const lose = document.getElementById("lose");

let characterSelected = 0;

//
// function replaySetup() {
//   play(roomIDInput.value);
//   gameover.classList.add("hidden");
//   initState();
//   startCapturingInput();
//   startRendering();
// }
//

function gameStart() {
  gameRule.classList.add("hidden");

  initState();
  startCapturingInput();
  startRendering();
}

function step3(n) {
  characterSelected = n;
  play(roomIDInput.value, characterSelected);

  // Show game rule
  characterMenu.classList.add("hidden");
  gameRule.classList.remove("hidden");

  // ruleInput.focus();
  // ruleInput.onkeydown = gameStart;
  // gameRule.onclick = gameStart;

  // Promise.all([queueEnd])
  //   .then((result) => {
  //     if (result) gameStart();
  //   })
  //   // eslint-disable-next-line no-console
  //   .catch(console.error);

  queueEnd.then(() => {
    gameStart();
  });
}

function step2() {
  // Show character table
  playMenu.classList.add("hidden");
  characterMenu.classList.remove("hidden");

  characterInput.focus();
  characterInput.onkeydown = (e) => {
    if (e.code === "Digit1") step3(1);
    else if (e.code === "Digit2") step3(2);
    else if (e.code === "Digit3") step3(3);
    else if (e.code === "Digit4") step3(4);
    else if (e.code === "Digit5") step3(Math.floor(4 * Math.random()) + 1);
    else if (e.code === "Enter") step3(Math.floor(4 * Math.random()) + 1);
  };
  characters[0].onclick = () => step3(1);
  characters[1].onclick = () => step3(2);
  characters[2].onclick = () => step3(3);
  characters[3].onclick = () => step3(4);
  characters[4].onclick = () => step3(Math.floor(4 * Math.random()) + 1);
}

function step1() {
  // Show roomID input
  playMenu.classList.remove("hidden");

  roomIDInput.focus();
  roomIDInput.onkeydown = (e) => {
    if (e.code === "Enter") step2();
  };
  playButton.onclick = step2;
}

function onGameOver(reason) {
  gameover.classList.remove("hidden");
  if (reason === "win") win.classList.remove("hidden");
  else if (reason === "lose") lose.classList.remove("hidden");

  function gameoverHandler() {
    stopCapturingInput();
    stopRendering();

    gameover.classList.add("hidden");
    win.classList.add("hidden");
    lose.classList.add("hidden");

    step1();
  }

  gameoverInput.focus();
  gameoverInput.onkeydown = gameoverHandler;
  gameover.onclick = gameoverHandler;
}

//
// export function getRole() {
//   return role;
// }
//

Promise.all([connect(onGameOver), downloadAssets()])
  .then(() => {
    step1();
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
