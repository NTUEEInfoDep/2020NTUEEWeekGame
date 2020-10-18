import "../css/main.css";

import { connect, play, queueEnd, checkRoom } from "./networking";
import { startRendering, stopRendering } from "./render";
import { startCapturingInput, stopCapturingInput } from "./input";
import { downloadAssets } from "./assets";
import { initState } from "./state";

const $id = (element) => {
  return document.getElementById(element);
};

const joinPage = $id("join-page");
const joinInput = $id("join-page-input");
const roomIDInput = $id("room-id-input");
const randomButton = $id("random-button");

const crtPage = $id("crt-page");
const crtInput = $id("crt-page-input");
const crts = document.getElementsByClassName("crtContainer");

const rulePage = $id("rule-page");
const ruleInput = $id("rule-page-input");
const ruleBlinker = $id("blinker");

const gameOverPage = $id("game-over-page");
const winCard = $id("win");
const loseCard = $id("lose");

function gameStart() {
  rulePage.classList.add("hidden");

  initState();
  startCapturingInput();
  startRendering();
}

function step3(n) {
  play(roomIDInput.value, n);

  crtPage.classList.add("hidden");
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

  checkRoom(roomIDInput.value);

  joinPage.classList.add("hidden");
  crtPage.classList.remove("hidden");

  crtInput.focus();
  crtInput.onkeydown = (e) => {
    if (e.code === "Digit1" || e.code === "Numpad1") step3(1);
    else if (e.code === "Digit2" || e.code === "Numpad2") step3(2);
    else if (e.code === "Digit3" || e.code === "Numpad3") step3(3);
    else if (e.code === "Digit4" || e.code === "Numpad4") step3(4);
    else if (e.code === "Digit5" || e.code === "Numpad5" || e.code === "Enter")
      step3(Math.floor(4 * Math.random()) + 1);
  };
  for (let i = 0; i <= 3; i += 1) crts[i].onclick = () => step3(i + 1);
  crts[5].onclick = () => step3(Math.floor(4 * Math.random()) + 1);
}

function step1() {
  joinPage.classList.remove("hidden");

  joinInput.focus();
  joinInput.onkeydown = () => {
    roomIDInput.focus();
  };
  roomIDInput.value = "";
  roomIDInput.onkeydown = (e) => {
    if (e.code === "Enter") step2();
  };
  randomButton.onclick = step2;
}

function onGameOver(reason) {
  // eslint-disable-next-line no-console
  console.log(`<><><> This player ${reason}s <><><>`);

  stopCapturingInput();
  gameOverPage.classList.remove("hidden");
  if (reason === "win") winCard.classList.remove("hidden");
  else if (reason === "lose") loseCard.classList.remove("hidden");

  setTimeout(() => {
    gameOverPage.onclick = () => {
      stopRendering();

      gameOverPage.classList.add("hidden");
      winCard.classList.add("hidden");
      loseCard.classList.add("hidden");

      step1();
    };
  }, 3000);
}

Promise.all([connect(onGameOver), downloadAssets()])
  .then(() => {
    step1();
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
