const HP_MAX = 128;
      let t = HP_MAX;
      let flag = 1;
      let val;
      let app = new PIXI.Application();

      document.body.appendChild(app.view);
      //app.stage.addChild(PIXI.Sprite.from('map1.png'));
      //let healthBar;
      let colour;

      function createHealthBar(x, y, w, h, hp) {
        hpContainer = new PIXI.Container();
        hpContainer.position.set(x, y);
        app.stage.addChild(hpContainer);

        let bar = new PIXI.Graphics();
        bar.beginFill(0xcccccc);
        bar.drawRect(0, 0, w, h);
        bar.endFill();
        hpContainer.addChild(bar);

        let hpBar = new PIXI.Graphics();
        if (hp > HP_MAX / 2) {
          color = 0x00ff00;
        } else if (hp > HP_MAX / 4) {
          color = 0xffff00;
        } else {
          color = 0xff0000;
        }

        hpBar.beginFill(color);
        hpBar.drawRect(0, 0, (hp / HP_MAX) * w, h);
        hpBar.endFill();
        hpContainer.addChild(hpBar);
        hpContainer.outer = hpBar;
        return hpContainer;
      }
      let state = 0;
      
  
      export function backandforthBar(s,x_value,y_value){
        let strength;
        let healthBar;
      app.ticker.add((delta) => {

        if (s == 0){
          window.addEventListener(
			"keydown",function(e){
       // console.log(e.keyCode);
			  if (e.keyCode === 32){
        s = 1;
        }
    })
        }
        
        if (s == 1){
          app.stage.removeChild(healthBar);
        if (flag === 0) {
          t += 1;
        } else {
          t -= 1;
        }
        if (t === 0) {
          flag = 0;
        } else if (t === 128) {
          flag = 1;
        }
        healthBar = createHealthBar(x_value, y_value, 150, 10, t);
        //console.log(t)
        strength = t;
        //console.log(s)
        window.addEventListener(
			"keydown",function(e){
        //console.log(e.keyCode);
			  if (e.keyCode === 32){
        s = 2;
        app.stage.removeChild(healthBar);
        console.log('strength =',strength);
        s = 0;
        return;
        }
    })
      }
      
      });
    }
    
      
