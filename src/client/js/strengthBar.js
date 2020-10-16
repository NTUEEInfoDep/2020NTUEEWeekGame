
class strengthBar {
    constructor(app){
        this.power = 0;
        this.x = 123;
        this.y = 483;
        this.status = 0;
        this.app = app
        this.hpContainer = new PIXI.Container();
        this.bar = new PIXI.Graphics();
        this.hpBar = new PIXI.Graphics();
        this.allListeners = [];

    }

    createHealthBar(x, y, w, h, hp) {
        this.hpContainer.position.set(x, y);
        this.app.stage.addChild(this.hpContainer);
        
        this.bar.beginFill(0xcccccc);
        this.bar.drawRect(0, 0, w, h);
        this.bar.endFill();
        this.hpContainer.addChild(this.bar);

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
        return hpContainer;
    }

    addAllListener(){
        this.allListeners[0] = window.addEventListener("keydown", function (e){
    
            if (e.code === "Space") {
                this.status = 1;
            }
            
            this.healthBar = this.createHealthBar(this.x, this.y, 150, 10, this.power);
            window.removeEventListener("keydown", window);
        
        });
        
        this.allListeners[1] = window.addEventListener("keyup", function (e){
            
            if (e.code === "Space")  {
                this.status = 2;
                console.log("keyup",t);
            }        
        });
    }

    startListening(){
        this.addAllListener();

        this.app.ticker.add((delta) => this.gameLoop(delta));
    }

    play(delta){
        let deltaT = -1;
        if (this.status === 1){
            if (this.power >= 100){
                this.power = 100;
                deltaT = -1;
            }
            if(this.power <= 0){
                t = 0;
                deltaT = 1;
            }

            this.power += deltaT;
            this.app.stage.removeChild(this.healthBar);
            this.createHealthBar(this.x, this.y, 150, 10, this.power);
        }
        if (this.status == 2) {     
            return this.power;
        }
    }

    gameLoop(delta){
        this.play(delta);
    }
}



const app = new PIXI.Application({
    view: document.getElementById('game-canvas'),
});

const item = new strengthBar(app);
item.startListening();





