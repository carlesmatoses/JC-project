

// Scene. Updates and draws a single scene of the game.
// This class manages the screen using a normalized coordinate system where:
// - (0, 0) represents the top-left corner of the screen.
// - (1, 1) represents the bottom-right corner of the screen.
// All elements are positioned and scaled relative to this normalized space.
// The scene is responsible for updating and drawing all elements in the game.
// The scene is responsible from controlling the level and the player

function Scene()
{
	// Set canvas dimensions 
	this.canvas = document.getElementById("game-layer");
	this.context = this.canvas.getContext("2d");
	
	this.size_multiply = 4;
	this.canvas.width = 160*this.size_multiply;
	this.canvas.height = 144*this.size_multiply;

	this.frameCount=0;
	this.lag=0;

	this.UI = new UI();
	
	// Store current time
	this.currentTime = 0

	this.levelID = 4; // Current level ID
	this.switching = 0; // 0, 1=left, 2=right, 3=up, 4=down
	this.levelContent = new Array().concat(map[this.levelID]); // Current level content

	this.player = new Player(0.5, 0.5, 1/10, 1/9);
	this.debug_text = new Text("Debug: ", 0.0, 0.05, color="white",  fontSize=6, fontFamily="'tiny5'", ctx=this.context);
	this.debug_background = new BackgroundElement(0, 0, 0.29, 0.8, "ground", false, texture=null, color="rgba(0, 0, 0, 0.5)");
	
	this.context.imageSmoothingEnabled = false;

}


Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	this.currentTime += deltaTime;

	// Player movement
	let direction = { x: 0, y: 0 };

	if (keyboard[37]) direction.x += -1; // Left arrow
	if (keyboard[39]) direction.x += 1;  // Right arrow
	if (keyboard[38]) direction.y += -1; // Up arrow
	if (keyboard[40]) direction.y += 1;  // Down arrow

	this.player.setDirection(direction.x, direction.y);

	// reset direction if no key is pressed
	if(!keyboard[37] && !keyboard[39] && !keyboard[38] && !keyboard[40]) this.player.setDirection(0, 0);

	// level time update
	this.level(deltaTime);

}

Scene.prototype.switchLevel = function(levelID){
	// To switch a new level we load the new level and current level.
	// The levels will be translated to leave and enter the screen.

	let currentLevel = map[this.levelID];
	let newLevel = map[levelID];
	let timeTransition = 0.5; // seconds
	let transitionSpeed = 1 / timeTransition; // pixels per second

	currentLevel.forEach((element) => {
		element.translatePosition(.01, 0);
	});

	newLevel.forEach((element) => {
		element.translatePosition(-.01, 0);
	});

}


Scene.prototype.level = function(deltaTime)
{
	if(this.switching)	{
		// move the caracter to the correspnding margin
		var lev = getAdjacentLevels(this.levelID);
		if (!this.switchStartTime) {
			this.switchStartTime = this.currentTime; // Record the time when switching started
		}
		if (this.currentTime - this.switchStartTime <= (0.5*1000)) { // Check if 0.5 seconds have passed
			switch (this.switching) {
				case 1:
					this.levelID = lev.left;
					this.player.setPosition(1 - (1 / 10), this.player.y);
					this.switching = 5;
					return;
				case 2:
					this.levelID = lev.right;
					this.player.setPosition(0.0, this.player.y);
					this.switching = 5;
					return;
				case 3:
					this.levelID = lev.top;
					this.player.setPosition(this.player.x, 1 - (1 / 9));
					this.switching = 5;
					return;
				case 4:
					this.levelID = lev.bottom;
					this.player.setPosition(this.player.x, 0.0);
					this.switching = 5;
					return;
				default:
					return;
			}
		}
		this.switching = 0; // Reset switching state
		this.switchStartTime = null; // Reset the start time
		this.levelContent = new Array().concat(map[this.levelID]);
		return;
	}

	// Update Player
	this.player.update(deltaTime);

	// check if the user is trying to leave the screen on one of the sides
	if(this.player.x < 0.0) this.switching = 1;  // left side
	if(this.player.x > 1.0) this.switching = 2;  // right side
	if(this.player.y < 0.0) this.switching = 3;  // up side
	if(this.player.y > 1.0) this.switching = 4;  // down side

	// udpate elements in the scene

}

Scene.prototype.draw = function ()
{
	// Clear background
	this.context.fillStyle = "rgb(224, 224, 240)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw all scene elements of level
	this.levelContent.forEach((element) => {
		element.draw(this.context);
	});
	// Draw player
	this.player.draw(this.context);

	if(keyboard[32])
	{
		text = "Spacebar pressed";
		var textSize = context.measureText(text);
		context.fillText(text, 0, 0);
	}

	// CONTROLS
	
	// Draw debug
	this.debug_background.draw(this.context);
	this.debug_text.update("Debug:\n" + 
					  "  X: " + this.player.x.toFixed(1) + "\n" + 
					  "  Y: " + this.player.y.toFixed(1) + "\n" + 
					  "  FrameCount: " + this.frameCount + "\n" +
					  "  lag: " + this.lag.toFixed(1) + " ms" + "\n" +
					  "  levelID: " + this.levelID + "\n" 

					);
	this.debug_text.draw(this.context);
}

// Scene function to transform (0,0) to (1,1) normalized coordinates to canvas coordinates
Scene.prototype.transform = function(x, y)
{
	return [x*this.canvas.width_px, y*this.canvas.height_px];
}

