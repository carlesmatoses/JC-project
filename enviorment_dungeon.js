//  Doors
// const door1 = new Door(TILEWIDTH, 1/9, TILEWIDTH, 1/9, isWalkable=false, texture=null, color="yellow",drawing_settings=null,destination=2, active=true, door=null);
// const door2 = new Door(5*TILEWIDTH, 5/9, TILEWIDTH, 1/9, isWalkable=false, texture=null, color="purple",drawing_settings=null,destination=0, active=true, door=null);

// door1.setDoor(door2); 
// door2.setDoor(door1);

// // Chests
// const chest1 = new Chest(4*TILEWIDTH, 1/9, TILEWIDTH, 1/9, isWalkable=false, texture=textures.chest, color="yellow",drawing_settings=null);
// const chest2 = new Chest(5*TILEWIDTH, 1/9, TILEWIDTH, 1/9, isWalkable=false, texture=textures.chest, color="yellow",drawing_settings=null);

// // Invisible walls
// const wall1 = new BackgroundElement(0, 0, 10*TILEWIDTH, 1/9,   type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);
// const wall2 = new BackgroundElement(0, 0, TILEWIDTH, 9/9,    type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);
// const wall3 = new BackgroundElement(9*TILEWIDTH, 0, TILEWIDTH, 9/9, type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);
// const wall4 = new BackgroundElement(0, 8/9, 10*TILEWIDTH, 1/9, type="wall", isWalkable=false, texture=null, color=null, drawing_settings=null);

// Statues
// the two statues on the starting room
const statue1 = new Statue(
    4 * TILEWIDTH, 
    1 * TILEHEIGHT,
    ["What is 2 + 2?", "Choose the correct answer:"],
    ["3", "4", "5"],
    (selectedIndex, statue) => {
        if (selectedIndex === 1) {
            console.log("Correct answer!");
            statue.translatePosition(-TILEWIDTH, 0); 
            statue.boundingBox.x -= TILEWIDTH; 
            statue.defaultX -= TILEWIDTH;
            statue.callback(statue); 
        } else {
            console.log("Wrong answer! Try again.");
        }
    }
);
statue1.callback = function(statue) {
    statue1.x = statue.x;
    statue1.y = statue.y;
    console.log("statue callback executed");
}

const statue2 = new Statue(
    5 * TILEWIDTH, 
    1 * TILEHEIGHT,
    ["Which show is better?", ],
    ["Futurama", "Simspons"],
    (selectedIndex, statue) => {
        if (selectedIndex === 0) {
            console.log("Correct answer!");
            statue.translatePosition(TILEWIDTH, 0); 
            statue.boundingBox.x += TILEWIDTH; 
            statue.defaultX += TILEWIDTH;
            statue.callback(statue); 
        } else {
            console.log("Wrong answer! Try again.");
        }
    }
);
statue2.callback = function(statue) {
    statue2.x = statue.x;
    statue2.y = statue.y;
    console.log("statue callback executed");
}


//Enemies
const enemyOcto1 = new Enemy(0.4, 0.4, TILEWIDTH, 1/9); //En caso de querer añadir texturas añadirlo como ultimo parametro.

// The map contains 6x5 tiles, each tile is 160x128 pixels but they have a 1px gap between them
// ROW1
const dungeon_tile1 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
        drawing_settings={sx: 0+1, sy: 1, sWidth: 160, sHeight: 128}), 
        entrance_dungeon
];
const dungeon_tile2 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 160+2, sy: 1, sWidth: 160, sHeight: 128})];
const dungeon_tile3 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 320+3, sy: 1, sWidth: 160, sHeight: 128}),
];
const dungeon_tile4 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 480+4, sy: 1, sWidth: 160, sHeight: 128})];
const dungeon_tile5 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 640+5, sy: 1, sWidth: 160, sHeight: 128}),
    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ), // top
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ), // bottom
    new InvisibleWall(0*TILEWIDTH, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ), // left

    new InvisibleWall(8*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ), // right
    new InvisibleWall(8*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT ), // right
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ), // right
    new InvisibleWall(9*TILEWIDTH, 2.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ), // right
    new InvisibleWall(9*TILEWIDTH, 4.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ), // right
    new InvisibleWall(8*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ), // right
    new InvisibleWall(8*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ), // right

    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(3*TILEWIDTH, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(5*TILEWIDTH, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(6*TILEWIDTH, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(6*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(5*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ), // center
    new InvisibleWall(3*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ), // center
];
const dungeon_tile6 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 800+6, sy: 1, sWidth: 160, sHeight: 128}),

    new InvisibleWall(0*TILEWIDTH, 0*TILEHEIGHT, 20*TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(9*TILEWIDTH, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),

    new InvisibleWall(0*TILEWIDTH, 0*TILEHEIGHT, TILEWIDTH, 6*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, TILEWIDTH, 6*TILEHEIGHT ),
];
// ROW2
const dungeon_tile7 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 128+2, sWidth: 160, sHeight: 128})];
const dungeon_tile8 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 128+2, sWidth: 160, sHeight: 128})];
const dungeon_tile9 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 128+2, sWidth: 160, sHeight: 128})];
const dungeon_tile10 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 128+2, sWidth: 160, sHeight: 128})];
const dungeon_tile11 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 128+2, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),

    new InvisibleWall(2*TILEWIDTH, 0*TILEHEIGHT, 6*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
];   
const dungeon_tile12 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 128+2, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, 6*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),

    new InvisibleWall(2*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 7*TILEHEIGHT, 5*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 7*TILEHEIGHT, 5*TILEWIDTH, TILEHEIGHT ),
];
// ROW3
const dungeon_tile13 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",    
    drawing_settings={sx: 0+1, sy: 256+3, sWidth: 160, sHeight: 128})];
const dungeon_tile14 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 256+3, sWidth: 160, sHeight: 128})];
const dungeon_tile15 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 256+3, sWidth: 160, sHeight: 128})];
const dungeon_tile16 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 256+3, sWidth: 160, sHeight: 128})];
const dungeon_tile17 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 256+3, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),

    new InvisibleWall(2*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
];
const dungeon_tile18 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 256+3, sWidth: 160, sHeight: 128})];
// ROW4
const dungeon_tile19 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 384+4, sWidth: 160, sHeight: 128})];
const dungeon_tile20 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 384+4, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0.0, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),

    createAnimatedFloorGreen(2*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorGreen(3*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorGreen(3*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(2*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(TILEWIDTH, TILEHEIGHT*4),
    createAnimatedFloorGreen(2*TILEWIDTH, TILEHEIGHT*4),

    createAnimatedFloorGreen(7*TILEWIDTH, TILEHEIGHT*4),
    createAnimatedFloorGreen(8*TILEWIDTH, TILEHEIGHT*4),
    createAnimatedFloorGreen(7*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(8*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(6*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(6*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorGreen(7*TILEWIDTH, 6*TILEHEIGHT),

    createAnimatedFloorRed(2*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(3*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(4*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(5*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(6*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(7*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(4*TILEWIDTH, TILEHEIGHT),
    createAnimatedFloorRed(5*TILEWIDTH, TILEHEIGHT),

    createFirePlace(3*TILEWIDTH, TILEHEIGHT),
    createFirePlace(6*TILEWIDTH, TILEHEIGHT),

    createVase(TILEWIDTH, TILEHEIGHT),
    createVase(2*TILEWIDTH, TILEHEIGHT),
    createVase(TILEWIDTH, TILEHEIGHT*2),
    createVase(8*TILEWIDTH, TILEHEIGHT),
    createVase(7*TILEWIDTH, TILEHEIGHT),
    createVase(8*TILEWIDTH, TILEHEIGHT*2),
    createVase(TILEWIDTH, 6*TILEHEIGHT),
    createVase(8*TILEWIDTH, 6*TILEHEIGHT),
];
const dungeon_tile21 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 384+4, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0.0, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(0.0, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, 7*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 7*TILEHEIGHT, 7*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
];
const dungeon_tile22 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 384+4, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),

    new InvisibleWall(2*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
];
const dungeon_tile23 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 384+4, sWidth: 160, sHeight: 128}),
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*3 ),

    new InvisibleWall(2*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
];
const dungeon_tile24 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 384+4, sWidth: 160, sHeight: 128})];
// ROW5
const dungeon_tile25 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 512+5, sWidth: 160, sHeight: 128})];
const dungeon_tile26 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 512+5, sWidth: 160, sHeight: 128}),
    entrance_dungeon,
    createFirePlace(TILEWIDTH, TILEHEIGHT),
    createFirePlace(TILEWIDTH, 6*TILEHEIGHT),
    createFirePlace(8*TILEWIDTH, TILEHEIGHT),
    createFirePlace(8*TILEWIDTH, 6*TILEHEIGHT),
    new InvisibleWall(0.0, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 0*TILEHEIGHT, 4*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(3*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(6*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT ),
    statue1,
    statue2,
];
const dungeon_tile27 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 512+5, sWidth: 160, sHeight: 128})];
const dungeon_tile28 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 512+5, sWidth: 160, sHeight: 128})];
const dungeon_tile29 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 512+5, sWidth: 160, sHeight: 128})];
const dungeon_tile30 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 512+5, sWidth: 160, sHeight: 128})];


const level1 = new Level(0, dungeon_tile1);
const level2 = new Level(1, dungeon_tile2);
const level3 = new Level(2, dungeon_tile3);
const level4 = new Level(3, dungeon_tile4);
const level5 = new Level(4, dungeon_tile5);
const level6 = new Level(5, dungeon_tile6);
const level7 = new Level(6, dungeon_tile7);
const level8 = new Level(7, dungeon_tile8);
const level9 = new Level(8, dungeon_tile9);
const level10 = new Level(9, dungeon_tile10);
const level11 = new Level(10, dungeon_tile11);
const level12 = new Level(11, dungeon_tile12);
const level13 = new Level(12, dungeon_tile13);
const level14 = new Level(13, dungeon_tile14);
const level15 = new Level(14, dungeon_tile15);
const level16 = new Level(15, dungeon_tile16);
const level17 = new Level(16, dungeon_tile17);
const level18 = new Level(17, dungeon_tile18);
const level19 = new Level(18, dungeon_tile19);
const level20 = new Level(19, dungeon_tile20);
const level21 = new Level(20, dungeon_tile21);
const level22 = new Level(21, dungeon_tile22);
const level23 = new Level(22, dungeon_tile23);
const level24 = new Level(23, dungeon_tile24);
const level25 = new Level(24, dungeon_tile25);
const level26 = new Level(25, dungeon_tile26);
const level27 = new Level(26, dungeon_tile27);
const level28 = new Level(27, dungeon_tile28);
const level29 = new Level(28, dungeon_tile29);
const level30 = new Level(29, dungeon_tile30);


world.maps["dungeon1"].setLevels([
    level1, level2, level3, level4, level5, level6,
    level7, level8, level9, level10, level11, level12,
    level13, level14, level15, level16, level17, level18,
    level19, level20, level21, level22, level23, level24,
    level25, level26, level27, level28, level29, level30
]); 