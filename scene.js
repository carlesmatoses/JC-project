

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

	// internal variables
	this.frameCount=0;
	this.lag=0;
	this.currentTime = 0
	this.stop = false; // When we talk to characters, 

	this.UI = new UI();
	
	this.levelID = 4; // Current level ID
	this.switching = 0; // 0, 1=left, 2=right, 3=up, 4=down
	this.screen_switch_time = 0.7; // seconds
	this.levelContent = new Array().concat(map[this.levelID]); // Current level content
	this.player = new Player(0.5, 0.5, 1/10, 1/9);
	this.debug_text = new Text("Debug: ", 0.0, 0.05, color="white",  fontSize=6, fontFamily="'tiny5'", ctx=this.context);
	this.debug_background = new BackgroundElement(0, 0, 0.29, 0.8, "ground", false, texture=null, color="rgba(0, 0, 0, 0.5)");
	
	this.context.imageSmoothingEnabled = false;

}


Scene.prototype.update = function(deltaTime)
{
	// Player movement control
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

// This function is responsible for updating the level content and checking for level transitions
// It can stop the time updates for the scene (transitions, menu screen, etc.)
Scene.prototype.level = function(deltaTime)
{
	// game is stopped, we need to stop the time updates
	if(this.stop) {
		return;
	}
	// In case we are changing levels, we need to stop udpating the level. 
	// That is why we enter this if statement and return null.
	if(this.switching)	{
		// We start the transition timer
		if (!this.switchStartTime) {
			this.switchStartTime = this.currentTime; // Record the time when switching started
		}
		// Check if the time since the switch started is less than the screen switch time
		// If so, we need to translate level content
		if (this.currentTime - this.switchStartTime <= (this.screen_switch_time*1000)) { // Check if 0.5 seconds have passed
			let factor = (this.currentTime - this.switchStartTime) / 1000 * (1/this.screen_switch_time); // Calculate the elapsed time in seconds
			this.levelContent.forEach((element) => {element.resetPosition()});
			this.player.resetPosition(); // Reset the player position
			
			switch (this.switching) {
				case 1:
					this.levelID = getAdjacentLevels(this.levelID).left;
					this.levelContent = map[this.levelID].concat(this.levelContent); 
					this.switching = 5;
					break;
				case 2:
					this.levelID = getAdjacentLevels(this.levelID).right;
					this.levelContent = map[this.levelID].concat(this.levelContent); 
					this.switching = 6;
					break;
				case 3:
					this.levelID = getAdjacentLevels(this.levelID).top;
					this.levelContent = map[this.levelID].concat(this.levelContent); 
					this.switching = 7;
					break;
				case 4:
					this.levelID = getAdjacentLevels(this.levelID).bottom;
					this.levelContent = map[this.levelID].concat(this.levelContent); 
					this.switching = 8;
					break;
				case 5:
					this.player.setPosition((1 - (1.01 / 10))*factor, this.player.y);
					this.levelContent.forEach((element) => {
						element.translatePosition(factor, 0);
					});
					map[this.levelID].forEach((element) => {
						element.translatePosition(-1,0);
					});
					break;
				case 6:
					this.player.setPosition((1 - (1.01 / 10))*(1 - factor), this.player.y);
					this.levelContent.forEach((element) => {
						element.translatePosition(-factor, 0);
					});
					map[this.levelID].forEach((element) => {
						element.translatePosition(1,0);
					});
					break;
				case 7:
					this.player.setPosition(this.player.x, (1 - (1.01 / 9))*factor);
					this.levelContent.forEach((element) => {
						element.translatePosition(0, factor);
					});
					map[this.levelID].forEach((element) => {
						element.translatePosition(0,-1);
					});
					break;
				case 8:
					this.player.setPosition(this.player.x, (1 - (1.01 / 9))*(1 - factor));
					this.levelContent.forEach((element) => {
						element.translatePosition(0, -factor);
					});
					map[this.levelID].forEach((element) => {
						element.translatePosition(0,1);
					});
					break;
				default:
					break;
			}
			return;
		}
		// Once the transition is done, we need to reset the level content
		this.levelContent.forEach((element) => {element.resetPosition()}); // Reset the position of old screen
		this.switching = 0; // Reset switching state
		this.switchStartTime = null; // Reset the start time
		this.levelContent = new Array().concat(map[this.levelID]); // Load new level content
		return;
	}

	// Update Player
	this.player.update(deltaTime);

	// check if the user is trying to leave the screen on one of the sides
	if(this.player.x < 0.0) {this.switching = 1};  // left side
	if(this.player.x > (1.0-1/10)) this.switching = 2;  // right side
	if(this.player.y < 0.0) this.switching = 3;  // up side
	if(this.player.y > (1.0-1/9)) this.switching = 4;  // down side
	if (this.switching){
		this.player.lastPosition = {x: this.player.x, y: this.player.y};  // save last position
	};
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
		let text_obj = new Text(text, 0.5, 0.5, color="blue",  fontSize=8, fontFamily="'tiny5'", ctx=this.context);
		text_obj.draw(this.context);
	}

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

