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
	
	// player variables
	this.player = new Player(0.5, 0.5, 1/10, 1/9);
	this.levelID = 0; // Current level ID

	// level variables
	this.switching = 0; // 0, 1=left, 2=right, 3=up, 4=down
	this.screen_switch_time = 0.7; // seconds
	this.mapID = "dungeon1";

	this.levelContent = new Array().concat(world.maps[this.mapID].getLevelElements(this.levelID)); // Current level content
	this.tmpLevelContent = new Array(); // Temporary level content for transitions

	this.debug_text = new Text("Debug: ", 0.0, 0.05, color="white",  fontSize=6, fontFamily="'tiny5'", ctx=this.context);
	this.debug_background = new BackgroundElement(0, 0, 0.29, 0.8, "ground", false, texture=null, color="rgba(0, 0, 0, 0.5)");
	
	this.context.imageSmoothingEnabled = false;

}


Scene.prototype.update = function(deltaTime)
{
	// game is stopped, we need to stop the time updates
	if(this.stop) {
		return;
	}
	// level time update
	this.level(deltaTime);
}

// This function is responsible for updating the level content and checking for level transitions
// It can stop the time updates for the scene (transitions, menu screen, etc.)
Scene.prototype.level = function(deltaTime)
{
	// Update Player
	this.player.update(deltaTime);

	this.levelContent.forEach((element) => {
		if (typeof element.update === "function") {
			element.update(deltaTime);
		}
	});

	// level safe checks
	this.checkSafe();

	// Check for collisions with level elements
	this.collisions();
}

Scene.prototype.collisions = function()
{
	// Check if the player is colliding with any of the level elements
	this.levelContent.forEach((element) => {
		if (element.type==="door") {
			if (!element.isActive()) return; // Skip if the door is not active
			if (this.player.collidesWith(element)) {
				this.player.setPosition(element.door.x, element.door.y); // place user on new door position 
				this.levelTransition(this.levelID, element.getDestination(), this.currentTime);
			}
		}
		// else if (element.type==="enemy") {
		// 	if (this.player.collidesWith(element)) {
		// 		console.log("Collision with enemy detected!");
		// 		this.player.die(); // Handle player death
		// 	}
		// }
	});

	// Check if the player is trying to leave the screen on one of the sides
	let margins = this.checkMarginCollision(); // Check for margin collision
	if(margins.colliding) {
		// If the player is trying to leave the screen, transition to the adjacent level
		// Get the adjacent level ID based on the current level ID and direction
		this.player.setPosition(0.5, 0.5); // Reset player position
		this.player.lastPosition = {x: this.player.x, y: this.player.y};  // save last position
		this.levelTransition(this.levelID, margins.destination, this.currentTime);
	}
}

Scene.prototype.checkSafe= function()
{
	// Check if the player is colliding with any of the level elements
	this.levelContent.forEach((element) => {
		if (element.type==="door" && !element.isActive() && !element.isColliding(this.player.x, this.player.y, this.player.width, this.player.height)) {
				element.activate(); // Activate the door if the player is not colliding with it
		}
		// else if (element.type==="enemy") {
		// 	if (this.player.collidesWith(element)) {
		// 		console.log("Collision with enemy detected!");
		// 		this.player.die(); // Handle player death
		// 	}
		// }
	});
}

/**
 * 
 * @returns {number} adjacent level ID
 */
Scene.prototype.checkMarginCollision = function()
{
	// Check if the player is trying to leave the screen on one of the sides
	if(this.player.x < 0.0) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).left
	}  // left side
	if(this.player.x > (1.0-1/10)) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).right
	}  // right side
	if(this.player.y < 0.0) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).top
	}  // up side
	if(this.player.y > (1.0-1/9)) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).bottom
	}// down side
	return {colliding: false, destination: -1}; // no collision
}

Scene.prototype.levelTransition = function(from, to, deltaTime)
{
	// Transition from one level to another
	// This function is responsible for the transition animation between levels
	// It can be a fade out, slide, etc.
	// It should return when the transition is done and the new level is loaded
	this.switching = 0; // Reset switching state
	this.levelID = to;
	this.levelContent = new Array().concat(world.maps[this.mapID].getLevelElements(to)); // Load new level content

	// Initialize level contents
	this.levelContent.forEach((element) => {
		if (element.type==="door") { // Prevent instant teleportation when loading a level
				element.safeCheck(this.player.x, this.player.y, this.player.width, this.player.height); 
		}
	});
}

// Scene function to transform (0,0) to (1,1) normalized coordinates to canvas coordinates
Scene.prototype.transform = function(x, y)
{
	return [x*this.canvas.width_px, y*this.canvas.height_px];
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


