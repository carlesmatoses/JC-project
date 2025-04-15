
// Container for an image

function Texture(imgpath)
{
	this.img = new Image();
	this.img.src = imgpath;
}


Texture.prototype.isLoaded = function ()
{
	return this.img.complete;
}

Texture.prototype.width = function ()
{
	return this.img.width;
}

Texture.prototype.height = function ()
{
	return this.img.height;
}


const textures = {
	brick: new Texture("imgs/brick.png"),
	dungeon0: new Texture("imgs/dungeon0.png"),
	dungeon1: new Texture("imgs/139216.png"),
	chest: new Texture("imgs/chest.png"),
}