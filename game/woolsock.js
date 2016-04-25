window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

Q.Sprite.extend("Switch", {

  init: function(p) {
    this._super(p, { 
      sheet: 'off_switch',
      sensor: true
    });
  },

  turnOn: function() {
    this.p.sheet = "on_switch";
  },

  turnOff: function() {
    this.p.sheet = "off_switch";
  }

});



// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Gerev",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "gerev",  // Setting a sprite sheet sets sprite width and height
      x: 650,           // You can also set additional properties that can
      y: 650,             // be overridden on object creation
      jumpSpeed: -280
    });

    // Add in pre-made components to get up and running quickly
    // The `2d` component adds in default 2d collision detection
    // and kinetics (velocity, gravity)
    // The `platformerControls` makes the player controllable by the
    // default input actions (left, right to move,  up or action to jump)
    // It also checks to make sure the player is on a horizontal surface before
    // letting them jump.
    this.add('2d, platformerControls');

    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite

    this.on("jumping",function() {
      if (this.p.hasZemer) {
      }
      if (collision.obj.isA("Zemer")) {  
        collision.obj.p.vy = this.p.vy;
      } 
    });

    this.on("hit.sprite",function(collision) {

      if (collision.obj.isA("Switch")) {
        collision.obj.turnOn();
      } 
    });

  },

  step: function(dt) {
        if(Q.inputs['left'] && this.p.direction == 'right') {
            this.p.flip = false;
        } 
        if(Q.inputs['right']  && this.p.direction == 'left') {
            this.p.flip = 'x';                    
        }
    }   

});

Q.Sprite.extend("Zemer",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sheet: "zemer",  // Setting a sprite sheet sets sprite width and height
      x: 660,           // You can also set additional properties that can
      y: 650,             // be overridden on object creation
      jumpSpeed: -600
    });

    // Add in pre-made components to get up and running quickly
    // The `2d` component adds in default 2d collision detection
    // and kinetics (velocity, gravity)
    // The `platformerControls` makes the player controllable by the
    // default input actions (left, right to move,  up or action to jump)
    // It also checks to make sure the player is on a horizontal surface before
    // letting them jump.
    this.add('2d, platformerControls2');

    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite
    this.on("jump", function(entity) {
        
    });

    this.on("bump.bottom",function(collision) {

      if (collision.obj.isA("Gerev")) {
        //this.p.sensor = true;
        this.p.x = collision.obj.p.x;
        this.p.y = collision.obj.p.y - 32; 
      } 
    });

    this.on("hit.sprite",function(collision) {

      if (collision.obj.isA("Switch")) {
        collision.obj.turnOn();
      } 
    });

  }

});

// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var gerev = stage.insert(new Q.Gerev());
  var zemer = stage.insert(new Q.Zemer());

  var floor1switch = stage.insert(new Q.Switch({x: 80, y: 720}));

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  // stage.add("viewport").follow(player);

  // // Add in a couple of enemies
  // stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  // stage.insert(new Q.Enemy({ x: 800, y: 0 }));

  // // Finally add in the tower goal
  // stage.insert(new Q.Tower({ x: 180, y: 50 }));
});

Q.load(
  "tiles.png, gerev.png, zemer.png, ladder.png, on_switch.png, off_switch.png, background-wall.png, level.json", 
  function() {
    // Sprites sheets can be created manually
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
    Q.sheet("gerev","gerev.png", { tilew: 32, tileh: 32 });
    Q.sheet("zemer","zemer.png", { tilew: 32, tileh: 32 });
    Q.sheet("ladder","ladder.png", { tilew: 32, tileh: 32 });
    Q.sheet("on_switch","on_switch.png", { tilew: 32, tileh: 32 });
    Q.sheet("off_switch","off_switch.png", { tilew: 32, tileh: 32 });

    // Or from a .json asset that defines sprite locations
    // Q.compileSheets("sprites.png","sprites.json");

    // Finally, call stageScene to run the game
    Q.stageScene("level1");
});



});

