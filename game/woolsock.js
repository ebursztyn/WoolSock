window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Audio, Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup("game")
        // And turn on default input controls and touch input (for UI)
        .controls().touch();

Q.GameStatus = {
  currentPlayer: "Gerev",
  phase: "instructions" //from: instructions, game, invitation
};

Q.Sprite.extend("PowerUp", {

  init: function(p) {
    this._super(p, { 
      sensor: true
    });
  }

});

Q.Sprite.extend("Switch", {

  init: function(p) {
    this._super(p, { 
      sheet: 'off_switch',
      sensor: true
    });
    this.board = p.board;
    this.changes = p.changes;
  },

  turnOn: function() {
    if (this.p.sheet != "on_switch") {
      this.p.sheet = "on_switch";
      Q.audio.play('press_switch.mp3');
      this.changeBack = [];
      for (var i = 0; i < this.changes.length; i++) {
        this.board.setTile(this.changes[i].x, this.changes[i].y, this.changes[i].to);
      }
    }
  },

  turnOff: function() {
    this.p.sheet = "off_switch";
  }

});

Q.Sprite.extend("Stone", {

  init: function(p) {
    this._super(p, { 
      sheet: "stone",
      x: 550,
      y: 55, 
    });

    this.add('2d');

    this.on("bump.left",function(collision) {
      var obj = collision.obj;
      if(obj.isA("Gerev") || obj.isA("Zemer")) { 
         if (obj.p.hasPowerUp) {
           // Q.audio.play('pushing_stone.mp3');
           this.p.vx = 60;
         } 
      }
    });

    this.on("bump.bottom",function(collision) {
      var obj = collision.obj;
      if(obj.isA("Radio")) { 
           this.p.vy -= 50 * (collision.impact/150);
      } else {
        this.p.vx = 0;
      }
    });
  }
  
});

Q.Sprite.extend("Gerev",{

  // the init constructor is called on creation
  init: function(p) {

    this.name = "Gerev";

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "gerev_walk",  // Setting a sprite sheet sets sprite width and height
      sprite: "gerev",
      x: 450,           // You can also set additional properties that can
      y: 650,             // be overridden on object creation
      jumpSpeed: -380
    });

    this.add('2d, platformerControls, animation');

    this.on("jump", function(obj) {
      if (!obj.p.playedJump) {
        Q.audio.play('gerev_jump.mp3');
        obj.p.playedJump = true;
      }
    });

    this.on("jumped", function(obj) {
        obj.p.playedJump = false;
    });

    this.on("hit.sprite",function(collision) {

      var obj = collision.obj;
      if (obj.isA("Switch")) {
        obj.turnOn();
      } 
      if (obj.isA("PowerUp")) {
        if (!this.p.hasPowerUp) {
          Q.audio.play('powerup.mp3');
        }
        this.p.hasPowerUp = true;
        this.p.scale = 1.5;
        obj.p.opacity = 0;
      } 
    });

    this.on("anim.gerev_walk_right", function() {
      Q.audio.play("gerev_walk.mp3");
    });

    this.on("anim.gerev_walk_left", function() {
      Q.audio.play("gerev_walk.mp3");
    });

  },

  step: function(dt) {
    if (!this.p.ignoreControls) {
        if(this.p.y < 0) {
          this.p.vy = 0;
        }
        if(this.p.vx > 0) {
          if(this.p.landed > 0) {
            this.play("gerev_walk_right");
          } else {
            if (this.p.vy < 0) {
              this.play("gerev_jump_right");
            } else {
              this.play("gerev_land_right");
            }
          }
          this.p.direction = "right";
        } else if (this.p.vx < 0) {
          if(this.p.landed > 0) {
            this.play("gerev_walk_left");
          } else {
            if (this.p.vy < 0) {
              this.play("gerev_jump_left");
            } else {
              this.play("gerev_land_left");
            }
          }
          this.p.direction = "left";
        } else {
          if (this.p.vy < 0) {
            this.play("gerev_jump_" + this.p.direction);
          } else if (this.p.vy >0) {
            this.play("gerev_land_" + this.p.direction);
          } else {
            this.play("gerev_stand_" + this.p.direction);
          }
        }
    } else {
      this.play("gerev_stand_" + this.p.direction);
    }
  },

  restoreInteraction: function() {
    this.p.ignoreControls = false;
    // this.p.sheet = "gerev_glow";
  },

  stopInteraction: function() {
    this.play("gerev_stand_" + this.p.direction);
    this.p.ignoreControls = true;
    // this.p.sheet = "gerev";
    this.p.vx = 0;
    this.p.vy = 0;
  }      

});

Q.Sprite.extend("Zemer",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "zemer_walk",  // Setting a sprite sheet sets sprite width and height
      sprite: "zemer",
      x: 690,           // You can also set additional properties that can
      y: 650,             // be overridden on object creation
      jumpSpeed: -600
    });



    this.add('2d, platformerControls, animation');

    this.on("jump", function(obj) {
      if (!obj.p.playedJump) {
        Q.audio.play('zemer_jump.mp3');
        obj.p.playedJump = true;
      }
    });

    this.on("jumped", function(obj) {
        obj.p.playedJump = false;
    });

    this.on("hit.sprite",function(collision) {
      var obj = collision.obj;
      if (obj.isA("Switch")) {
        obj.turnOn();
      } 
      if (obj.isA("PowerUp")) {
        if (!this.p.hasPowerUp) {
          Q.audio.play('powerup.mp3');
        }
        this.p.hasPowerUp = true;
        this.p.scale = 1.5;
        obj.p.opacity = 0;
      } 
    });

    this.on("anim.zemer_walk_right", function() {
      Q.audio.play("zemer_walk.mp3");
    });

    this.on("anim.zemer_walk_left", function() {
      Q.audio.play("zemer_walk.mp3");
    });


  },

  step: function(dt) {
    if (!this.p.ignoreControls) {
        if(this.p.y < 0) {
          this.p.vy = 0;
        }
        if(this.p.vx > 0) {
          if(this.p.landed > 0) {
            this.play("zemer_walk_right");
          } else {
            if (this.p.vy < 0) {
              this.play("zemer_jump_right");
            } else {
              this.play("zemer_land_right");
            }
          }
          this.p.direction = "right";
        } else if (this.p.vx < 0) {
          if(this.p.landed > 0) {
            this.play("zemer_walk_left");
          } else {
            if (this.p.vy < 0) {
              this.play("zemer_jump_left");
            } else {
              this.play("zemer_land_left");
            }
          }
          this.p.direction = "left";
        } else {
          if (this.p.vy < 0) {
            this.play("zemer_jump_" + this.p.direction);
          } else if (this.p.vy >0) {
            this.play("zemer_land_" + this.p.direction);
          } 
        }
    } else {
      this.play("zemer_stand_" + this.p.direction);
    }
  },

  restoreInteraction: function() {
    this.p.ignoreControls = false;
    // this.p.sheet = "zemer_glow";
  },

  stopInteraction: function() {
    this.play("zemer_stand_" + this.p.direction);
    this.p.ignoreControls = true;
    // this.p.sheet = "zemer";
    this.p.vx = 0;
    this.p.vy = 0;
  }   

});

Q.Sprite.extend("Radio",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "radio_coloring",  // Setting a sprite sheet sets sprite width and height
      sprite: "radio",
      x: 975,           // You can also set additional properties that can
      y: 571,             // be overridden on object creation
      scale: 0.35
    });
    this.add('2d,animation');
    
    this.p.playedColoringAnimation = false;

    this.on("bump.top",function(collision) {
      var obj = collision.obj;
      if(obj.isA("Stone") && !this.p.playedColoringAnimation) { 
           this.p.playedColoringAnimation = true;
           this.play("radio_coloring");
      } 
    });
  }

});

Q.Sprite.extend("Tv",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "tv",  // Setting a sprite sheet sets sprite width and height
      sprite: "tv",
      x: 1132,           // You can also set additional properties that can
      y: 468,             // be overridden on object creation
      z: 100
    });
    this.add('animation, tween');
    
    this.p.playedMoveAnimation = false;

    this.on("hit.sprite",function(collision) {
      var obj = collision.obj;
      if(obj.isA("Stone") && !this.p.playedMoveAnimation) { 
           this.p.playedMoveAnimation = true;
           this.moveLeft();
           Q.GameStatus.phase = "invitation";
      } 
    });
  },

  moveLeft: function() {
    this.animate({x: -500, y: 468}, 10);
  }

});

// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  Q.audio.enableHTML5Sound();

  // Add in a repeater for a little parallax action
  //stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));
  // var clouds = stage.insert(new Q.Sprite({ sheet: "clouds", x: 450, y: 100}));

  // Add in a tile layer, and make it the collision layer
  var tileLayer = new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' });
  stage.collisionLayer(tileLayer);

  // var radio = Q.radio = stage.insert(new Q.Radio());
  var tv = Q.tv = stage.insert(new Q.Tv());

  switches = [
    {
      x: 2, 
      y: 19, 
      changes: [{x: 27, y: 17, to: 0}]
    },
    {
      x: 16, 
      y: 19, 
      changes: [{x: 5, y: 18, to: 0}, {x: 5, y: 19, to: 0}, {x: 5, y: 20, to: 0}]
    },
    {
      x: 26, 
      y: 15,  
      changes: [{x: 12, y: 18, to: 2}, {x: 13, y: 20, to: 2}, {x: 13, y: 21, to: 1}]
    },
    {
      x: 10, 
      y: 15, 
      changes: [{x: 24, y: 16, to: 0}, {x: 24, y: 15, to: 0}, {x: 24, y: 14, to: 0}]
    },
    {
      x: 26, 
      y: 11, 
      changes: [{x: 2, y: 15, to: 2}]
    },
    {
      x: 3, 
      y: 11, 
      changes: [{x: 26, y: 9, to: 0}, {x: 27, y: 9, to: 0}]
    },
    {
      x: 23, 
      y: 7, 
      changes: [{x: 5, y: 13, to: 2}]
    },
    {
      x: 11, 
      y: 11, 
      changes: [{x: 21, y: 6, to: 0}, {x: 21, y: 7, to: 0}, {x: 21, y: 8, to: 0}, {x: 21, y: 9, to: 2}]
    },
    {
      x: 19, 
      y: 15, 
      changes: [{x: 13, y: 11, to: 2}]
    },
    {
      x: 2, 
      y: 7, 
      changes: [{x: 17, y: 9, to: 0}]
    },
    {
      x: 16, 
      y: 7, 
      changes: [{x: 7, y: 8, to: 2}, {x: 8, y: 6, to: 2}]
    }
  ];

  for (var i = 0; i < switches.length; i++) {
    var currSwitch = stage.insert(new Q.Switch({x: switches[i].x * 32 + 16, y: switches[i].y * 32 + 16, board: tileLayer, changes: switches[i].changes}));
  }

  var carrot = stage.insert(new Q.PowerUp({x: 417, y: 37, asset: 'carrot.png'}));
  var cabbage = stage.insert(new Q.PowerUp({x: 576, y: 134, asset: 'cabbage.png'}));

  var stone = stage.insert(new Q.Stone());

  var currentRabbitLabel = stage.insert(new Q.UI.Text({x:150, y: 10, 
                                                   label: ":ארנב פעיל" }));

  var currentRabbitLogo = Q.currentRabbitLogo = stage.insert(new Q.Sprite({x: 75, y: 24, asset: "gerev.png", sensor: true}));

  Q.instructions = stage.insert(new Q.Sprite({x: 512, y: 340, asset: "instructions1.png", sensor: true}));

  /*
  stage.insert(new Q.UI.Text({x:750, y: 13, opacity: 1, label: "הזזת ארנב" }));
  stage.insert(new Q.Sprite({x: 850, y: 28, scale: 0.5, opacity: 1, asset: "arrows.png", sensor: true}));

  stage.insert(new Q.UI.Text({x:740, y: 51, opacity: 1, label: "החלפת ארנב" }));
  stage.insert(new Q.Sprite({x: 850, y: 66, scale: 0.5, asset: "spacebar.png", sensor: true}));
  */

  // Create the player and add them to the stage
  var gerev = Q.gerev = stage.insert(new Q.Gerev());
  var zemer = Q.zemer = stage.insert(new Q.Zemer());
  gerev.p.direction = 'left';
  zemer.p.direction = 'left';
  gerev.stopInteraction();
  zemer.stopInteraction();

});

Q.load(
  "background_music.mp3, gerev_jump.mp3, gerev_walk.mp3, powerup.mp3, press_switch.mp3, pushing_stone.mp3, switch_rabbit.mp3, zemer_jump.mp3, zemer_walk.mp3, tiles.png, instructions1.png, spacebar.png, arrows.png, gerev.png, gerev_glow.png, gerev_walk.png, gerev_walk.json, zemer_walk.png, zemer_walk.json, zemer.png, zemer_glow.png, carrot.png, stone.png, cabbage.png, ladder.png, on_switch.png, off_switch.png, background-wall.png, level.json, mmc_map_clouds.png, tv.png, radio.png, radio_color.json, radio_color.png", 
  function() {
    Q.compileSheets("zemer_walk.png","zemer_walk.json");
    Q.compileSheets("gerev_walk.png","gerev_walk.json");
    Q.compileSheets("radio_color.png","radio_color.json");

    // Sprites sheets can be created manually
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
    Q.sheet("radio","radio.png", { tilew: 252, tileh: 217 });
    Q.sheet("tv","tv.png", { tilew: 408, tileh: 281 });
    Q.sheet("clouds","mmc_map_clouds.png", { tilew: 800, tileh: 250 });
    Q.sheet("gerev_glow","gerev_glow.png", { tilew: 32, tileh: 32 });
    Q.sheet("zemer_glow","zemer_glow.png", { tilew: 32, tileh: 32 });
    Q.sheet("ladder","ladder.png", { tilew: 32, tileh: 32 });
    Q.sheet("stone","stone.png", { tilew: 32, tileh: 32 });
    Q.sheet("on_switch","on_switch.png", { tilew: 32, tileh: 32 });
    Q.sheet("off_switch","off_switch.png", { tilew: 32, tileh: 32 });
    Q.sheet("carrot","carrot.png", { tilew: 32, tileh: 32 });
    Q.sheet("cabbage","cabbage.png", { tilew: 32, tileh: 32 });

    // Or from a .json asset that defines sprite locations
    // Q.compileSheets("sprites.png","sprites.json");

    Q.animations("zemer", {
      zemer_walk_left: { frames: [0,1,2,3,4,5], rate: 1/15, flip: false, loop: false},
      zemer_walk_right: { frames: [0,1,2,3,4,5], rate: 1/15, flip: "x", loop: false},
      zemer_jump_left: { frames: [3], rate: 1/15, flip: false, loop: false},
      zemer_jump_right: { frames: [3], rate: 1/15, flip: "x", loop: false},
      zemer_land_left: { frames: [0], rate: 1/15, flip: false, loop: false},
      zemer_land_right: { frames: [0], rate: 1/15, flip: "x", loop: false},
      zemer_stand_left: { frames: [5], rate: 1/15, flip: false, loop: false},
      zemer_stand_right: { frames: [5], rate: 1/15, flip: "x", loop: false}
    });

    Q.animations("gerev", {
      gerev_walk_left: { frames: [0,1,2,3,4,5], rate: 1/15, flip: false, loop: false},
      gerev_walk_right: { frames: [0,1,2,3,4,5], rate: 1/15, flip: "x", loop: false},
      gerev_jump_left: { frames: [3], rate: 1/15, flip: false, loop: false},
      gerev_jump_right: { frames: [3], rate: 1/15, flip: "x", loop: false},
      gerev_land_left: { frames: [0], rate: 1/15, flip: false, loop: false},
      gerev_land_right: { frames: [0], rate: 1/15, flip: "x", loop: false},
      gerev_stand_left: { frames: [5], rate: 1/15, flip: false, loop: false},
      gerev_stand_right: { frames: [5], rate: 1/15, flip: "x", loop: false}
    });

    Q.animations("radio", {
      radio_coloring: { frames: [0,0,1,1,2,2,3,3,4,4,0,0,1,1,2,2,3,3,4,4], rate: 1/8, flip: false, loop: false}
    });

    // Finally, call stageScene to run the game
    Q.stageScene("level1");

//     Q.audio.play("background_music.mp3", {loop: true});

});

Q.el.addEventListener('keydown',function(e) {
  if (Q.GameStatus.phase == "instructions") {
    Q.GameStatus.phase = "game";
    Q.instructions.p.opacity = 0.0;
//     Q.audio.stop("background_music.mp3");
    Q.gerev.restoreInteraction();
  }
  if (e.code=='Space' && Q.GameStatus.phase == "game") {
    Q.audio.play('switch_rabbit.mp3');
    Q.GameStatus.currentPlayer = Q.GameStatus.currentPlayer == "Gerev" ? "Zemer" : "Gerev";
    Q.currentRabbitLogo.p.asset = Q.GameStatus.currentPlayer.toLowerCase() + ".png";
    if (Q.GameStatus.currentPlayer == "Zemer") {
      Q.zemer.restoreInteraction();
    } else {
      Q.zemer.stopInteraction();
    }
    if (Q.GameStatus.currentPlayer == "Gerev") {
      Q.gerev.restoreInteraction();
    } else {
      Q.gerev.stopInteraction();
    }
  }
});


});

