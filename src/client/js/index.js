import "../css/main.css";

import { connect, play, queueEnd, checkRoom } from "./networking";
import { startRendering, stopRendering } from "./render";
import { startCapturingInput, stopCapturingInput } from "./input";
import { downloadAssets } from "./assets";
import { initState } from "./state";
import { healthBarInit } from "./strength_bar";

const powerbar = healthBarInit();

const $id = (element) => document.getElementById(element);
const crts = document.getElementsByClassName("crtContainer");

function gameStart() {
  $id("rule-page").classList.add("hidden");
  $id("creators").classList.add("hidden");

  initState();
  startCapturingInput();
  startRendering(powerbar);
  powerbar.startListening();
}

function step3(crtChosen) {
  play($id("room-id-input").value, crtChosen);

  $id("crt-page").classList.add("hidden");
  $id("rule-page").classList.remove("hidden");

  if ($id("room-id-input").value === "random") {
    $id("blinker").innerHTML = "Waiting for Others";
    queueEnd.then(gameStart);
  } else {
    $id("blinker").innerHTML = "Click to Start";
    $id("rule-page-input").focus();
    $id("rule-page-input").onkeydown = gameStart;
    $id("rule-page").onclick = gameStart;
  }
}

function step2() {
  if ($id("room-id-input").value === "") $id("room-id-input").value = "random";
  else checkRoom($id("room-id-input").value);

  $id("join-page").classList.add("hidden");
  $id("crt-page").classList.remove("hidden");

  $id("crt-page-input").focus();
  $id("crt-page-input").onkeydown = (e) => {
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
  $id("creators").classList.remove("hidden");
  $id("join-page").classList.remove("hidden");

  $id("join-page-input").focus();
  $id("join-page-input").onkeydown = () => {
    $id("room-id-input").focus();
  };
  $id("room-id-input").value = "";
  $id("room-id-input").onkeydown = (e) => {
    if (e.code === "Enter") step2();
  };
  $id("random-button").onclick = step2;
}

function onGameOver(reason) {
  stopCapturingInput();

  $id("game-over-page").classList.remove("hidden");
  if (reason === "win") $id("win").classList.remove("hidden");
  else if (reason === "lose") $id("lose").classList.remove("hidden");

  /*const getOut = () => {
    stopRendering(powerbar);

    $id("game-over-page").classList.add("hidden");
    $id("win").classList.add("hidden");
    $id("lose").classList.add("hidden");

    step1();
  };*/

  setTimeout(() => {
    $id("game-over-page").onclick = () => {
      window.location.reload();
    };
  }, 2000);
}

Promise.all([connect(onGameOver), downloadAssets()])
  .then(() => {
    step1();
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
