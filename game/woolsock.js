window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

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
  // var player = stage.insert(new Q.Player());

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  // stage.add("viewport").follow(player);

  // // Add in a couple of enemies
  // stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  // stage.insert(new Q.Enemy({ x: 800, y: 0 }));

  // // Finally add in the tower goal
  // stage.insert(new Q.Tower({ x: 180, y: 50 }));
});

Q.load("tiles.png, background-wall.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  // Or from a .json asset that defines sprite locations
  // Q.compileSheets("sprites.png","sprites.json");

  // Finally, call stageScene to run the game
  Q.stageScene("level1");
});



});

