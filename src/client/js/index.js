// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from "./networking";
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
const characterMenu = document.getElementById("mode-menu");
const gameRule = document.getElementById("game-rule");
const playButton = document.getElementById("play-menu-enter");
const roomIDInput = document.getElementById("room-id");
const characters = document.getElementsByClassName("characterContainer");
const gameover = document.getElementById("gameover");

let characterSelected = 0;

function onGameOver(reason) {
  stopCapturingInput();
  stopRendering();
  gameover.className = reason;
  gameover.onclick = () => {
    gameover.classList.add("invisible");
  };
  playMenu.classList.remove("hidden");
}

function gameStart() {
  play(roomIDInput.value, characterSelected);
  initState();
  startCapturingInput();
  startRendering();
}

function step3(n) {
  characterSelected = n;

  // Show game rule
  characterMenu.classList.add("hidden");
  gameRule.classList.remove("hidden");

  gameRule.onclick = () => {
    gameRule.classList.add("hidden");
    gameStart();
  };
}

function step2() {
  // Show character table
  playMenu.classList.add("hidden");
  characterMenu.classList.remove("hidden");

  characters[0].onclick = () => step3(1);
  characters[1].onclick = () => step3(2);
  characters[2].onclick = () => step3(3);
  characters[3].onclick = () => step3(4);
  characters[4].onclick = () => step3(Math.floor(4 * Math.random()) + 1);
}

function step1() {
  // Show roomID input
  gameover.classList.add("invisible");
  playMenu.classList.remove("hidden");

  roomIDInput.focus();
  playButton.onclick = step2;
}

export function getRole() {
  return role;
}

function replaySetup() {
  play(roomIDInput.value);
  gameoverBoard.classList.add('hidden');
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
}

Promise.all([connect(onGameOver), downloadAssets()])
  .then(() => {
    step1();
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
