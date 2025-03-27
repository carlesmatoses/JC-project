

// Scene. Updates and draws a single scene of the game.
// This class manages the screen using a normalized coordinate system where:
// - (0, 0) represents the top-left corner of the screen.
// - (1, 1) represents the bottom-right corner of the screen.
// All elements are positioned and scaled relative to this normalized space.
function Scene()
{
	// Set canvas dimensions 
	this.canvas = document.getElementById("game-layer");
	this.context = this.canvas.getContext("2d");
	
	this.size_multiply = 2;
	this.canvas.width = 160*this.size_multiply;
	this.canvas.height = 144*this.size_multiply;


	// Loading texture to use in a TexturedQuad
	var img = new Texture("imgs/varied.png");


	// Prepare all quads
	this.quads = new Array();
	this.quads.push(new Quad(64, 32, 128, 128, "red"));
	this.quads.push(new Quad(320, 32, 128, 128, "green"));
	this.quads.push(new Quad(64, 288, 128, 128, "blue"));
	this.quads.push(new Sphere(320, 288, 100, "yellow"));

	this.UI = new UI();
	
	this.texQuad = new TexturedQuad(0, 0, 32, 32, 320, 288, 128, 128, img);
	
	// Store current time
	this.currentTime = 0
}


Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	this.currentTime += deltaTime;
}



const textObject = new Text("Hello, Hero!", 160, 144, color='black', font='20px Arial');
const _sphere = new Sphere(320, 288, 100, "yellow");

Scene.prototype.draw = function ()
{
	// Get canvas object, then its context
	// var canvas = document.getElementById("game-layer");
	// var context = canvas.getContext("2d");

	// Clear background
	this.context.fillStyle = "rgb(224, 224, 240)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw level
	level_001_elements.forEach((element) => {
		element.draw(this.context);
	});

	textObject.draw(this.context);

	if(keyboard[32])
	{
		text = "Spacebar pressed";
		var textSize = context.measureText(text);
		context.fillText(text, 0, 0);
	}
}

// Scene function to transform (0,0) to (1,1) normalized coordinates to canvas coordinates
Scene.prototype.transform = function(x, y)
{
	return [x*this.canvas.width_px, y*this.canvas.height_px];
}

