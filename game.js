
// Main class. Executes the game loop, redrawing the scene as needed.

const FRAME_RATE = 120;
const TARGET_FPS = FRAME_RATE;
const TIME_PER_FRAME = 1000 / FRAME_RATE;

var scene = new Scene();
var previousTimestamp;
var keyboard = [];
var interacted;


let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;
let lag = 0;

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
function calculateFPS(timestamp) {
    frameCount++;
    if (lastFrameTime === 0) {
        lastFrameTime = timestamp;
        return;
    }

    const deltaTime = timestamp - lastFrameTime;
    if (deltaTime >= 1000) {  // Update FPS every 1 second
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = timestamp;
		scene.frameCount = fps;

    }
}

// Calculate lag
function calculateLag(timestamp) {
    let deltaTime = timestamp - previousTimestamp;
    lag += deltaTime;
	
    // Update game state for this frame if lag exceeds TIME_PER_FRAME
    while (lag >= TIME_PER_FRAME) {
		lag -= TIME_PER_FRAME;
		scene.update(TIME_PER_FRAME);
    }
	scene.lag = lag;

    previousTimestamp = timestamp;
}

// Game loop: Update, draw, and request a new frame
function frameUpdate(timestamp) {

	calculateFPS(timestamp);  // Calculate FPS
	calculateLag(timestamp);  // Calculate Lag

	// Draw the scene
	scene.draw();

	// Request the next frame
	window.requestAnimationFrame(frameUpdate);
}


// Init and launch game loop
init();
frameUpdate(previousTimestamp);

