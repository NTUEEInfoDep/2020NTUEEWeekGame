// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from "./networking";
import { updateMovement } from "./networking";
import { updateCamera } from "./networking";

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
  const normalizedX = (x - window.innerWidth / 2)/ (window.innerWidth / 2);
  const normalizedY = (y - window.innerHeight / 2)/ (window.innerHeight / 2);
  updateCamera([Math.sign(normalizedX)*(Math.abs(normalizedX) > 3/4),
  Math.sign(normalizedY)*(Math.abs(normalizedY) > 3/4)]);
}

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function onKeydown(e) {
  updateMovement(["keydown", e.code]);
}

function onKeyUp(e){
  updateMovement(["keyup", e.code]);
}

export function startCapturingInput() {
  window.addEventListener("mousemove", onMouseInput);
  window.addEventListener("click", onMouseInput);
  window.addEventListener("touchstart", onTouchInput);
  window.addEventListener("touchmove", onTouchInput);
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("keyup", onKeyUp);
  //window.addEventListener("keypress", onKeyPress);
}

export function stopCapturingInput() {
  window.removeEventListener("mousemove", onMouseInput);
  window.removeEventListener("click", onMouseInput);
  window.removeEventListener("touchstart", onTouchInput);
  window.removeEventListener("touchmove", onTouchInput);
}
