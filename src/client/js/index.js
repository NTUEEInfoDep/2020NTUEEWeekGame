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
const playInstructions = document.getElementById("instructions");
const playButton = document.getElementById("play-menu-enter");
const roomIDInput = document.getElementById("room-id-input");
const characters = document.getElementsByClassName("characterContainer");

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove("hidden");

  setLeaderboardHidden(true);
}

function gameStart() {
  roleSelect();
    // Display instructions
  document.addEventListener('keyup',event => {
    if (event.keyCode === 13) {
      playInstructions.classList.add("hidden");
    }
  })
  // Play!
  play(roomIDInput.value);
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
}

function roleSelect() { 
  playMenu.classList.add("hidden");
  modeMenu.classList.remove("hidden");
  characters[0].onclick= () => characterSelect(1),
  characters[1].onclick= () => characterSelect(2),
  characters[2].onclick= () => characterSelect(3),
  characters[3].onclick= () => characterSelect(4),
  characters[4].onclick= () => characterSelect(5)
}

function characterSelect(char) {
  var role = 0;
  if (char !== 5){
    role = char;
  } else {
    role = Math.floor(Math.random() * 4)+1;
  }
  modeMenu.classList.add("hidden");
  playInstructions.classList.remove("hidden"); 
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
