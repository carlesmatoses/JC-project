
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
	overworld: new Texture("imgs/overworld.png"),
	tombstone: new Texture("imgs/tombstone.png"),
	stairs_dirt: new Texture("imgs/stairs_dirt.png"),
	fireplace: new Texture("imgs/fireplace.png"),
	red_floor: new Texture("imgs/animated_floor_red.png"),
	blue_floor: new Texture("imgs/animated_floor_blue.png"),
	green_floor: new Texture("imgs/animated_floor_green.png"),
	vase: new Texture("imgs/vase.png"),
	menu: new Texture("imgs/Menu.png"),
	braceletStrength: new Texture("imgs/brazalete-l1.png"),
	statue: new Texture("imgs/statue.png"),
}