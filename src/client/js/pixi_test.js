let app = new PIXI.Application();

document.body.appendChild(app.view);

app.stage.addChild(PIXI.Sprite.from("/assets/map1.png"));

PIXI.loader
  .add([
    "/assets/num1.png",
    "/assets/num2.png",
    "/assets/num3.png",
    "/assets/num4.png",
    "/assets/bullet1.png",
    "/assets/bullet2.png",
    "/assets/bullet3.png",
    "/assets/bullet4.png",
    "/assets/icon64.png",
  ])
  .load(loadOver);

function loadOver() {
  console.log("Images loaded successfully!");
  let num1 = new PIXI.Sprite(PIXI.loader.resources["/assets/num1.png"].texture);
  let num2 = new PIXI.Sprite(PIXI.loader.resources["/assets/num2.png"].texture);
  let num3 = new PIXI.Sprite(PIXI.loader.resources["/assets/num3.png"].texture);
  let num4 = new PIXI.Sprite(PIXI.loader.resources["/assets/num4.png"].texture);
  let bullet1 = new PIXI.Sprite(
    PIXI.loader.resources["/assets/bullet1.png"].texture
  );
  let bullet2 = new PIXI.Sprite(
    PIXI.loader.resources["/assets/bullet1.png"].texture
  );
  let bullet3 = new PIXI.Sprite(
    PIXI.loader.resources["/assets/bullet1.png"].texture
  );
  let bullet4 = new PIXI.Sprite(
    PIXI.loader.resources["/assets/bullet1.png"].texture
  );
  let arrow = new PIXI.Sprite(
    PIXI.loader.resources["/assets/icon64.png"].texture
  );
}

function placePlayer(player) {
  if (playerNum == 1) {
    app.stage.addChild(player);
    player.x = (0.8 * app.screen.width) / 13.4;
    player.y = (4.4 * app.screen.height) / 6.2;
  } else {
    player.scale.x = -1;
    app.stage.addChild(player);
    player.x = (11.0 * app.screen.width) / 13.4;
    player.y = (3.9 * app.screen.height) / 6.2;
  }
}

function playerAttacking(player, playerNum) {
  var state = 0;
  while (state == 0) {
    window.addEventListener("keydown", function (e) {
      if (e.KeyChar == 32) {
        state = 1;
      }
    });
  }
  app.stage.addChild(arrow);
  arrow.x = player.x + player.width / 2;
  arrow.y = player.y + player.height / 2 - 100;
  while (state == 1) {
    // rotating the arrow to show the direction of the bullet

    //let container = new PIXI.Container();
    //container.x = player.x;
    //container.y = player.y;
    //container.pivot.x = player.width/2;
    //container.pivot.y = player.height/2;

    app.ticker.add((delta) => {
      arrow.x += 100 * 0.1 * Math.cos(delta * Math.PI);
      arrow.y -= 100 * 0.1 * Math.sin(delta * Math.PI);
      arrow.rotation += 0.1 * delta;
      window.addEventListener("keyup", function (e) {
        if (e.KeyChar == 32) {
          var x = arrow.x;
          var y = arrow.y;
          state = 2;
          app.stage.removeChild(arrow);
          return [x, y];
        }
      });
    });
  }
  window.alert("Keydown Space to control strength!");
  while (stste == 2) {
    // determining the strength of the attack
    window.addEventListener("keydown", function (e) {
      if (e.KeyChar == 32) {
        state = 3;
      }
    });
  }
  let roundBox = new PIXI.Graphics();
  roundBox.lineStyle(4, 0x99ccff, 1);
  roundBox.beginFill(0xff9933);
  roundBox.drawRoundedRect(0, 0, 20, 20, 10);
  roundBox.endFill();
  roundBox.x = player.x + 10;
  roundBox.y = player.y + 50;
  app.stage.addChild(roundBox);
  while (state == 3) {
    var flag = 1;
    app.ticker.add((delta) => {
      if (flag == 1) {
        roundBox.width += 0.2 * delta;
        if (roundBox.width > 150) {
          flag = 2;
        } else {
          roundBox.width -= 0.2 * delta;
          if (roundBox.width < 20) {
            flag = 1;
          }
        }
      }

      window.addEventListener("keyup", function (e) {
        if (e.KeyChar == 32) {
          var v = roundBox.width;
          state = 4;
          app.stage.removeChild(roundBox);
          return v;
        }
      });
    });
  }
}

function bulletRotate(bullet) {
  app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    bullet.rotation -= 0.2 * delta;
  });
}