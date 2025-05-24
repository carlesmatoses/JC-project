// Scene. Updates and draws a single scene of the game.
// This class manages the screen using a normalized coordinate system where:
// - (0, 0) represents the top-left corner of the screen.
// - (1, 1) represents the bottom-right corner of the screen.
// All elements are positioned and scaled relative to this normalized space.
// The scene is responsible for updating and drawing all elements in the game.
// The scene is responsible from controlling the level and the player

class Scene{
	constructor(gameStateManager)
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

		this.music = AudioFX('audio/TheLegendofZelda_LinksAwakeningDX-MainTheme.mp3', { loop: true });
		
		// player variables
		this.player = new Player(TILEWIDTH, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT);
		this.player.scene = this; // Set the scene reference in the player object
		
		this.levelID = 103; // Current level ID

		// level variables
		this.switching = 0; // 0, 1=left, 2=right, 3=up, 4=down
		this.screen_switch_time = 0.7; // seconds
		this.mapID = "overworld"; // Current map ID
		this.levelContent = new Array().concat(world.maps[this.mapID].getLevelElements(this.levelID)); // Current level content
		this.tmpLevelContent = new Array(); // Temporary level content for transitions

		this.debug_text = new Text("Debug: ", 0.0, 0.05, "white",  6, "'tiny5'", this.context);
		this.debug_background = new BackgroundElement(0, 0, 0.29, 0.8, "ground", false, texture=null, color="rgba(0, 0, 0, 0.5)");
		
		// this.context.imageSmoothingEnabled = false;
		this.UI = new UI(gameStateManager, this.player); 
		this.menu = new Menu(gameStateManager, this.player); // Create a menu instance
		this.gameStateManager = gameStateManager;
		
		this.setSceneReferenceToNPCs(); 

	}


	update(deltaTime)
	{
		// Game is stopped, we need to stop the time updates
		if (this.stop) {
			return;
		}

		this.music.play();

		// Level time update
		this.level(deltaTime);
	}

	// This function is responsible for updating the level content and checking for level transitions
	// It can stop the time updates for the scene (transitions, menu screen, etc.)
	level(deltaTime)
	{
		// Update Player: send flag if some event happened: couldnt move a rock, etc.
		const flag = this.player.update(deltaTime);
		switch (flag) {
			case "strength": // obj couldnt be moved
				this.gameStateManager.pushState(new DialogState(this.gameStateManager, ["You need more strength to move this object."])); // Show dialog
				break;
			default:
				break;
		}


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

	collisions()
	{
		// Check if the player is trying to leave the screen on one of the sides
		let margins = this.checkMarginCollision(); // Check for margin collision
		if(margins.colliding) {
			// If the player is trying to leave the screen, transition to the adjacent level
			// Get the adjacent level ID based on the current level ID and direction
			this.player.lastPosition = {x: this.player.x, y: this.player.y};  // save last position
			// this.levelTransition(margins.destination)
			// let new_pos = this.newPositionMargins(margins.side)
			// this.player.setPosition(new_pos.x, new_pos.y); 
			// setTimeout(() => {
			// 	this.stop = false; // Resume the main loop after 1 second
			// }, 1000);
			// this.stop = true; // Pause the main loop
			this.levelTransitionMarginAnimation(
				this.levelContent,
				world.maps[this.mapID].getLevelElements(margins.destination),
				{ x: this.player.x, y: this.player.y, wx:0,wy:0}, // old position
				this.newPositionMargins(margins.side), // new position
				this.currentTime,
				margins.destination,
				this.screen_switch_time
			); // Call the transition function
		}

		// Check for damage collisions
		this.levelContent.forEach((element) => {
			if (element.type === "enemy" && element.boundingBox.isColliding(this.player.boundingBox, 0.04)) {
				this.player.takeDamage(element.stats.attack); // Player takes damage from enemy
			}
		});

	}

	handleInput(input) {
        
		if (input.isPressed('KeyB')) { // key for debug
			console.log("Pressed B!");
			DEBUG = !DEBUG;
		}
		if (input.isPressed('KeyI')) { //
			this.gameStateManager.pushState(this.menu); 
        }
		if (input.isPressed('KeyH')) { // add a 
		
			this.gameStateManager.pushState(new DialogState(this.gameStateManager, ["Hello! Press F to continue", "Press B to activate Debug"])); // Show dialog
		}
		if (input.isPressed(KEY_INVULNERABLE)) CREATIVE_MODE = !CREATIVE_MODE;
		// additionally handle player input
		this.player.handleInput(input);
	}
	
	newPositionMargins(side){
		if (side==="left") {
			return {x: 1-this.player.width, y: this.player.y, wx:1, wy:0}; // Move to the left side of the screen
		}
		if (side==="right") {
			return {x: 0, y: this.player.y, wx:-1, wy:0}; // Move to the right side of the screen
		}
		if (side==="top") {
			return {x: this.player.x, y: 1-this.player.height-TILEHEIGHT, wx:0, wy:0.99-TILEHEIGHT}; // Move to the top side of the screen
		}
		if (side==="bottom") {
			return {x: this.player.x, y: 0, wx:0, wy:-0.99+TILEHEIGHT}; // Move to the bottom side of the screen
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
		});
	}

	/**
	 * 
	 * @returns {number} adjacent level ID
	 */
	checkMarginCollision()
	{
		// Check if the player is trying to leave the screen on one of the sides
		if(this.player.center.x < 0.0) return {
			colliding: true,
			destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).left,
			side: "left"
		}  // left side
		if(this.player.center.x > 1.0) return {
			colliding: true,
			destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).right,
			side: "right"
		}  // right side
		if(this.player.center.y < 0.0) return {
			colliding: true,
			destination: getAdjacentLevels(this.levelID, world.maps[this.mapID].getSize().rows, world.maps[this.mapID].getSize().cols).top,
			side: "top"
		}  // up side
		if(this.player.center.y > 8*TILEHEIGHT) return {
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

		this.setSceneReferenceToNPCs(); 

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
				this.player.setPosition(player_new_position.x, player_new_position.y); 
				return;
			}

			// Calculate the interpolation factor (0 to 1)
			let t = elapsedTime / (transitionDuration * 1000);

			// Interpolate player position
			let x = player_old_position.x + t * (player_new_position.x - player_old_position.x);
			let y = player_old_position.y + t * (player_new_position.y - player_old_position.y);
			this.player.setPosition(x, y); 
			// Interpolate level elements
			currentElements.forEach((element) => {
				element.resetPosition(); // Reset to old position
				element.translatePosition(t * (player_new_position.wx - player_old_position.wx), t * (player_new_position.wy - player_old_position.wy)); // Translate to new position
			});
			futureElements.forEach((element) => {
				element.resetPosition(); // Reset to old position
				element.translatePosition(
					t * (player_new_position.wx - player_old_position.wx) - player_new_position.wx, 
					t * (player_new_position.wy - player_old_position.wy) - player_new_position.wy
				); // Translate to new position
			});
		}, interval);
	}

	levelTransitionDoorAnimation(newLevelID, mapID, userPosition, screen_switch_time = 1) {
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
				console.log("Loading new level content..."+mapID);
				this.levelContent = world.maps[mapID].getLevelElements(newLevelID);
				this.levelContent.push(white_rectangle);
				this.player.setPosition(userPosition.x, userPosition.y); // Set the player's position
				newContentLoaded = true; // Mark the new content as loaded
			}

			if (elapsedTime >= screen_switch_time * 1000) {
				clearInterval(loop);
				this.stop = false; // Resume the main loop
				this.mapID = mapID; // Update the map ID
				console.log("Transition complete to level: " + newLevelID + " in map: " + mapID);
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

	setSceneReferenceToNPCs()
	{
		// Assign to all type==='enemy' elements the scene reference. 
		this.levelContent.forEach((element) => {
			if (element.type === 'enemy') {
				element.scene = this; // Assign the scene reference
				console.log("Assigning scene reference to enemy element", element);
			}
		});
	}

	draw(context)
	{
		// Clear background
		context.fillStyle = "rgb(224, 224, 240)";
		context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw all scene elements of level with layer 0
		this.levelContent.forEach((element) => {
			if (element.render_layer === 0) {
				element.draw(context);
			}
		});

		// Draw player
		this.player.draw(context);

		// Draw Elements on layer -1
		this.levelContent.forEach((element) => {
			if (element.render_layer === -1) {
				element.draw(context);
			}
		});

		this.UI.draw(context); // Draw the UI elements

		// Draw debug
		if (DEBUG){
			this.debug_background.draw(context);
			this.debug_text.update("Debug:\n" + 
							"  X: " + this.player.x.toFixed(1) + "\n" + 
							"  Y: " + this.player.y.toFixed(1) + "\n" + 
							"  FrameCount: " + this.frameCount + "\n" +
							"  lag: " + this.lag.toFixed(1) + " ms" + "\n" +
							"  levelID: " + this.levelID + "\n" 
		
							);
			this.debug_text.draw(context);
		}
	}
}

class GameStateManager {
    constructor() {
        this.stateStack = [];
    }

    pushState(state) {
        this.stateStack.push(state);
    }

    popState() {
        this.stateStack.pop();
    }

    update(deltaTime) {
        if (this.stateStack.length > 0) {
            this.stateStack[this.stateStack.length - 1].update(deltaTime);
        }
    }

    handleInput(input) {
        if (this.stateStack.length > 0) {
            this.stateStack[this.stateStack.length - 1].handleInput(input);
        }
    }

    render(context) {
        for (let state of this.stateStack) {
            state.draw(context);
        }
    }
}

class DialogState {
    constructor(gameStateManager, dialogList) {
        this.gameStateManager = gameStateManager;
        this.dialogList = dialogList; // array of strings
        this.currentIndex = 0;

		this.box = {
			x: TILEWIDTH * 2,
			y: TILEHEIGHT * 6,
			width: TILEWIDTH * 6,
			height: TILEHEIGHT * 2
		};
		const pos = transform(this.box.x, this.box.y, context);
		const size = transform(this.box.width, this.box.height, context);
		this.box.x = pos.x;
		this.box.y = pos.y;
		this.box.width = size.x;
		this.box.height = size.y;

    }

    enter() {
        // Called when DialogState is pushed
    }

    exit() {
        // Called when DialogState is popped
    }

    update(deltaTime) {
        // Nothing to update for now
    }

	draw(context) {
		// Draw the semi-transparent black background
		context.fillStyle = "rgb(249, 253, 185)";
		context.fillRect(this.box.x, this.box.y, this.box.width, this.box.height);
	
		// Draw the dialog box
		context.fillStyle = "rgb(0, 0, 0)";
		context.fillRect(this.box.x + 10, this.box.y + 10, this.box.width - 20, this.box.height - 20);
	
		if (this.currentIndex < this.dialogList.length) {
			const text = this.dialogList[this.currentIndex];
			const maxCharsPerLine = 34;
			const words = text.split(" ");
			const lines = [];
	
			let currentLine = "";
	
			for (let word of words) {
				if ((currentLine + word).length <= maxCharsPerLine) {
					currentLine += word + " ";
				} else {
					lines.push(currentLine.trim());
					currentLine = word + " ";
				}
			}
			if (currentLine.length > 0) {
				lines.push(currentLine.trim());
			}
			
			// we get context canvas size in pixels
			var sizeWidth = context.canvas.clientWidth / 160;

			context.fillStyle = "white";
			context.font = `${22}px 'tiny5', sans-serif`;
			
			let lineHeight = 26; // Adjust based on your font size
			let startY = this.box.y + 40;
			
			for (let i = 0; i < lines.length; i++) {
				context.fillText(lines[i], this.box.x + 20, startY + i * lineHeight);
			}
		} else {
			this.gameStateManager.popState(); // End conversation if no more text to show
		}
	}

    handleInput(event) {
        if (event.isPressed("KeyF")) { 
            this.currentIndex++;
            if (this.currentIndex >= this.dialogList.length) {
                this.gameStateManager.popState(); // End conversation
            }
        }
    }
}