
// TexturedQuad. Draws a rectangle using part of an image (texture).

function TexturedQuad(sx, sy, sWidth, sHeight, x, y, width, height, texture, smoothing = false)
{
	this.sx = sx
	this.sy = sy
	this.sWidth = sWidth
	this.sHeight = sHeight

	this.x = x
	this.y = y
	this.width = width
	this.height = height
	
	this.texture = texture
	
	this.smoothing = smoothing;
}

TexturedQuad.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the rectangle
	// context.imageSmoothingEnabled = this.smoothing;
	context.drawImage(this.texture.img, this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.width, this.height);
}


