
// Main class. Executes the game loop, redrawing the scene as needed.

const FRAME_RATE = 60;
const TARGET_FPS = FRAME_RATE;
const TIME_PER_FRAME = 1000 / FRAME_RATE;

var scene = new Scene();
var previousTimestamp;
var keyboard = [];
var interacted;

let deltaTime = 0;
let frameTimeCumulative = 0;
let frameCount = 0;
let fps = 0;
let lag = 0;

let DEBUG = false; // Set to true to enable debug mode

// Control keyboard events

function keyDown(keycode)
{
	if(keycode.which >= 0 && keycode.which < 256)
		keyboard[keycode.which] = true;
}

function keyUp(keycode)
{
	if(keycode.which >= 0 && keycode.which < 256)
		keyboard[keycode.which] = false;
}

function click()
{
	interacted = true;
}

// Initialization

function init()
{
	for(var i=0; i<256; i++)
		keyboard.push(false);
	document.body.addEventListener('keydown', keyDown);
	document.body.addEventListener('keyup', keyUp);
	document.body.addEventListener('click', click);
	previousTimestamp = performance.now();
	interacted = false;
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

// Game loop: Update, draw, and request a new frame
function frameUpdate(timestamp) {

	deltaTime = timestamp - previousTimestamp;

	calculateFPS(deltaTime);  // Calculate FPS
	calculateLag(deltaTime);  // Calculate Lag

	// Draw the scene
	scene.update(deltaTime);
	scene.currentTime = timestamp;
	scene.draw();

	// update time
    previousTimestamp = timestamp;

	// Request the next frame
	window.requestAnimationFrame(frameUpdate);
}


// Init and launch game loop
init();
frameUpdate(previousTimestamp);

