import * as PIXI from 'pixi.js-legacy'
import { updateMovement } from "./networking";
const Constants = require("../../shared/constants");

const {
  PLAYER_RADIUS,
  PLAYER_MAX_HP,
  BULLET_RADIUS,
  PLAYER_HP_COEF,
} = Constants;

class StrengthBar {
  constructor(app, canvas) {
    this.power = 0;
    this.x = 500;
    this.y = 500;
    this.status = 0;
    this.app = app
    this.canvas = canvas;
    this.hpContainer = new PIXI.Container();
    this.bar = new PIXI.Graphics();
    this.hpBar = new PIXI.Graphics();
    this.hpContainer.position.set(this.x, this.y);
    this.app.stage.addChild(this.hpContainer);
    this.allListeners = [];
    this.deltaT = -1;
  }

  createHealthBar(x, y, w, h, hp) {
    this.hpContainer.position.set(this.x, this.y);
    this.hpContainer.x = this.x;
    this.hpContainer.y = this.y;
    this.bar = new PIXI.Graphics();
    this.bar.beginFill(0xcccccc);
    this.bar.drawRect(0, 0, w, h);
    this.bar.endFill();
    this.hpContainer.addChild(this.bar);

    this.hpBar = new PIXI.Graphics();
    let color = undefined;

    if (hp > 100 / 2) {
        color = 0x00ff00;
    } else if (hp > 100 / 4) {
        color = 0xffff00;
    } else {
        color = 0xff0000;
    }
    this.hpBar.beginFill(color);
    this.hpBar.drawRect(0, 0, (hp / 100) * w, h);
    this.hpBar.endFill();
    this.hpContainer.addChild(this.hpBar);
    this.hpContainer.outer = this.hpBar;
  }

  startListening() {
    this.down = function (e){
      this.start(e);
      }.bind(this)
    this.up = function (e){
      this.end(e);
      }.bind(this)
    this.allListeners[0] = window.addEventListener("keydown", this.down)
    this.allListeners[1] = window.addEventListener("keyup", this.up)
  }

  start(e) {
    if (e.code === "Space" && this.status === 0) {
      this.status = 1;
      this.healthBar = this.createHealthBar(this.x, this.y, 150, 10, this.power);
      this.app.animationUpdate = this.gameLoop.bind(this);
      this.app.ticker.add(this.app.animationUpdate);
    }
  }

  end(e) {
    if (e.code === "Space" && this.status === 1) {
      updateMovement(["keydown", e.code, 0.5 + this.power/200]);
      this.status = 2;
      this.app.stage.removeChild(this.hpContainer);
      this.app.ticker.remove(this.app.animationUpdate);
      this.constructor(this.app, this.canvas);
    }
  }

  gameLoop(delta) {
    if (this.power >= 100) {
      this.power = 100;
      this.deltaT = -1;
    }
    if (this.power <= 0) {
      this.power = 0;
      this.deltaT = 1;
    }
    this.power += this.deltaT;
    this.app.stage.removeChild(this.healthBar);
    this.createHealthBar(this.x, this.y, 150, 10, this.power);
    if (this.status === 2) {
      this.app.stage.removeChild(this.healthBar);
      this.status = 0;
      return this.power;
    }
  }
  
  update(me, others){
    let x = 0;
    let y = 0;

    Object.values(others).forEach((player)=>{
      if (me["id"] === player["id"]){
        x = player["x"];
        y = player["y"];
      }
    })
    const canvasX = this.canvas.width / 2 + x - me.x - 75;
    const canvasY = this.canvas.height / 2 + y - me.y;

    this.x = canvasX ;
    this.y = canvasY - PLAYER_RADIUS / 2 + 100 ;
  }

  stopListening(){
    window.removeEventListener("keydown", this.down);
    window.removeEventListener("keyup", this.up);
  }

}


export function healthBarInit() {
  const app = new PIXI.Application({
    view: document.getElementById('canvas'),
    forceCanvas: true,
    transparent: true,
    clearBeforeRender: false,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvas = document.getElementById("canvas");
  const powerbar = new StrengthBar(app, canvas);
  return powerbar;
}


