
// Quad. Draws a rectangle in a given color.

function Quad(x, y, width, height, color = "white")
{
	this.x = x
	this.y = y
	this.width = width
	this.height = height
	this.color = color
}

Quad.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the rectangle
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
}


function Sphere(x, y, radius, color = "white")
{
	this.x = x
	this.y = y
	this.radius = radius
	this.color = color
}

Sphere.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the rectangle
	context.fillStyle = this.color;
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	context.fill();
}