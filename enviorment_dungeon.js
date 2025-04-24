//  Doors
const door1 = new Door(1/10, 1/9, 1/10, 1/9, isWalkable=false, texture=null, color="yellow",drawing_settings=null,destination=2, active=true, door=null);
const door2 = new Door(5/10, 5/9, 1/10, 1/9, isWalkable=false, texture=null, color="purple",drawing_settings=null,destination=0, active=true, door=null);

door1.setDoor(door2); 
door2.setDoor(door1);

// Chests
const chest1 = new Chest(4/10, 1/9, 1/10, 1/9, isWalkable=false, texture=textures.chest, color="yellow",drawing_settings=null);
const chest2 = new Chest(5/10, 1/9, 1/10, 1/9, isWalkable=false, texture=textures.chest, color="yellow",drawing_settings=null);

// Invisible walls
const wall1 = new BackgroundElement(0, 0, 10/10, 1/9,   type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);
const wall2 = new BackgroundElement(0, 0, 1/10, 9/9,    type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);
const wall3 = new BackgroundElement(9/10, 0, 1/10, 9/9, type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);
const wall4 = new BackgroundElement(0, 8/9, 10/10, 1/9, type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);

//Enemies
const enemyOcto1 = new Enemy(0.4, 0.4, 1/10, 1/9); //En caso de querer añadir texturas añadirlo como ultimo parametro.

// The map contains 6x5 tiles, each tile is 160x128 pixels but they have a 1px gap between them
// ROW1
const tile1 = [
    new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black", 
        drawing_settings={sx: 0+1, sy: 1, sWidth: 160, sHeight: 128}), 
    door1,
    chest1, chest2,
    wall1, wall2, wall3, wall4,
    enemyOcto1
    
];
const tile2 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 160+2, sy: 1, sWidth: 160, sHeight: 128})];
const tile3 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 320+3, sy: 1, sWidth: 160, sHeight: 128}),
    door2,
];
const tile4 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 480+4, sy: 1, sWidth: 160, sHeight: 128})];
const tile5 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 640+5, sy: 1, sWidth: 160, sHeight: 128})];
const tile6 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 800+6, sy: 1, sWidth: 160, sHeight: 128})];
// ROW2
const tile7 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile8 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile9 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile10 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile11 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 128+2, sWidth: 160, sHeight: 128})];   
const tile12 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 128+2, sWidth: 160, sHeight: 128})];
// ROW3
const tile13 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",    
    drawing_settings={sx: 0+1, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile14 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile15 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile16 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile17 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile18 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 256+3, sWidth: 160, sHeight: 128})];
// ROW4
const tile19 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile20 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile21 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile22 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile23 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile24 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 384+4, sWidth: 160, sHeight: 128})];
// ROW5
const tile25 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile26 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile27 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile28 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile29 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile30 = [new BackgroundElement(0, 0, 1, 1, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 512+5, sWidth: 160, sHeight: 128})];


const level1 = new Level(0, tile1);
const level2 = new Level(1, tile2);
const level3 = new Level(2, tile3);
const level4 = new Level(3, tile4);
const level5 = new Level(4, tile5);
const level6 = new Level(5, tile6);
const level7 = new Level(6, tile7);
const level8 = new Level(7, tile8);
const level9 = new Level(8, tile9);
const level10 = new Level(9, tile10);
const level11 = new Level(10, tile11);
const level12 = new Level(11, tile12);
const level13 = new Level(12, tile13);
const level14 = new Level(13, tile14);
const level15 = new Level(14, tile15);
const level16 = new Level(15, tile16);
const level17 = new Level(16, tile17);
const level18 = new Level(17, tile18);
const level19 = new Level(18, tile19);
const level20 = new Level(19, tile20);
const level21 = new Level(20, tile21);
const level22 = new Level(21, tile22);
const level23 = new Level(22, tile23);
const level24 = new Level(23, tile24);
const level25 = new Level(24, tile25);
const level26 = new Level(25, tile26);
const level27 = new Level(26, tile27);
const level28 = new Level(27, tile28);
const level29 = new Level(28, tile29);
const level30 = new Level(29, tile30);

const levels = [
    level1, level2, level3, level4, level5, level6,
    level7, level8, level9, level10, level11, level12,
    level13, level14, level15, level16, level17, level18,
    level19, level20, level21, level22, level23, level24,
    level25, level26, level27, level28, level29, level30
];

const dungeon1 = new Map('dungeon1', 6, 5, levels); 

world.addMap(dungeon1); // Add the map to the world