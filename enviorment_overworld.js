// Script to generate the overworld environment
// We use textures.overworld
// The textures.overworld has 16x16 tiles of 160x128 pixels, they are separated by 1px


//  Doors
const enter_dungeon = new Door(x=TILEWIDTH*7, y=TILEHEIGHT,  
    texture=null,
    map=world.maps["overworld"], 
    level=119,
    active=false, 
    door=null
);
const entrance_dungeon = new Door(x=TILEWIDTH*5, y=5*TILEHEIGHT,  
    texture=null,
    map=world.maps["dungeon1"], 
    level=25,
    active=false, 
    door=null
);
enter_dungeon.setDoor(entrance_dungeon);
entrance_dungeon.setDoor(enter_dungeon);

const special_tombstone = new Tombstone(x=TILEWIDTH*7, y=TILEHEIGHT);
special_tombstone.callback = function() {
    special_tombstone.x = TILEWIDTH*7;
    special_tombstone.y = TILEHEIGHT*2;
    console.log("Tombstone callback executed");
}

//  Chests
const principal_chest =  new Chest(TILEWIDTH*4, TILEHEIGHT);
principal_chest.content = BraceletStrength;
principal_chest.callback = function() {
    console.log("Chest callback executed");
    principal_chest.open();
}

const enemyOctoOver = new Enemy(0.4, 0.4, TILEWIDTH, 1/9); //Para testear
const enemyOctoOver1 = new Enemy(0.4, 0.2, TILEWIDTH, 1/9); //Para testear


//Remember the tile we work is on debug +1. Example debug says 103 we are working on the code on 104

// ROW1
const tile1 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile2 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile3 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile4 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile5 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile6 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile7 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile8 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile9 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile10 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile11 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile12 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile13 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile14 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile15 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1, sWidth: 160, sHeight: 128}), 
];
const tile16 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1, sWidth: 160, sHeight: 128}), 
];
// ROW2
const tile17 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile18 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile19 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile20 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile21 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile22 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile23 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile24 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile25 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile26 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile27 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile28 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile29 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile30 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile31 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
const tile32 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 128+2, sWidth: 160, sHeight: 128}), 
];
// ROW3
const tile33 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile34 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile35 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile36 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile37 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile38 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile39 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile40 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile41 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile42 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile43 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile44 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile45 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile46 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile47 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
const tile48 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 256+3, sWidth: 160, sHeight: 128}), 
];
// ROW4
const tile49 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile50 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile51 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile52 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile53 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile54 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile55 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile56 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile57 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile58 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile59 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile60 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile61 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile62 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile63 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
const tile64 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 384+4, sWidth: 160, sHeight: 128}), 
];
// ROW5
const tile65 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile66 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile67 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile68 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile69 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile70 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile71 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile72 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile73 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile74 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile75 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile76 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile77 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile78 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile79 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 512+5, sWidth: 160, sHeight: 128}), 
];
const tile80 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 512+5, sWidth: 160, sHeight: 128}), 
];

// ROW6
const tile81 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile82 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile83 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile84 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile85 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile86 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile87 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile88 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile89 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile90 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile91 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile92 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile93 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile94 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile95 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 640+6, sWidth: 160, sHeight: 128}), 
];
const tile96 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 640+6, sWidth: 160, sHeight: 128}), 
];

// ROW7
const tile97 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile98 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile99 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile100 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile101 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile102 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 768+7, sWidth: 160, sHeight: 128}), 
];;
const tile103 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile104 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 768+7, sWidth: 160, sHeight: 128}), 
    principal_chest,
    new InvisibleWall(TILEWIDTH*7,TILEHEIGHT,TILEWIDTH*5,TILEHEIGHT),
    new InvisibleWall(TILEWIDTH*7,TILEHEIGHT*0,TILEWIDTH*5,TILEHEIGHT),
    new InvisibleWall(TILEWIDTH,TILEHEIGHT,TILEWIDTH*3,TILEHEIGHT),
    new InvisibleWall(TILEWIDTH*0,TILEHEIGHT*4,TILEWIDTH,8*TILEHEIGHT),
    new InvisibleWall(TILEWIDTH*9,TILEHEIGHT*4,TILEWIDTH,8*TILEHEIGHT),
    new Tombstone(TILEWIDTH*3, TILEHEIGHT*3),
    new Tombstone(TILEWIDTH*5, TILEHEIGHT*3),
    new Tombstone(TILEWIDTH*7, TILEHEIGHT*3),
    new Tombstone(TILEWIDTH*3, TILEHEIGHT*5),
    new Tombstone(TILEWIDTH*5, TILEHEIGHT*5),
    enemyOctoOver,
    new Statue(TILEWIDTH*3, TILEHEIGHT*0, ["Some tools will provide super habilityes.", "Find them on chests."]),
    new Statue(TILEWIDTH*1, TILEHEIGHT*2, ["A tombstone is missing :(", "If you try to bring it up, it may lead you to an adventure."]),

];
const tile105 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile106 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile107 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile108 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile109 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile110 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile111 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
const tile112 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 768+7, sWidth: 160, sHeight: 128}), 
];
// ROW8
const tile113 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile114 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile115 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile116 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile117 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile118 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile119 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile120 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 896+8, sWidth: 160, sHeight: 128}), 
	    enter_dungeon,
	    special_tombstone,
	    new InvisibleWall(TILEWIDTH*9,3.5*TILEHEIGHT,TILEWIDTH,8*TILEHEIGHT),
	    new InvisibleWall(TILEWIDTH*7,TILEHEIGHT*4,TILEWIDTH*3,TILEHEIGHT),
	    new InvisibleWall(TILEWIDTH*2,5*TILEHEIGHT,TILEWIDTH*7,TILEHEIGHT),
	    new InvisibleWall(TILEWIDTH*0,0*TILEHEIGHT,TILEWIDTH,TILEHEIGHT*3),
	    enemyOctoOver,
	    //enemyOctoOver1

];
const tile121 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile122 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile123 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile124 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile125 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile126 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile127 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 896+8, sWidth: 160, sHeight: 128}), 
];
const tile128 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 896+8, sWidth: 160, sHeight: 128}), 
];

// ROW9
const tile129 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile130 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile131 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile132 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile133 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile134 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile135 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile136 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile137 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile138 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile139 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile140 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile141 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile142 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile143 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];
const tile144 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1024+9, sWidth: 160, sHeight: 128}), 
];

// ROW10
const tile145 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile146 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile147 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile148 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile149 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile150 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile151 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile152 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile153 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile154 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile155 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile156 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile157 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile158 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile159 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
const tile160 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1152+10, sWidth: 160, sHeight: 128}), 
];
// ROW11
const tile161 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1280+11, sWidth: 160, sHeight: 128}), 
];
const tile162 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1280+11, sWidth: 160, sHeight: 128}), 
];
const tile163 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 320+3, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile164 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 480+4, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile165 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 640+5, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile166 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 800+6, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile167 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 960+7, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile168 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 1120+8, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile169 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 1280+9, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile170 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 1440+10, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile171 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 1600+11, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile172 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 1760+12, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile173 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 1920+13, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile174 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 2080+14, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile175 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 2240+15, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
const tile176 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black",
        drawing_settings={sx: 2400+16, sy: 1280+11, sWidth: 160, sHeight: 128}),
];
// ROW12
const tile177 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile178 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile179 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile180 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile181 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile182 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile183 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile184 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile185 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile186 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile187 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile188 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile189 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile190 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile191 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];
const tile192 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1408+12, sWidth: 160, sHeight: 128}), 
];

// ROW13
const tile193 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile194 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile195 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile196 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile197 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile198 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile199 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile200 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile201 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile202 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile203 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile204 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile205 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile206 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile207 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
const tile208 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1536+13, sWidth: 160, sHeight: 128}), 
];
// ROW14
const tile209 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile210 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile211 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile212 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile213 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile214 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile215 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile216 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile217 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile218 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile219 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile220 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile221 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile222 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile223 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];
const tile224 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1664+14, sWidth: 160, sHeight: 128}), 
];

// ROW15
const tile225 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile226 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile227 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile228 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile229 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile230 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile231 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile232 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile233 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile234 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile235 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile236 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile237 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile238 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile239 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
const tile240 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1792+15, sWidth: 160, sHeight: 128}), 
];
// ROW16
const tile241 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile242 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 160+2, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile243 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 320+3, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile244 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 480+4, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile245 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 640+5, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile246 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 800+6, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile247 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 960+7, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile248 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1120+8, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile249 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1280+9, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile250 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1440+10, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile251 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1600+11, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile252 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1760+12, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile253 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 1920+13, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile254 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2080+14, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile255 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2240+15, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];
const tile256 = [
    new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.overworld, color="black", 
        drawing_settings={sx: 2400+16, sy: 1920+16, sWidth: 160, sHeight: 128}), 
];


const levelsToAdd = [];
for (let i = 1; i <= 256; i++) {
    const tile = eval(`tile${i}`);
    levelsToAdd.push(new Level(i - 1, tile));
}

world.maps["overworld"].setLevels(levelsToAdd); 
