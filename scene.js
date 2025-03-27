

// Scene. Updates and draws a single scene of the game.

function Scene()
{
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

Scene.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Clear background
	context.fillStyle = "rgb(224, 224, 240)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw level
	level_001_elements.forEach((element) => {
		element.draw(context);
	});

	// // Draw sphere
	// context.save();
	// context.translate(32 * Math.sin(this.currentTime / 1000),0);
	// this.quads[3].draw();
	// context.restore();

	// // Draw UI
	// this.UI.health_bar.health = 100 * (Math.sin(this.currentTime / 1000) + 1) / 2;
	// this.UI.draw();
	
	// Draw text
	var text = "Videogames!!!";
	context.font = "24px Verdana";
	var textSize = context.measureText(text);
	context.fillStyle = "SlateGrey";
	context.fillText(text, 256 - textSize.width/2, 224 - 12);
	
	text = "Active for " + Math.floor(this.currentTime / 1000) + " seconds";
	var textSize = context.measureText(text);
	context.fillText(text, 256 - textSize.width/2, 224 + 12);

	if(keyboard[32])
	{
		text = "Spacebar pressed";
		var textSize = context.measureText(text);
		context.fillText(text, 256 - textSize.width/2, 224 + 36);
	}
}



