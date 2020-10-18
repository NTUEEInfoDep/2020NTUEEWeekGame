import "../css/main.css";

import { connect, play, queueEnd, checkRoom } from "./networking";
import { startRendering, stopRendering } from "./render";
import { startCapturingInput, stopCapturingInput } from "./input";
import { downloadAssets } from "./assets";
import { initState } from "./state";
import { healthBarInit } from "./strength_bar"
const $id = (element) => {
  return document.getElementById(element);
};

const joinPage = $id("play-menu");
const roomIDInput = $id("room-id");
const roomIDButton = $id("play-menu-enter");
const randomButton = $id("play-menu-random");

const chrtPage = $id("mode-menu");
const chrtInput = $id("crt-input");
const chrts = document.getElementsByClassName("characterContainer");

const rulePage = $id("game-rule");
const ruleBlinker = $id("blinker");
const ruleInput = $id("rule-input");

const gameoverPage = $id("gameover");
const winCard = $id("win");
const loseCard = $id("lose");

const powerbar = healthBarInit();

function gameStart() {
  rulePage.classList.add("hidden");
  initState();
  startCapturingInput();
  powerbar.startListening();
  startRendering(powerbar);
}

function step3Rule(n) {
  play(roomIDInput.value, n);

  chrtPage.classList.add("hidden");
  rulePage.classList.remove("hidden");

  if (roomIDInput.value === "random") {
    ruleBlinker.innerHTML = "Waiting for Others";
    queueEnd.then(gameStart);
  } else {
    // ruleBlinker.innerHTML = "3";
    // setTimeout(() => {
    //   ruleBlinker.innerHTML = "2";
    // }, 1000);
    // setTimeout(() => {
    //   ruleBlinker.innerHTML = "1";
    // }, 2000);
    // setTimeout(() => {
    ruleBlinker.innerHTML = "Click to Start";
    ruleInput.focus();
    ruleInput.onkeydown = gameStart;
    rulePage.onclick = gameStart;
    // }, 3000);
  }
}

function step2() {
  if (roomIDInput.value === "") {
    roomIDInput.value = "random";
  }

  //
  // Redesign if possible
  checkRoom(roomIDInput.value);
  //
  //

  joinPage.classList.add("hidden");
  chrtPage.classList.remove("hidden");

  chrtInput.focus();
  chrtInput.onkeydown = (e) => {
    if (e.code === "Digit1" || e.code === "Numpad1") step3Rule(1);
    else if (e.code === "Digit2" || e.code === "Numpad2") step3Rule(2);
    else if (e.code === "Digit3" || e.code === "Numpad3") step3Rule(3);
    else if (e.code === "Digit4" || e.code === "Numpad4") step3Rule(4);
    else if (e.code === "Digit5" || e.code === "Numpad5" || e.code === "Enter")
      step3Rule(Math.floor(4 * Math.random()) + 1);
  };
  chrts[0].onclick = () => step3Rule(1);
  chrts[1].onclick = () => step3Rule(2);
  chrts[2].onclick = () => step3Rule(3);
  chrts[3].onclick = () => step3Rule(4);
  chrts[4].onclick = () => step3Rule(Math.floor(4 * Math.random()) + 1);
}

function step1() {
  joinPage.classList.remove("hidden");

  roomIDInput.focus();
  roomIDInput.onkeydown = (e) => {
    if (e.code === "Enter") step2();
  };
  roomIDButton.onclick = step2;
  randomButton.onclick = step2;
}

function onGameOver(reason) {
  // eslint-disable-next-line no-console
  console.log(`<><><> This player ${reason}s <><><>`);

  stopCapturingInput();
  gameoverPage.classList.remove("hidden");
  if (reason === "win") winCard.classList.remove("hidden");
  else if (reason === "lose") loseCard.classList.remove("hidden");

  setTimeout(() => {
    gameoverPage.onclick = () => {
      stopRendering(powerbar);

      gameoverPage.classList.add("hidden");
      winCard.classList.add("hidden");
      loseCard.classList.add("hidden");

      step1();
    };
  }, 10000);
}

Promise.all([connect(onGameOver), downloadAssets()])
  .then(() => {
    step1();
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
//console.log(document.getElementById('game-canvas'));
//healthBarInit();