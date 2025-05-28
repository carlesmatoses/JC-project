
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
	enemy: new Texture("imgs/enemies/Octorok.png"),
	hearts: new Texture("imgs/hearts.png"),
	portcullis: new Texture("imgs/gate_right.png"),
	portcullis_lock: new Texture("imgs/gate_lock.png"),
	rotor: new Texture("imgs/rotor.png"),
	rotor_red: new Texture("imgs/rotor_red.png"),
	rotor_blue: new Texture("imgs/rotor_blue.png"),
	rotor_green: new Texture("imgs/rotor_green.png"),
	rotor_yellow: new Texture("imgs/rotor_yellow.png"),
	floating_floor: new Texture("imgs/floating_floor.png"),
	lights: new Texture("imgs/lights.png"),
	floating_heart: new Texture("imgs/floating_heart.png"),
	floating_money: new Texture("imgs/floating_money.png"),
}