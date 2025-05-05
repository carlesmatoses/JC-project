
// Main class. Executes the game loop, redrawing the scene as needed.

const FRAME_RATE = 60;
const TARGET_FPS = FRAME_RATE;
const TIME_PER_FRAME = 1000 / FRAME_RATE;


var canvas = document.getElementById("game-layer");
var context = this.canvas.getContext("2d");
var gamestatemanager = new GameStateManager();
var scene = new Scene(gamestatemanager);
gamestatemanager.pushState(scene);
// gamestatemanager.pushState(new DialogState(gamestatemanager, ["Hola", "Como estas?"]));

var previousTimestamp;
var keyboardInput = null;
var interacted;

let deltaTime = 0;
let frameTimeCumulative = 0;
let frameCount = 0;
let fps = 0;
let lag = 0;

let DEBUG = true; // Set to true to enable debug mode

// Control keyboard events
class KeyboardInput {
    constructor() {
        this.held = {};
        this.pressed = {};
        this.released = {};
        this.previous = {};
        
        document.body.addEventListener('keydown', (e) => this.keyDown(e));
        document.body.addEventListener('keyup', (e) => this.keyUp(e));
    }

    keyDown(event) {
        const key = event.code;
        if (!this.held[key]) {
            this.pressed[key] = true;
        }
        this.held[key] = true;
    }

    keyUp(event) {
        const key = event.code;
        this.held[key] = false;
        this.released[key] = true;
    }

    update() {
        // Reset pressed/released every frame AFTER input was processed
        this.pressed = {};
        this.released = {};
    }

    isHeld(key) {
        return !!this.held[key];
    }

    isPressed(key) {
        return !!this.pressed[key];
    }

    isReleased(key) {
        return !!this.released[key];
    }
}


// Calculate FPS
function calculateFPS(deltaTime) {
    frameCount++;
	frameTimeCumulative += deltaTime;
    if (frameTimeCumulative >= 1000) {  // Update FPS every 1 second
        fps = frameCount;
		scene.frameCount = fps;
        frameCount = 0;
		frameTimeCumulative = 0;

    }
}

// Calculate lag
function calculateLag(deltaTime) {
    lag += deltaTime;
	
    while (lag >= TIME_PER_FRAME) {
		lag -= TIME_PER_FRAME;
    }
	scene.lag = lag;
}

// Initialization
function init()
{
	previousTimestamp = performance.now();
	interacted = false;
	keyboardInput = new KeyboardInput();
}


// Game loop: Update, draw, and request a new frame
function frameUpdate(timestamp) {

	deltaTime = timestamp - previousTimestamp;

	calculateFPS(deltaTime);  // Calculate FPS
	calculateLag(deltaTime);  // Calculate Lag

	gamestatemanager.update(deltaTime);
	gamestatemanager.handleInput(keyboardInput);

	// Draw the scene
	scene.currentTime = timestamp;
	gamestatemanager.render(context);

	// update time
    previousTimestamp = timestamp;
    keyboardInput.update(); 

	// Request the next frame
	window.requestAnimationFrame(frameUpdate);
}


// Init and launch game loop
init();
frameUpdate(previousTimestamp);

