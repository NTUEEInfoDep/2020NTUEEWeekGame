// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from "./networking";
import { startRendering, stopRendering } from "./render";
import { startCapturingInput, stopCapturingInput } from "./input";
import { downloadAssets } from "./assets";
import { initState } from "./state";
import { setLeaderboardHidden } from "./leaderboard";

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import "../css/bootstrap-reboot.css";
import "../css/main.css";

const playMenu = document.getElementById("play-menu");
const modeMenu = document.getElementById("mode-menu");
const gameRule = document.getElementById("game-rule");
const playButton = document.getElementById("play-menu-enter");
const roomIDInput = document.getElementById("room-id");
const characters = document.getElementsByClassName("characterContainer");
let characterSelected = 0;

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove("hidden");
  setLeaderboardHidden(true);
}

function characterSelect(char) {
  if (char !== 5) {
    characterSelected = char;
    characters[characterSelected - 1].style = "background-color: #ff7f50";
  } else {
    characterSelected = Math.floor(Math.random() * 4) + 1;
    characters[characterSelected - 1].style = "background-color: #ff7f50";
  }
  modeMenu.classList.add("hidden");
  gameRule.classList.remove("hidden");
}

function gameStart() {
  playMenu.classList.add("hidden");

  // Select a role
  modeMenu.classList.remove("hidden");
  characters[0].onclick = () => characterSelect(1);
  characters[1].onclick = () => characterSelect(2);
  characters[2].onclick = () => characterSelect(3);
  characters[3].onclick = () => characterSelect(4);
  characters[4].onclick = () => characterSelect(5);

  // Display rule
  document.addEventListener("keyup", () => {
    gameRule.classList.add("hidden");
  });

  // Play!
  play(roomIDInput.value);
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
}

Promise.all([connect(onGameOver), downloadAssets()])
  .then(() => {
    playMenu.classList.remove("hidden");
    roomIDInput.focus();
    playButton.onclick = gameStart;
    roomIDInput.onkeypress = (e) => {
      // Enter key event code == 13
      if (e.which === 13) {
        gameStart();
      }
    };
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
