window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

Q.GameStatus = {
  currentPlayer: "Gerev"
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
    this.p.sheet = "on_switch";

    this.changeBack = [];
    for (var i = 0; i < this.changes.length; i++) {
      this.board.setTile(this.changes[i].x, this.changes[i].y, this.changes[i].to);
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
           this.p.vx = 100;
         }
      }
    });

    this.on("bump.bottom",function(collision) {
      var obj = collision.obj;
      if(obj.isA("Erez")) { 
           this.p.vy -= 50 * (collision.impact/150);
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
      sheet: "gerev",  // Setting a sprite sheet sets sprite width and height
      x: 450,           // You can also set additional properties that can
      y: 650,             // be overridden on object creation
      jumpSpeed: -380
    });

    this.add('2d, platformerControls');

    this.on("hit.sprite",function(collision) {

      var obj = collision.obj;
      if (obj.isA("Switch")) {
        obj.turnOn();
      } 
      if (obj.isA("PowerUp")) {
        this.p.hasPowerUp = true;
        this.p.scale = 1.5;
        obj.p.opacity = 0;
      } 
    });

  },

  step: function(dt) {
    if (!this.p.ignoreControls) {
        if(Q.inputs['left'] && this.p.direction == 'right') {
            this.p.flip = false;
        } 
        if(Q.inputs['right']  && this.p.direction == 'left') {
            this.p.flip = 'x';                    
        }
    }
  },

  restoreInteraction: function() {
    this.p.ignoreControls = false;
    this.p.sheet = "gerev_glow";
  },

  stopInteraction: function() {
    this.p.ignoreControls = true;
    this.p.sheet = "gerev";
    this.p.vx = 0;
    this.p.vy = 0;
  }      

});

Q.Sprite.extend("Zemer",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "zemer",  // Setting a sprite sheet sets sprite width and height
      x: 690,           // You can also set additional properties that can
      y: 650,             // be overridden on object creation
      jumpSpeed: -600
    });



    this.add('2d, platformerControls');

    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite
    this.on("jump", function(entity) {
        
    });

    this.on("hit.sprite",function(collision) {
      var obj = collision.obj;
      if (obj.isA("Switch")) {
        obj.turnOn();
      } 
      if (obj.isA("PowerUp")) {
        this.p.hasPowerUp = true;
        this.p.scale = 1.5;
        obj.p.opacity = 0;
      } 
    });


  },

  step: function(dt) {
    if (!this.p.ignoreControls) {
        if(Q.inputs['left'] && this.p.direction == 'right') {
            this.p.flip = false;
        } 
        if(Q.inputs['right']  && this.p.direction == 'left') {
            this.p.flip = 'x';                    
        }
    }
  },

  restoreInteraction: function() {
    this.p.ignoreControls = false;
    this.p.sheet = "zemer_glow";
  },

  stopInteraction: function() {
    this.p.ignoreControls = true;
    this.p.sheet = "zemer";
    this.p.vx = 0;
    this.p.vy = 0;
  }   

});

Q.Sprite.extend("Erez",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "erez",  // Setting a sprite sheet sets sprite width and height
      x: 1295,           // You can also set additional properties that can
      y: 608,             // be overridden on object creation
      scale: 0.3
    });
  }

});

// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  var tileLayer = new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' });
  stage.collisionLayer(tileLayer);

  var erez = Q.erez = stage.insert(new Q.Erez());

  // Create the player and add them to the stage
  var gerev = Q.gerev = stage.insert(new Q.Gerev());
  var zemer = Q.zemer = stage.insert(new Q.Zemer());
  gerev.p.direction = 'left';
  zemer.p.direction = 'left';
  gerev.restoreInteraction();
  zemer.stopInteraction();

  /*

Switch1: 22 by 2 => opens up (31, 19) and (32, 19)
Switch2: 22 by 20 => opens up (7, 19), (7, 20), (7, 21), (7, 22)
Switch3: 34 by 19 => adds up (16, 20), (17, 18)
Switch4: 13 by 17 => opesn up (30, 15), (30, 16), (30, 17), (30, 18)
Switch5: 31 by 12 => adds up (1, 17), (1, 15)
Switch6: 5 by 12 => opens up (34, 9), (35, 9)
Swtich7: 29 by 7 => adds up (8, 14)
Switch8: 13 by 12 => opens up (27, 5), (27, 6), (27, 7), (27, 8)
Switch9: 27 by 17 => adds up (17 ,12), (16, 10)
Swtich10: 3 by 7 => opens up (21, 9), (22, 9)
Switch11: 20 by 7 => adds up (7, 7), (8, 5)

*/

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
      changes: [{x: 12, y: 18, to: 1}, {x: 13, y: 20, to: 1}]
    },
    {
      x: 10, 
      y: 15, 
      changes: [{x: 24, y: 16, to: 0}, {x: 24, y: 15, to: 0}, {x: 24, y: 14, to: 0}]
    },
    {
      x: 26, 
      y: 11, 
      changes: [{x: 1, y: 15, to: 1}]
    },
    {
      x: 3, 
      y: 11, 
      changes: [{x: 26, y: 9, to: 0}, {x: 27, y: 9, to: 0}]
    },
    {
      x: 23, 
      y: 7, 
      changes: [{x: 5, y: 13, to: 1}]
    },
    {
      x: 11, 
      y: 11, 
      changes: [{x: 21, y: 6, to: 0}, {x: 21, y: 7, to: 0}, {x: 21, y: 8, to: 0}]
    },
    {
      x: 19, 
      y: 15, 
      changes: [{x: 13, y: 11, to: 1}]
    },
    {
      x: 2, 
      y: 7, 
      changes: [{x: 17, y: 9, to: 0}]
    },
    {
      x: 16, 
      y: 7, 
      changes: [{x: 7, y: 8, to: 1}, {x: 8, y: 6, to: 1}]
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

  stage.insert(new Q.UI.Text({x:750, y: 13, opacity: 1, label: "הזזת ארנב" }));
  stage.insert(new Q.Sprite({x: 850, y: 28, scale: 0.5, opacity: 1, asset: "arrows.png", sensor: true}));

  stage.insert(new Q.UI.Text({x:740, y: 51, opacity: 1, label: "החלפת ארנב" }));
  stage.insert(new Q.Sprite({x: 850, y: 66, scale: 0.5, asset: "spacebar.png", sensor: true}));

});

Q.load(
  "tiles.png, spacebar.png, arrows.png, erez.png, gerev.png, gerev_glow.png, zemer.png, zemer_glow.png, carrot.png, stone.png, cabbage.png, ladder.png, on_switch.png, off_switch.png, background-wall.png, level.json", 
  function() {
    // Sprites sheets can be created manually
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
    Q.sheet("erez","erez.png", { tilew: 420, tileh: 647 });
    Q.sheet("gerev","gerev.png", { tilew: 32, tileh: 32 });
    Q.sheet("gerev_glow","gerev_glow.png", { tilew: 32, tileh: 32 });
    Q.sheet("zemer","zemer.png", { tilew: 32, tileh: 32 });
    Q.sheet("zemer_glow","zemer_glow.png", { tilew: 32, tileh: 32 });
    Q.sheet("ladder","ladder.png", { tilew: 32, tileh: 32 });
    Q.sheet("stone","stone.png", { tilew: 32, tileh: 32 });
    Q.sheet("on_switch","on_switch.png", { tilew: 32, tileh: 32 });
    Q.sheet("off_switch","off_switch.png", { tilew: 32, tileh: 32 });
    Q.sheet("carrot","carrot.png", { tilew: 32, tileh: 32 });
    Q.sheet("cabbage","cabbage.png", { tilew: 32, tileh: 32 });

    // Or from a .json asset that defines sprite locations
    // Q.compileSheets("sprites.png","sprites.json");

    // Finally, call stageScene to run the game
    Q.stageScene("level1");

});

Q.el.addEventListener('keydown',function(e) {
  if (e.code=='Space') {
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

