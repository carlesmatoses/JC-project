

// Scene. Updates and draws a single scene of the game.
// This class manages the screen using a normalized coordinate system where:
// - (0, 0) represents the top-left corner of the screen.
// - (1, 1) represents the bottom-right corner of the screen.
// All elements are positioned and scaled relative to this normalized space.
// The scene is responsible for updating and drawing all elements in the game.
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


	this.player = new Player(0.5, 0.5, 1/10, 1/9);
	this.debug_text = new Text("Debug: ", 0.0, 0.05, color="white",  fontSize=6, fontFamily="'Pixelify Sans'", ctx=this.context);
	this.debug_background = new BackgroundElement(0, 0, 0.29, 0.8, "ground", false, texture=null, color="rgba(0, 0, 0, 0.5)");
	
	this.context.imageSmoothingEnabled = false;

}


Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	this.currentTime += deltaTime;

	// Update Player
	this.player.update(deltaTime);
}


Scene.prototype.draw = function ()
{
	// Clear background
	this.context.fillStyle = "rgb(224, 224, 240)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw level
	level_001_elements.forEach((element) => {
		element.draw(this.context);
	});

	// Draw player
	// this.context.imageSmoothingEnabled = false;
	this.player.draw(this.context);

	if(keyboard[32])
	{
		text = "Spacebar pressed";
		var textSize = context.measureText(text);
		context.fillText(text, 0, 0);
	}

	// Player movement
	let direction = { x: 0, y: 0 };

	if (keyboard[37]) direction.x += -1; // Left arrow
	if (keyboard[39]) direction.x += 1;  // Right arrow
	if (keyboard[38]) direction.y += -1; // Up arrow
	if (keyboard[40]) direction.y += 1;  // Down arrow

	this.player.setDirection(direction.x, direction.y);

	// reset direction if no key is pressed
	if(!keyboard[37] && !keyboard[39] && !keyboard[38] && !keyboard[40]) this.player.setDirection(0, 0);

	// Draw debug
	this.debug_background.draw(this.context);
	this.debug_text.update("Debug:\n" + 
					  "  X: " + this.player.x.toFixed(1) + "\n" + 
					  "  Y: " + this.player.y.toFixed(1) + "\n" + 
					  "  FrameCount: " + this.frameCount + "\n" +
					  "  lag: " + this.lag.toFixed(3) + " ms" + "\n" 
					);
	this.debug_text.draw(this.context);
}

// Scene function to transform (0,0) to (1,1) normalized coordinates to canvas coordinates
Scene.prototype.transform = function(x, y)
{
	return [x*this.canvas.width_px, y*this.canvas.height_px];
}

