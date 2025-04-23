// Scene. Updates and draws a single scene of the game.
// This class manages the screen using a normalized coordinate system where:
// - (0, 0) represents the top-left corner of the screen.
// - (1, 1) represents the bottom-right corner of the screen.
// All elements are positioned and scaled relative to this normalized space.
// The scene is responsible for updating and drawing all elements in the game.
// The scene is responsible from controlling the level and the player

class Scene{
constructor()
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

	this.debug_text = new Text("Debug: ", 0.0, 0.05, "white",  6, "'tiny5'", this.context);
	this.debug_background = new BackgroundElement(0, 0, 0.29, 0.8, "ground", false, texture=null, color="rgba(0, 0, 0, 0.5)");
	
	this.context.imageSmoothingEnabled = false;

}


update(deltaTime)
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
level(deltaTime)
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

	// if "f" pressed, check for interaction with level elements
	if (keyboard[70]) {
		if (!this.fKeyState || this.fKeyState.released) {
			this.player.collidesWithHand(this.levelContent);
		}
		this.fKeyState = { down: true, pressed: false, released: false };
	} else {
		this.fKeyState = { down: false, pressed: false, released: true };
	}
}

collisions()
{
	// Check if the player is colliding with any of the level elements of type [door, chest]
	for (let element of this.levelContent) {
		if (element.type==="door") {
			if (element.isActive()) {
				if (this.player.collidesWith(element)) {
					console.log("Door collision detected!");
					this.levelTransitionDoorAnimation(element.getDestination(), {x:element.door.x, y:element.door.y});
					return; // Exit the loop if a collision is detected
				}
			}
		}
	}

		// else if (element.type==="enemy") {
		// 	if (this.player.collidesWith(element)) {
		// 		console.log("Collision with enemy detected!");
		// 		this.player.die(); // Handle player death
		// 	}
		// }

	// Check if the player is trying to leave the screen on one of the sides
	let margins = this.checkMarginCollision(); // Check for margin collision
	if(margins.colliding) {
		// If the player is trying to leave the screen, transition to the adjacent level
		// Get the adjacent level ID based on the current level ID and direction
		this.player.lastPosition = {x: this.player.x, y: this.player.y};  // save last position
		this.levelTransitionMarginAnimation(
			this.levelContent,
			world.maps[this.mapID].getLevelElements(margins.destination),
			{ x: this.player.x, y: this.player.y, wx:0,wy:0}, // old position
			this.newPositionMargins(margins.side), // new position
			this.currentTime,
			margins.destination,
			0.4
		); // Call the transition function
	}

	// Check for collisions with level elements
	this.levelContent.forEach((element) => {
		if (!element.isWalkable) {
			this.resolveCollision(this.player, element); // Resolve collision with enemies
		}
	});
}

isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
resolveCollision(player, object) {
    if (object.isWalkable || !this.isColliding(player, object)) return;

    const dx = (player.x + player.width / 2) - (object.x + object.width / 2);
    const dy = (player.y + player.height / 2) - (object.y + object.height / 2);
    const widthOverlap = (player.width + object.width) / 2 - Math.abs(dx);
    const heightOverlap = (player.height + object.height) / 2 - Math.abs(dy);

    if (widthOverlap < heightOverlap) {
        if (dx > 0) {
            player.x += widthOverlap;
        } else {
            player.x -= widthOverlap;
        }
    } else {
        if (dy > 0) {
            player.y += heightOverlap;
        } else {
            player.y -= heightOverlap;
        }
    }
}

newPositionMargins(side){
	let margin = 0.01;
	if (side==="left") {
		return {x: 1-1.0/10-margin, y: this.player.y, wx:1,wy:0}; // Move to the left side of the screen
	}
	if (side==="right") {
		return {x: margin, y: this.player.y, wx:-1,wy:0}; // Move to the right side of the screen
	}
	if (side==="top") {
		return {x: this.player.x, y: 1.0 - 1.0/9-margin, wx:0, wy:1}; // Move to the top side of the screen
	}
	if (side==="bottom") {
		return {x: this.player.x, y: margin, wx:0, wy:-1}; // Move to the bottom side of the screen
	}
	return {x: this.player.x, y: this.player.y}; // No movement
}

checkSafe()
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
checkMarginCollision()
{
	// Check if the player is trying to leave the screen on one of the sides
	if(this.player.x < 0.0) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).left,
		side: "left"
	}  // left side
	if(this.player.x > (1.0-1/10)) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).right,
		side: "right"
	}  // right side
	if(this.player.y < 0.0) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).top,
		side: "top"
	}  // up side
	if(this.player.y > (1.0-1/9)) return {
		colliding: true,
		destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).bottom,
		side: "bottom"
	}// down side
	return {colliding: false, destination: -1}; // no collision
}

levelTransition(to)
{
	// Transition from one level to another
	// This function is responsible for the transition animation between levels
	// It can be a fade out, slide, etc.
	// It should return when the transition is done and the new level is loaded
	this.levelID = to;
	this.levelContent = new Array().concat(world.maps[this.mapID].getLevelElements(to)); // Load new level content

	// Initialize level contents
	this.levelContent.forEach((element) => {
		if (element.type==="door") { // Prevent instant teleportation when loading a level
				element.safeCheck(this.player.x, this.player.y, this.player.width, this.player.height); 
		}
	});
}

// Transition animation function
levelTransitionMarginAnimation(currentElements, futureElements, player_old_position, player_new_position, deltaTime, newLevelID, transitionDuration = 1)
{
	// Create a loop for the specified transition duration, then return control to the main loop
	this.stop = true; // Pause the main loop
	let elapsedTime = 0;
	const interval = 16; // Approximate frame duration (16ms for ~60fps)
	
	this.levelContent = futureElements.concat(currentElements); // Set the new level content

	const loop = setInterval(() => {
		elapsedTime += interval;
		if (elapsedTime >= transitionDuration * 1000) {
			clearInterval(loop);
			this.stop = false; // Resume the main loop
			this.levelTransition(newLevelID);
			return;
		}

		// Calculate the interpolation factor (0 to 1)
		let t = elapsedTime / (transitionDuration * 1000);

		// Interpolate player position
		this.player.x = player_old_position.x + t * (player_new_position.x - player_old_position.x);
		this.player.y = player_old_position.y + t * (player_new_position.y - player_old_position.y);

		// Interpolate level elements
		currentElements.forEach((element) => {
			element.resetPosition(); // Reset to old position
			element.translatePosition(t * (player_new_position.wx - player_old_position.wx), t * (player_new_position.wy - player_old_position.wy)); // Translate to new position
		});
		futureElements.forEach((element) => {
			element.resetPosition(); // Reset to old position
			element.translatePosition(t * (player_new_position.wx - player_old_position.wx) - player_new_position.wx, t * (player_new_position.wy - player_old_position.wy) - player_new_position.wy); // Translate to new position
		});
	}, interval);
}

levelTransitionDoorAnimation(newLevelID, userPosition, screen_switch_time = 1) {
	// Create a loop for the specified transition duration, then return control to the main loop
	this.stop = true; // Pause the main loop
	let elapsedTime = 0;
	const interval = 16; // Approximate frame duration (16ms for ~60fps)
	const halfDuration = screen_switch_time * 1000 / 2; // Half of the transition duration
	let white_rectangle = new BackgroundElement(0, 0, 1, 1, "ground", false, texture=null, color="rgba(255, 255, 255, 0)"); // White rectangle for the transition
	white_rectangle.render_layer = -1;
	this.levelContent.push(white_rectangle); // Add the white rectangle to the level content
	
	let newContentLoaded = false; // Flag to track if new content has been loaded
	
	const loop = setInterval(() => {
		elapsedTime += interval;

		// Calculate the interpolation factor (0 to 1)
		let t = elapsedTime / (screen_switch_time * 1000);

		// Clear the screen with a white overlay
		let alpha = t <= 0.5 ? t * 2 : (1 - t) * 2; // Fade to white, then fade out
		white_rectangle.color = `rgba(255, 255, 255, ${alpha})`; // Update the color of the white rectangle

		if (elapsedTime >= halfDuration && !newContentLoaded) {
			// Load the new level content at the halfway point
			this.levelContent = world.maps[this.mapID].getLevelElements(newLevelID);
			this.levelContent.push(white_rectangle);
			this.player.setPosition(userPosition.x, userPosition.y); // Set the player's position
			newContentLoaded = true; // Mark the new content as loaded
		}

		if (elapsedTime >= screen_switch_time * 1000) {
			clearInterval(loop);
			this.stop = false; // Resume the main loop
			this.levelTransition(newLevelID);
			return;
		}
	}, interval);
}

// Scene function to transform (0,0) to (1,1) normalized coordinates to canvas coordinates
transform(x, y)
{
	return [x*this.canvas.width_px, y*this.canvas.height_px];
}

draw()
{
	// Clear background
	this.context.fillStyle = "rgb(224, 224, 240)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw all scene elements of level with layer 0
	this.levelContent.forEach((element) => {
		if (element.render_layer === 0) {
			element.draw(this.context);
		}
	});
	// Draw player
	this.player.draw(this.context);

	// Draw Elements on layer -1
	this.levelContent.forEach((element) => {
		if (element.render_layer === -1) {
			element.draw(this.context);
		}
	});

	if(keyboard[32])
	{
		text = "Spacebar pressed";
		let text_obj = new Text(text, 0.5, 0.5, "blue",  8, "'tiny5'", this.context);
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
}


