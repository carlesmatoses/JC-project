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
		
		// internal variables
		this.frameCount=0;
		this.lag=0;
		this.currentTime = 0
		this.stop = false; // When we talk to characters, 

		this.music = AudioFX('audio/TheLegendofZelda_LinksAwakeningDX-MainTheme.mp3', { loop: true });
		
		// player variables
		this.player = player;
		this.player.scene = this; // Set the scene reference in the player object
		
		this.levelID = this.player.levelID; // Current level ID
		this.mapID = this.player.mapID; // Current map ID

		// level variables
		this.switching = 0; // 0, 1=left, 2=right, 3=up, 4=down
		this.screen_switch_time = 0.7; // seconds
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
    destroy() {
        // Stop the music when the scene is destroyed
        if (this.music) {
            this.music.stop();
        }
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
			if (element.type === "enemy" && element.boundingBox.isColliding(this.player.boundingBox, 0.01)) {
				this.player.takeDamage(element.stats.attack, element.center); // Player takes damage from enemy
			}
			// Check for collisions of projectiles with the player
			if (element instanceof Projectile && element.boundingBox.isColliding(this.player.boundingBox, -0.01)) {
				if (typeof element.onHit === "function") {
					element.onHit(this.player, this);
				}
			}
			
			if (element instanceof Projectile) { // if it did not collide, check if it collides with any other element
				this.levelContent.forEach((otherElement) => {
					if (otherElement !== element && otherElement !== element.parent) {
						if (element.boundingBox.isColliding(otherElement.boundingBox)) {
							element.onHit(otherElement, this); // Call the onCollide function if it exists
						}
					}
				});
			}
		});

	}

	handleInput(input) {
        
		if (input.isPressed(KEY_DEBUBG)) { // key for debug
			console.log("Pressed B!");
			DEBUG = !DEBUG;
		}
		if (input.isPressed('KeyI')) { //
			this.gameStateManager.pushState(this.menu); 
        }
		if (input.isPressed('KeyT')) { // add a 
		
			this.gameStateManager.pushState(new DialogState(this.gameStateManager, ["Hello! Press F to continue", "Press B to activate Debug"])); // Show dialog
		}
		if (input.isPressed(KEY_INVULNERABLE)) {
			CREATIVE_MODE = !CREATIVE_MODE;
		}
		if (input.isPressed('Escape')) { // Escape key to open in-game menu
			this.gameStateManager.pushState(new InGameMenuState(this.gameStateManager, this.player)); // Open the in-game menu
		}
		if (input.isPressed('Numpad0')) {
			this.levelContent.forEach(element => {
				if (element.type === "enemy" && typeof element.shoot === "function") {
					console.log("Shooting element: ", element);
					element.shoot();
				}
			});
		}
		if (input.isPressed(BOSS1)) { // key for teleporting to first boss
			console.log("Teleporting to first boss level");
			this.levelTransitionDoorAnimation(
				15,
				"dungeon1",
				{ x: 0.5, y: 0.5 }, 
				this.screen_switch_time
			); 
		}
		if (input.isPressed(BOSS3)) { // key for teleporting to first boss
			console.log("Teleporting to final boss level");
			this.levelTransitionDoorAnimation(
				0,
				"dungeon1",
				{ x: 0.5, y: 0.5 }, 
				this.screen_switch_time
			); 
		}
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
			if (element.steptOn && element.boundingBoxPressure) {
				if (element.boundingBoxPressure.isColliding(this.player.boundingBox)) {
					element.steptOn(this.player); 
				}
    		}
		});

		// Check for remaining enemies
		const enemiesLeft = this.levelContent.some(e => e.type === "enemy");
		if (!enemiesLeft && typeof world.maps[this.mapID].getLevel(this.levelID).onAllEnemiesDefeated === "function") {
			world.maps[this.mapID].getLevel(this.levelID).onAllEnemiesDefeated(this);
			// this.levelContent.forEach(element => {
			// 	if (element.type === "portcullis" && typeof element.open === "function") {
			// 		element.open();
			// 	}
			// });
			// Prevent multiple triggers
			// world.maps[this.mapID].getLevel(this.levelID).onAllEnemiesDefeated = null;
		}
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

		// --- Trigger onLeave event if defined ---
		const currentLevelObj = world.maps[this.mapID].getLevel(this.levelID);
		if (currentLevelObj && typeof currentLevelObj.onLeave === "function") {
			currentLevelObj.onLeave(this); // Pass the scene as argument
		}
		
		// Transition from one level to another
		// This function is responsible for the transition animation between levels
		// It can be a fade out, slide, etc.
		// It should return when the transition is done and the new level is loaded
		this.levelID = to;
		this.player.levelID = to; 
		this.levelContent = new Array().concat(world.maps[this.mapID].getLevelElements(to)); // Load new level content

		// Initialize level contents
		this.levelContent.forEach((element) => {
			if (element.type==="door") { // Prevent instant teleportation when loading a level
					element.safeCheck(this.player.x, this.player.y, this.player.width, this.player.height); 
			}
		});

		this.setSceneReferenceToNPCs(); 

		// --- Trigger onEnter event if defined ---
		const levelObj = world.maps[this.mapID].getLevel(to);
		if (levelObj && typeof levelObj.onEnter === "function") {
			levelObj.onEnter(this); // Pass the scene as argument
		}

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
				if (element.resetPosition) {
					element.resetPosition(); // Reset to old position
					element.translatePosition(t * (player_new_position.wx - player_old_position.wx), t * (player_new_position.wy - player_old_position.wy)); // Translate to new position
				}
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
				this.player.mapID = mapID; 
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
							"  FrameCount: " + this.gameStateManager.frameCount + "\n" +
							"  lag: " + this.gameStateManager.lag.toFixed(1) + " ms" + "\n" +
							"  levelID: " + this.levelID + "\n" 
		
							);
			this.debug_text.draw(context);
		}
	}

	getLevel(levelID=this.levelID) {
		// Get the level object by its ID
		return world.maps[this.mapID].getLevel(levelID);
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
        const state = this.stateStack.pop();
        if (state && typeof state.destroy === "function") {
            state.destroy(); // Call the destroy method if it exists
        }
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

	startNewGame(){
		// pop all states
		while (this.stateStack.length > 0) {
			this.popState();
		}
		// Start a new game by pushing the initial scene
		const initialScene = new Scene(this);
		this.pushState(initialScene);
		this.pushState(new DialogState(this, [
					`${KEY_PRIMARY} is the primary button.   Press ${KEY_PRIMARY} to continue`, 
					`Press ${KEY_DEBUBG} to activiate`, 
					`Press ${KEY_INVENTORY} to open the inventory`,
		]));
	}

	exitGame() {
		// Exit the game by popping all states and closing the window
		while (this.stateStack.length > 0) {
			this.popState();
		}
		window.close(); // Close the window
	}

}

class DialogState {
    constructor(gameStateManager, dialogList, options = null, onSelect = null) {
        this.gameStateManager = gameStateManager;
        this.dialogList = dialogList; // array of strings
        this.currentIndex = 0;

		this.options = options;
		this.selectedOption = 0;
		this.onSelect = onSelect;

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

			context.fillStyle = "white";
			context.font = `${22}px 'tiny5', sans-serif`;
			
			let lineHeight = 26;
			let startY = this.box.y + 40;
			
			// Draw dialog lines
			for (let i = 0; i < lines.length; i++) {
				context.fillText(lines[i], this.box.x + 20, startY + i * lineHeight);
			}

			// Draw options if on last dialog
			if (this.options && this.currentIndex === this.dialogList.length - 1) {
				const optionsY = startY + lines.length * lineHeight + 20; // Add spacing
				const optionSpacing = (this.box.width - 80) / this.options.length; // 80px padding (40 left/right)
				this.options.forEach((option, i) => {
					context.fillStyle = this.selectedOption === i ? "yellow" : "white";
					context.fillText(
						option,
						this.box.x + 40 + i * optionSpacing,
						optionsY
					);
				});
			}
		} else {
			// NOTE: This should probably be triggered externally, not inside draw()
			this.gameStateManager.popState(); // End conversation
		}
	}

    handleInput(event) {
		if (this.options && this.currentIndex === this.dialogList.length - 1) {
			if (event.isPressed("ArrowUp") || event.isPressed("ArrowLeft")) {
				this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
			}
			if (event.isPressed("ArrowDown") || event.isPressed("ArrowRight")) {
				this.selectedOption = (this.selectedOption + 1) % this.options.length;
			}

			if (event.isPressed("Enter")) {
				if (this.onSelect) {
					this.onSelect(this.selectedOption); // Call the callback with the selected option
				}
				this.gameStateManager.popState();
			}
		} else if (event.isPressed("KeyF")) {
            this.currentIndex++;
            if (this.currentIndex >= this.dialogList.length) {
				this.gameStateManager.popState();
            }
        }
    }
}

class InGameMenuState {
	constructor(gameStateManager, player) {
		this.gameStateManager = gameStateManager;
		this.player = player;
		this.options = ["Resume", "Instruccions", "Crèdits", "Exit Game"]; // Added "Resume" as the first option
		this.selectedOption = 0; // Index of the currently selected option
	}

	update(deltaTime) {
		// No updates needed for a static menu
	}

	draw(context) {
		// Clear the screen
		context.fillStyle = "rgb(0, 25, 30, 0.7)"; // steel blue
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		// Draw the menu title
		context.fillStyle = "white";
		context.font = "54px 'tiny5', sans-serif";
		context.fillText("In-Game Menu", context.canvas.width / 4, 100);

		// Draw the menu options
		context.font = "32px 'tiny5', sans-serif";
		this.options.forEach((option, index) => {
			context.fillStyle = this.selectedOption === index ? "yellow" : "white";
			context.fillText(option, context.canvas.width / 4, 200 + index * 50);
		});
	}

	handleInput(input) {
		if (input.isPressed("ArrowUp")) {
			this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
		}
		if (input.isPressed("ArrowDown")) {
			this.selectedOption = (this.selectedOption + 1) % this.options.length;
		}
		if (input.isPressed("Enter")) {
			this.selectOption();
		}
		if (input.isPressed("Escape")) {
			this.gameStateManager.popState(); // Close the menu
		}
	}

	selectOption() {
		switch (this.options[this.selectedOption]) {
			case "Resume":
				this.gameStateManager.popState(); // Close the in-game menu and resume the game
				break;
			case "Instruccions":
				this.gameStateManager.popState(); // Close the in-game menu
				this.gameStateManager.pushState(new MenuInstructionsState(this.gameStateManager)); // Open the instructions menu
				break;
			case "Crèdits":
				this.gameStateManager.popState(); // Close the in-game menu
				this.gameStateManager.pushState(new MenuCredits(this.gameStateManager)); // Open the credits menu
				break;
			case "Exit Game":
				console.log("Exit selected: ", this.gameStateManager.stateStack);
				this.gameStateManager.popState(); // Close the menu
				this.gameStateManager.popState(); // Remove the scene
				this.gameStateManager.pushState(new MenuState(this.gameStateManager)); // Return to the main menu
				break;
		}
	}
}

class MenuState {
    constructor(gameStateManager) {
        this.gameStateManager = gameStateManager;
        this.options = ["Start", "Exit"];
        this.selectedOption = 0; // Index of the currently selected option
    }

    update(deltaTime) {
        // No updates needed for a static menu
    }

	draw(context) {
		// Draw the background image if loaded
		const bg = textures.background_menu.img;
		if (bg) {
			context.drawImage(bg, 0, 0, context.canvas.width, context.canvas.height);
		} else {
			// If the background image is not loaded, fill with a solid color
			context.fillStyle = "rgb(0, 25, 30, 0.7)"; // steel blue
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		}

		// Draw the menu title centered
		// context.fillStyle = "white";
		// context.font = "64px 'tiny5', sans-serif";
		// const title = "Principal Menu";
		// const titleMetrics = context.measureText(title);
		// const titleX = (context.canvas.width - titleMetrics.width) / 2;
		// context.fillText(title, titleX, 180);

		// Draw the menu options centered with background rectangles
		this.options.forEach((option, index) => {
			context.font = "48px 'tiny5', sans-serif";
			const optionMetrics = context.measureText(option);
			const optionX = (context.canvas.width - optionMetrics.width) / 2;
			const optionY = 320 + index * 80;

			// Draw background rectangle
			const paddingX = 32;
			const paddingY = 0;
			const rectX = optionX - paddingX;
			const rectY = optionY - 38 + paddingY / 2;
			const rectWidth = optionMetrics.width + paddingX * 2;
			const rectHeight = 48 - paddingY;

			context.save();
			context.globalAlpha = this.selectedOption === index ? 0.5 : 0.2;
			context.fillStyle = "#000";
			context.fillRect(rectX, rectY, rectWidth, rectHeight);
			context.restore();

			// Draw option text
			context.fillStyle = this.selectedOption === index ? "yellow" : "white";
			context.fillText(option, optionX, optionY);
		});
	}

    handleInput(input) {
        if (input.isPressed("ArrowUp")) {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
        }
        if (input.isPressed("ArrowDown")) {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
        }
        if (input.isPressed("Enter")) {
            this.selectOption();
        }
    }

    selectOption() {
        switch (this.options[this.selectedOption]) {
            case "Start":
                this.gameStateManager.popState(); // Remove the menu
                this.gameStateManager.pushState(new Scene(this.gameStateManager)); // Start the game
				// Add an initial dialog state to the game state manager
				this.gameStateManager.pushState(new DialogState(gamestatemanager, [
					`${KEY_PRIMARY} is the primary button.   Press ${KEY_PRIMARY} to continue`, 
					`Press ${KEY_DEBUBG} to activiate`, 
					`Press ${KEY_INVENTORY} to open the inventory`,
				]));
                break;
            case "Load Game":
                console.log("Load Game selected");
                // Implement loading logic here
                break;
            case "Settings":
                console.log("Settings selected");
                // Implement settings logic here
                break;
            case "Exit":
                console.log("Exit selected");
                // Implement exit logic here
				this.gameStateManager.popState();
				window.close();
                break;
        }
    }
}

class MenuInstructionsState {
	constructor(gameStateManager) {
		this.gameStateManager = gameStateManager;
		this.instructions = [
			"Controls:",
			"Up: " + KEY_UP,
			"Down: " + KEY_DOWN,
			"Left: " + KEY_LEFT,
			"Right: " + KEY_RIGHT,
			"Primary: " + KEY_PRIMARY,
			"Secondary: " + KEY_SECONDARY,
			"Debug: " + KEY_DEBUBG,
			"Inventory: " + KEY_INVENTORY,
			"Invulnerable: " + KEY_INVULNERABLE,
			"Boss 1: " + BOSS1,
			"Boss 2: " + BOSS2,
			"Boss 3: " + BOSS3,
			"Shield: " + KEY_SHIELD,
			"Escape/Menu: " + KEY_ESCAPE,
			"Remove Hitbox: " + REMOVE_HITBOX,
		];
	}

	update(deltaTime) {
		// No updates needed for a static instructions screen
	}

	draw(context) {
		context.fillStyle = "rgb(0, 25, 30, 0.7)"; // steel blue
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		context.fillStyle = "white";
		context.font = "24px 'Press Start 2P', sans-serif";
		this.instructions.forEach((line, index) => {
			context.fillText(line, 20, 50 + index * 30);
		});
	}

	handleInput(input) {
		if (input.isPressed("Escape")) {
			this.gameStateManager.popState(); // Close the instructions screen
		}
	}
}

class MenuCredits {
    constructor(gameStateManager) {
        this.gameStateManager = gameStateManager;
        this.credits = [
            "Game Credits:",
            "",
            "Developer: Your Name",
            "Designer: Your Name",
            "Music: Your Name",
            "Special Thanks: Your Team",
            "",
            "Press Escape to return"
        ];
    }

    update(deltaTime) {
        // No updates needed for a static credits screen
    }

    draw(context) {
        // Clear the screen
        context.fillStyle = "rgb(0, 25, 30, 0.7)"; // steel blue
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // Draw the credits text
        context.fillStyle = "white";
        context.font = "24px 'Press Start 2P', sans-serif";
        this.credits.forEach((line, index) => {
            context.fillText(line, 20, 50 + index * 30);
        });
    }

    handleInput(input) {
        if (input.isPressed("Escape")) {
            this.gameStateManager.popState(); // Close the credits screen
        }
    }
}

class DeathMenuState {
    constructor(gameStateManager) {
        this.gameStateManager = gameStateManager;
        this.options = ["Start Again", "Exit"];
        this.selectedOption = 0;
    }

    update(deltaTime) {}

    draw(context) {
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = "white";
        context.font = "48px 'tiny5', sans-serif";
        context.fillText("You Died", context.canvas.width / 4, 100);
        context.font = "32px 'tiny5', sans-serif";
        this.options.forEach((option, i) => {
            context.fillStyle = this.selectedOption === i ? "yellow" : "white";
            context.fillText(option, context.canvas.width / 4, 200 + i * 50);
        });
    }

    handleInput(input) {
        if (input.isPressed("ArrowUp")) {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
        }
        if (input.isPressed("ArrowDown")) {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
        }
        if (input.isPressed("Enter")) {
            if (this.options[this.selectedOption] === "Start Again") {
                this.gameStateManager.popState(); // Remove death menu
                this.gameStateManager.popState(); // Remove current scene
                this.gameStateManager.pushState(new Scene(this.gameStateManager)); // Start new scene
            } else if (this.options[this.selectedOption] === "Exit") {
                this.gameStateManager.popState(); // Remove death menu
                this.gameStateManager.popState(); // Remove current scene
                this.gameStateManager.pushState(new MenuState(this.gameStateManager)); // Go to main menu
            }
        }
    }
}


class EndGameMenuState {
	constructor(gameStateManager, fadeDuration = 1) {
		this.gameStateManager = gameStateManager;
		this.options = ["Start", "Exit"];
		this.selectedOption = 0;
		this.fadeDuration = fadeDuration; // seconds
		this.fadingIn = true;
		this.fadingOut = false;
		this.fadeElapsed = 0;
		this.whiteOverlayAlpha = 0;
		this.menuVisible = false;
	}

	update(deltaTime) {
		const dt = deltaTime; // convert ms to seconds if needed
		
		if (this.fadingIn) {
			this.fadeElapsed += dt;
			this.whiteOverlayAlpha = Math.min(this.fadeElapsed / this.fadeDuration, 1);
			if (this.whiteOverlayAlpha >= 1) {
				this.fadingIn = false;
				this.fadeElapsed = 0;
				this.fadingOut = true;
				this.menuVisible = true;
			}
		} else if (this.fadingOut) {
			this.fadeElapsed += dt;
			this.whiteOverlayAlpha = 1 - Math.min(this.fadeElapsed / this.fadeDuration, 1);
			if (this.whiteOverlayAlpha <= 0) {
				this.fadingOut = false;
				this.menuVisible = true;
			}
		}
	}


	draw(context) {
		// Optionally: draw previous game screen in background here


		// Draw the menu after transition
		if (this.menuVisible) {

			const bg = textures.background_menu.img;
			if (bg) {
				context.drawImage(bg, 0, 0, context.canvas.width, context.canvas.height);
			} else {
				// If the background image is not loaded, fill with a solid color
				context.fillStyle = "rgb(0, 25, 30, 0.7)"; // steel blue
				context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			}

			this.options.forEach((option, index) => {
				context.font = "48px 'tiny5', sans-serif";
				const optionMetrics = context.measureText(option);
				const optionX = (context.canvas.width - optionMetrics.width) / 2;
				const optionY = 320 + index * 80;

				// Draw background rectangle
				const paddingX = 32;
				const paddingY = 0;
				const rectX = optionX - paddingX;
				const rectY = optionY - 38 + paddingY / 2;
				const rectWidth = optionMetrics.width + paddingX * 2;
				const rectHeight = 48 - paddingY;

				context.save();
				context.globalAlpha = this.selectedOption === index ? 0.5 : 0.2;
				context.fillStyle = "#000";
				context.fillRect(rectX, rectY, rectWidth, rectHeight);
				context.restore();

				// Draw option text
				context.fillStyle = this.selectedOption === index ? "yellow" : "white";
				context.fillText(option, optionX, optionY);
			});
		}

		// White overlay
		if (this.fadingIn || this.fadingOut) {
			context.fillStyle = `rgba(255, 255, 255, ${this.whiteOverlayAlpha})`;
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		}


	}

	handleInput(input) {
		if (!this.menuVisible) return;

		if (input.isPressed("ArrowUp")) {
			this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
		}
		if (input.isPressed("ArrowDown")) {
			this.selectedOption = (this.selectedOption + 1) % this.options.length;
		}
		if (input.isPressed("Enter")) {
			switch (this.options[this.selectedOption]) {
				case "Start":
					this.gameStateManager.startNewGame();
					break;
				case "Credits":
					this.gameStateManager.showCredits();
					break;
				case "Exit":
					this.gameStateManager.exitGame();
					break;
			}
		}
	}
}