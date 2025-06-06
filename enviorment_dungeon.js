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

// GATES
const gate1 = new Portcullis(9 * TILEWIDTH, 3 * TILEHEIGHT, 2,);
const gate2 = new Portcullis(0 * TILEWIDTH, 3 * TILEHEIGHT, 3,);
const gate3 = new Portcullis(9 * TILEWIDTH, 3 * TILEHEIGHT, 2,);
const gate4 = new Portcullis(0 * TILEWIDTH, 3 * TILEHEIGHT, 3);
const gate5 = new Portcullis(4 * TILEWIDTH, 7 * TILEHEIGHT, 1);
const gate11_1 = new Portcullis(0 * TILEWIDTH, 3 * TILEHEIGHT, 3);
const gate11_2 = new Portcullis(4 * TILEWIDTH, 0 * TILEHEIGHT, 0);
const gate13 = new Portcullis(4 * TILEWIDTH, 0 * TILEHEIGHT, 0);
const gate15_1 = new Portcullis(0 * TILEWIDTH, 3 * TILEHEIGHT, 3);
const gate15_2 = new Portcullis(4 * TILEWIDTH, 7 * TILEHEIGHT, 1);

const gate0_1 = new Portcullis(9 * TILEWIDTH, 3 * TILEHEIGHT, 2);
const gate0_2 = new Portcullis(4 * TILEWIDTH, 7 * TILEHEIGHT, 1);

const gate_22 = new Portcullis(4 * TILEWIDTH, 0 * TILEHEIGHT, 0);

gate4.open();
gate5.open();
gate11_1.open();
gate11_2.open();
gate15_1.open();
gate15_2.open();
gate0_1.open();
gate0_2.open();


const keyA = new Key("A", "Door Key");
const locked_gate1 = new PortcullisKeyLock(
    4 * TILEWIDTH, 
    0 * TILEHEIGHT, 
    keyA,
)

const keyB = new Key("B", "Door Key");
const locked_gate2 = new PortcullisKeyLock(
    0 * TILEWIDTH, 
    3 * TILEHEIGHT, 
    keyB,
    3
)

const keyC = new Key("C", "Door Key");
const locked_gate3 = new PortcullisKeyLock(
    4 * TILEWIDTH, 
    0 * TILEHEIGHT, 
    keyC,
    0
)
locked_gate3.texture = textures.portcullis_boss;

// StrongRocks
function strongRock(x, y) {
    const rock = new Tombstone(x,y);
    rock.texture = textures.rock;
    return rock;
}


const rock1 = strongRock(TILEWIDTH*5, TILEHEIGHT*4);
const rock2 = strongRock(TILEWIDTH*5, TILEHEIGHT*5);
const rock3 = strongRock(TILEWIDTH*5, TILEHEIGHT*6);

// ROTORES
const rotor0 = new Rotor(TILEWIDTH*2, TILEHEIGHT*2, identifier=0, neighbors=[1], current_color=2);
const rotor1 = new Rotor(TILEWIDTH*7, TILEHEIGHT*2, identifier=1, neighbors=[2], current_color=0);
const rotor2 = new Rotor(TILEWIDTH*2, TILEHEIGHT*5, identifier=2, neighbors=[3], current_color=1);
const rotor3 = new Rotor(TILEWIDTH*7, TILEHEIGHT*5, identifier=3, neighbors=[0], current_color=3);


const BIGrotor1 = new Rotor(TILEWIDTH*2, TILEHEIGHT*2, identifier=0, neighbors=[1], current_color=2);
const BIGrotor2 = new Rotor(TILEWIDTH*4, TILEHEIGHT*2, identifier=1, neighbors=[2], current_color=0);
const BIGrotor3 = new Rotor(TILEWIDTH*6, TILEHEIGHT*2, identifier=2, neighbors=[3], current_color=1);
const BIGrotor4 = new Rotor(TILEWIDTH*2, TILEHEIGHT*4, identifier=3, neighbors=[4], current_color=3);
const BIGrotor5 = new Rotor(TILEWIDTH*4, TILEHEIGHT*4, identifier=4, neighbors=[5], current_color=2);
const BIGrotor6 = new Rotor(TILEWIDTH*6, TILEHEIGHT*4, identifier=5, neighbors=[6], current_color=0);
const BIGrotor7 = new Rotor(TILEWIDTH*2, TILEHEIGHT*6, identifier=6, neighbors=[7], current_color=1);
const BIGrotor8 = new Rotor(TILEWIDTH*4, TILEHEIGHT*6, identifier=7, neighbors=[8], current_color=3);
const BIGrotor9 = new Rotor(TILEWIDTH*6, TILEHEIGHT*6, identifier=8, neighbors=[0], current_color=0);

BIGrotor1.onSolved = customOnSolved2;
BIGrotor2.onSolved = customOnSolved2;
BIGrotor3.onSolved = customOnSolved2;
BIGrotor4.onSolved = customOnSolved2;
BIGrotor5.onSolved = customOnSolved2;
BIGrotor6.onSolved = customOnSolved2;
BIGrotor7.onSolved = customOnSolved2;
BIGrotor8.onSolved = customOnSolved2;
BIGrotor9.onSolved = customOnSolved2;

const hidden_chest =  new Chest(TILEWIDTH*12, TILEHEIGHT*12);
hidden_chest.content = keyA;
hidden_chest.callback = function() {
    hidden_chest.open();
}

// This chest will contain the flying boots
const boss_chest1 = new Chest(TILEWIDTH*4, TILEHEIGHT*1);
boss_chest1.content = Feather;
boss_chest1.callback = function() {
    boss_chest1.open();
}

const shield_chest = new Chest(TILEWIDTH*2, TILEHEIGHT*5);
shield_chest.content = Shield;
shield_chest.callback = function() {
    shield_chest.open();
}

const keyB_chest = new Chest(TILEWIDTH*22, TILEHEIGHT*2);
keyB_chest.content = keyB;
keyB_chest.callback = function() {
    keyB_chest.open();
}

const keyC_chest = new Chest(TILEWIDTH*5, TILEHEIGHT*1);
keyC_chest.content = keyC;
keyC_chest.callback = function() {
    keyC_chest.open();
}


// INSTRUMENTS
const instrument1 = new Instrument(TILEWIDTH*4, TILEHEIGHT*4.5);

function customOnSolved(player) {
    // Possible chest positions
    const positions = [
        { x: TILEWIDTH, y: TILEHEIGHT },
        { x: TILEWIDTH * 8, y: TILEHEIGHT * 6 }
    ];

    // Calculate distances from player to each position
    const distances = positions.map(pos => {
        const dx = player.x - pos.x;
        const dy = player.y - pos.y;
        return dx * dx + dy * dy; // squared distance
    });

    // Find the index of the furthest position
    const furthestIndex = distances[0] > distances[1] ? 0 : 1;
    const pos = positions[furthestIndex];
    hidden_chest.x = pos.x;
    hidden_chest.y = pos.y;
    hidden_chest.boundingBox.x = pos.x+ TILEWIDTH / 2; 
    hidden_chest.boundingBox.y = pos.y+ TILEHEIGHT / 2; 

    const chest = player.scene.levelContent.find(obj => obj instanceof Chest);
    if (chest) {
        chest.x = pos.x;
        chest.y = pos.y;
        chest.boundingBox.x = pos.x+ TILEWIDTH / 2; 
        chest.boundingBox.y = pos.y+ TILEHEIGHT / 2; 
        chest.defaultX = pos.x;
        chest.defaultY = pos.y;
    }

}
rotor0.onSolved = customOnSolved;
rotor1.onSolved = customOnSolved;
rotor2.onSolved = customOnSolved;
rotor3.onSolved = customOnSolved;


const rotor4 = new Rotor(TILEWIDTH*3, TILEHEIGHT*2, identifier=0, neighbors=[1], current_color=2);
const rotor5 = new Rotor(TILEWIDTH*6, TILEHEIGHT*2, identifier=1, neighbors=[3], current_color=0);
const rotor6 = new Rotor(TILEWIDTH*3, TILEHEIGHT*5, identifier=2, neighbors=[3], current_color=1);
const rotor7 = new Rotor(TILEWIDTH*6, TILEHEIGHT*5, identifier=3, neighbors=[1], current_color=3);
function customOnSolved2(player) {
// Open this levels gate
   const gate = player.scene.levelContent.find(obj => obj instanceof Portcullis);
   if(gate) {
       gate.open();
   }
}
rotor4.onSolved = customOnSolved2;
rotor5.onSolved = customOnSolved2;
rotor6.onSolved = customOnSolved2;
rotor7.onSolved = customOnSolved2;

//Enemies
const enemyOcto1 = new Enemy(0.4, 0.4, TILEWIDTH, 1/9); //En caso de querer añadir texturas añadirlo como ultimo parametro.
const enemyOrbMonsBlue = new OrbMonster(TILEWIDTH*4, TILEHEIGHT*6, TILEWIDTH, TILEHEIGHT, undefined, "blue");

// The map contains 6x5 tiles, each tile is 160x128 pixels but they have a 1px gap between them
// ROW1
const dungeon_tile1 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
        drawing_settings={sx: 0+1, sy: 1, sWidth: 160, sHeight: 128}), 
        gate0_1, gate0_2,

        new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ), // top
        new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ), // top
        new InvisibleWall(9*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ), // top
        new InvisibleWall(0*TILEWIDTH, 3.5*TILEHEIGHT, 1*TILEWIDTH, 8*TILEHEIGHT ), // top
        new InvisibleWall(9*TILEWIDTH, 8*TILEHEIGHT, 1*TILEWIDTH, 8*TILEHEIGHT ), // top
        new InvisibleWall(9*TILEWIDTH, 1*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ), // top

        
];
const dungeon_tile2 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 160+2, sy: 1, sWidth: 160, sHeight: 128}),
    instrument1,

    new Lights(TILEWIDTH*2, TILEHEIGHT*0),
    new Lights(TILEWIDTH*7, TILEHEIGHT*0),
    new Lights(TILEWIDTH*2, TILEHEIGHT*7, 1),
    new Lights(TILEWIDTH*7, TILEHEIGHT*7, 1),

];
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

    new createFirePlace(TILEWIDTH*1, TILEHEIGHT*1),
    new createFirePlace(TILEWIDTH*7, TILEHEIGHT*1),

    new Lights(TILEWIDTH*2, TILEHEIGHT*7, 1),
    new Lights(TILEWIDTH*6, TILEHEIGHT*7, 1),

    boss_chest1,
    rock1,
    rock2,
    rock3,

    

];
const dungeon_tile6 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 800+6, sy: 1, sWidth: 160, sHeight: 128}),

    new InvisibleWall(0*TILEWIDTH, 0*TILEHEIGHT, 20*TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(9*TILEWIDTH, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),

    new InvisibleWall(0*TILEWIDTH, 0*TILEHEIGHT, TILEWIDTH, 6*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 7*TILEHEIGHT, TILEWIDTH, 6*TILEHEIGHT ),
    gate4,
    gate5,

];
// ROW2
const dungeon_tile7 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 128+2, sWidth: 160, sHeight: 128}),
    locked_gate3,

    new InvisibleWall(1*TILEWIDTH, 0*TILEHEIGHT, 3*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 0*TILEHEIGHT, 3*TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(0*TILEWIDTH, 4*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(5*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    
    new InvisibleWall(9*TILEWIDTH, 1*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),

    new Lights(TILEWIDTH*3, TILEHEIGHT*0),
    new Lights(TILEWIDTH*6, TILEHEIGHT*0),

    new FloatingFloor(TILEWIDTH*1, TILEHEIGHT*1, 0),
    new FloatingFloor(TILEWIDTH*2, TILEHEIGHT*1, 0),
    new FloatingFloor(TILEWIDTH*1, TILEHEIGHT*2, 0),
    new FloatingFloor(TILEWIDTH*2, TILEHEIGHT*2, 0),

    new FloatingFloor(TILEWIDTH*1, TILEHEIGHT*3, 0),
    new FloatingFloor(TILEWIDTH*2, TILEHEIGHT*3, 0),
    new FloatingFloor(TILEWIDTH*3, TILEHEIGHT*3, 0),
    new FloatingFloor(TILEWIDTH*4, TILEHEIGHT*3, 0),
    new FloatingFloor(TILEWIDTH*5, TILEHEIGHT*3, 0),
    new FloatingFloor(TILEWIDTH*6, TILEHEIGHT*3, 0),
    new FloatingFloor(TILEWIDTH*7, TILEHEIGHT*3, 0),

    new FloatingFloor(TILEWIDTH*1, TILEHEIGHT*4, 0),
    new FloatingFloor(TILEWIDTH*2, TILEHEIGHT*4, 0),
    new FloatingFloor(TILEWIDTH*3, TILEHEIGHT*4, 0),
    new FloatingFloor(TILEWIDTH*4, TILEHEIGHT*4, 0),
    new FloatingFloor(TILEWIDTH*5, TILEHEIGHT*4, 0),
    new FloatingFloor(TILEWIDTH*6, TILEHEIGHT*4, 0),
    new FloatingFloor(TILEWIDTH*7, TILEHEIGHT*4, 0),

    new FloatingFloor(TILEWIDTH*1, TILEHEIGHT*5, 0),
    new FloatingFloor(TILEWIDTH*2, TILEHEIGHT*5, 0),
    new FloatingFloor(TILEWIDTH*3, TILEHEIGHT*5, 0),
    new FloatingFloor(TILEWIDTH*4, TILEHEIGHT*5, 0),
    new FloatingFloor(TILEWIDTH*5, TILEHEIGHT*5, 0),
    new FloatingFloor(TILEWIDTH*6, TILEHEIGHT*5, 0),
    new FloatingFloor(TILEWIDTH*7, TILEHEIGHT*5, 0),

    new SeaUrchin(TILEWIDTH*8, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),
    new Octorok(TILEWIDTH*7, TILEHEIGHT*6, TILEWIDTH, TILEHEIGHT),

];
const dungeon_tile8 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 128+2, sWidth: 160, sHeight: 128}),
    
    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(1*TILEWIDTH, 7*TILEHEIGHT, 6*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 7*TILEHEIGHT, 6*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 4*TILEHEIGHT, 1*TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 1*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ),

    createFirePlace(TILEWIDTH*2, TILEHEIGHT*0),
    createFirePlace(TILEWIDTH*7, TILEHEIGHT*0),
    
    locked_gate2,

    new Octorok(TILEWIDTH*3, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),
    new Octorok(TILEWIDTH*6, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT),

    new SeaUrchin(TILEWIDTH*3, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT),
    new SeaUrchin(TILEWIDTH*6, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),

];
const dungeon_tile9 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 128+2, sWidth: 160, sHeight: 128}),

    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 4.5*TILEHEIGHT, 1*TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(2*TILEWIDTH, 7*TILEHEIGHT, 4*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 1*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ),

    new InvisibleWall(3*TILEWIDTH, 2*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(3*TILEWIDTH, 3*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(4*TILEWIDTH, 3*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(4*TILEWIDTH, 4*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(5*TILEWIDTH, 4*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(5*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(6*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(1*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(1*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),

    new InvisibleWall(8*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(7*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),

    new Lights(TILEWIDTH*3, TILEHEIGHT*0),
    new Lights(TILEWIDTH*6, TILEHEIGHT*0),
    new Lights(TILEWIDTH*0, TILEHEIGHT*2, 2),
    new Lights(TILEWIDTH*0, TILEHEIGHT*5, 2),
    new Lights(TILEWIDTH*9, TILEHEIGHT*5, 3),
    new Lights(TILEWIDTH*9, TILEHEIGHT*2, 3),

    keyB_chest,

    new Octorok(TILEWIDTH*4, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT), // Octorok enemy
    new Octorok(TILEWIDTH*6, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT), // Octorok enemy
];
const dungeon_tile10 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 128+2, sWidth: 160, sHeight: 128}),

    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, 10*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 3.5*TILEHEIGHT, TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 1.5*TILEHEIGHT, TILEWIDTH, 3*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 5.5*TILEHEIGHT, TILEWIDTH, 3*TILEHEIGHT ),

    new Lights(TILEWIDTH*2, TILEHEIGHT*0),
    new Lights(TILEWIDTH*7, TILEHEIGHT*0),

    new OrbMonster(TILEWIDTH*3, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT, undefined, "green"),
    new OrbMonster(TILEWIDTH*6, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT, undefined, "red"),
    new OrbMonster(TILEWIDTH*2, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT, undefined, "blue"),
    new OrbMonster(TILEWIDTH*7, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT, undefined, "green"),

    new Pipe(TILEWIDTH*2, TILEHEIGHT*2, "green"),
    new Pipe(TILEWIDTH*7, TILEHEIGHT*2, "red"),
    new Pipe(TILEWIDTH*2, TILEHEIGHT*5, "blue"),
    new Pipe(TILEWIDTH*7, TILEHEIGHT*5, "green"),

    keyC_chest,


];
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

    createFirePlace(TILEWIDTH*2, TILEHEIGHT*1),
    createFirePlace(TILEWIDTH*7, TILEHEIGHT*1),
    createFirePlace(TILEWIDTH*2, TILEHEIGHT*6),
    createFirePlace(TILEWIDTH*7, TILEHEIGHT*6),

    rotor4,
    rotor5,
    rotor6,
    rotor7,

    new SeaUrchin(TILEWIDTH*5, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT),
    
    gate3,
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

    createAnimatedFloorGreen(1*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorGreen(1*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(1*TILEWIDTH, 4*TILEHEIGHT),
    createAnimatedFloorGreen(1*TILEWIDTH, 3*TILEHEIGHT),
    createAnimatedFloorGreen(1*TILEWIDTH, 2*TILEHEIGHT),
    createAnimatedFloorGreen(2*TILEWIDTH, 3*TILEHEIGHT),
    createAnimatedFloorGreen(2*TILEWIDTH, 4*TILEHEIGHT),
    createAnimatedFloorGreen(2*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorGreen(3*TILEWIDTH, 4*TILEHEIGHT),

    createAnimatedFloorBlue(3*TILEWIDTH, 1*TILEHEIGHT),
    createAnimatedFloorBlue(4*TILEWIDTH, 1*TILEHEIGHT),
    createAnimatedFloorBlue(5*TILEWIDTH, 1*TILEHEIGHT),
    createAnimatedFloorBlue(6*TILEWIDTH, 1*TILEHEIGHT),
    createAnimatedFloorBlue(7*TILEWIDTH, 1*TILEHEIGHT),
    createAnimatedFloorBlue(6*TILEWIDTH, 2*TILEHEIGHT),
    createAnimatedFloorBlue(5*TILEWIDTH, 2*TILEHEIGHT),
    createAnimatedFloorBlue(4*TILEWIDTH, 2*TILEHEIGHT),
    createAnimatedFloorBlue(5*TILEWIDTH, 3*TILEHEIGHT),

    createAnimatedFloorRed(8*TILEWIDTH, 3*TILEHEIGHT),
    createAnimatedFloorRed(8*TILEWIDTH, 4*TILEHEIGHT),
    createAnimatedFloorRed(8*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorRed(8*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorRed(7*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorRed(7*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorRed(7*TILEWIDTH, 4*TILEHEIGHT),
    createAnimatedFloorRed(6*TILEWIDTH, 5*TILEHEIGHT),
    createAnimatedFloorRed(6*TILEWIDTH, 6*TILEHEIGHT),
    createAnimatedFloorRed(5*TILEWIDTH, 6*TILEHEIGHT),

    new Lights(TILEWIDTH*3, TILEHEIGHT*0),
    new Lights(TILEWIDTH*6, TILEHEIGHT*0),

    gate11_1,
    gate11_2,

];
// ROW3
const dungeon_tile13 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",    
    drawing_settings={sx: 0+1, sy: 256+3, sWidth: 160, sHeight: 128})];
const dungeon_tile14 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 256+3, sWidth: 160, sHeight: 128}),

    new InvisibleWall(0*TILEWIDTH, 0*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 0*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 3*TILEHEIGHT, 1*TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 2*TILEHEIGHT, 1*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 1*TILEHEIGHT, 1*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 2.5*TILEHEIGHT, 1*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 4.5*TILEHEIGHT, 1*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 5*TILEHEIGHT, 1*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH, 6*TILEHEIGHT, 1*TILEWIDTH, 1*TILEHEIGHT ),

    createFirePlace(TILEWIDTH*1, TILEHEIGHT*1),
    createFirePlace(TILEWIDTH*7, TILEHEIGHT*1),
    createFirePlace(TILEWIDTH*1, TILEHEIGHT*6),
    createFirePlace(TILEWIDTH*7, TILEHEIGHT*6),

    BIGrotor1,
    BIGrotor2,
    BIGrotor3,
    BIGrotor4,
    BIGrotor5,
    BIGrotor6,
    BIGrotor7,
    BIGrotor8,
    BIGrotor9,
    gate13,

    new OrbMonster(TILEWIDTH*7, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT, undefined, "red"),
    new OrbMonster(TILEWIDTH*7, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT, undefined, "red"),

];
const dungeon_tile15 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 256+3, sWidth: 160, sHeight: 128}),

    new InvisibleWall(0*TILEWIDTH, 0*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 0*TILEHEIGHT, 8*TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 1*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 6*TILEHEIGHT, 1*TILEWIDTH, 4*TILEHEIGHT ),
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, 9*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 5.5*TILEHEIGHT, 1*TILEWIDTH, 3*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 1.5*TILEHEIGHT, 1*TILEWIDTH, 3*TILEHEIGHT ),
    new InvisibleWall(1*TILEWIDTH,1*TILEHEIGHT, 1*TILEWIDTH,1*TILEHEIGHT ),
    new InvisibleWall(8*TILEWIDTH,6*TILEHEIGHT, 1*TILEWIDTH,1*TILEHEIGHT ),

    new FloatingFloor(3*TILEWIDTH, 1*TILEHEIGHT, 0),
    new FloatingFloor(6*TILEWIDTH, 1*TILEHEIGHT, 0),
    new FloatingFloor(7*TILEWIDTH, 1*TILEHEIGHT, 0),

    new FloatingFloor(2*TILEWIDTH, 2*TILEHEIGHT, 0),
    new FloatingFloor(3*TILEWIDTH, 2*TILEHEIGHT, 0),
    new FloatingFloor(4*TILEWIDTH, 2*TILEHEIGHT, 0),
    new FloatingFloor(5*TILEWIDTH, 2*TILEHEIGHT, 0),
    new FloatingFloor(6*TILEWIDTH, 2*TILEHEIGHT, 0),
    new FloatingFloor(7*TILEWIDTH, 2*TILEHEIGHT, 0),    

    new FloatingFloor(2*TILEWIDTH, 3*TILEHEIGHT, 0),
    new FloatingFloor(3*TILEWIDTH, 3*TILEHEIGHT, 0),
    new FloatingFloor(4*TILEWIDTH, 3*TILEHEIGHT, 0),
    new FloatingFloor(5*TILEWIDTH, 3*TILEHEIGHT, 0),
    new FloatingFloor(6*TILEWIDTH, 3*TILEHEIGHT, 0),
    new FloatingFloor(7*TILEWIDTH, 3*TILEHEIGHT, 0),   

    new FloatingFloor(2*TILEWIDTH, 4*TILEHEIGHT, 0),
    new FloatingFloor(3*TILEWIDTH, 4*TILEHEIGHT, 0),
    new FloatingFloor(4*TILEWIDTH, 4*TILEHEIGHT, 0),
    new FloatingFloor(5*TILEWIDTH, 4*TILEHEIGHT, 0),
    new FloatingFloor(6*TILEWIDTH, 4*TILEHEIGHT, 0),
    new FloatingFloor(7*TILEWIDTH, 4*TILEHEIGHT, 0),  

    new FloatingFloor(2*TILEWIDTH, 5*TILEHEIGHT, 0),
    new FloatingFloor(3*TILEWIDTH, 5*TILEHEIGHT, 0),
    new FloatingFloor(4*TILEWIDTH, 5*TILEHEIGHT, 0),
    new FloatingFloor(5*TILEWIDTH, 5*TILEHEIGHT, 0),
    new FloatingFloor(6*TILEWIDTH, 5*TILEHEIGHT, 0),

    new FloatingFloor(2*TILEWIDTH, 6*TILEHEIGHT, 0),
    new FloatingFloor(3*TILEWIDTH, 6*TILEHEIGHT, 0),
    new FloatingFloor(4*TILEWIDTH, 6*TILEHEIGHT, 0),
    new FloatingFloor(5*TILEWIDTH, 6*TILEHEIGHT, 0),
    new FloatingFloor(6*TILEWIDTH, 6*TILEHEIGHT, 0),

    new Octorok(TILEWIDTH*2, TILEHEIGHT*1, TILEWIDTH, TILEHEIGHT),
    new Octorok(TILEWIDTH*7, TILEHEIGHT*6, TILEWIDTH, TILEHEIGHT),
];
const dungeon_tile16 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 256+3, sWidth: 160, sHeight: 128}),

    new InvisibleWall(0*TILEWIDTH, 1.5*TILEHEIGHT, TILEWIDTH, 3*TILEHEIGHT ),
    new InvisibleWall(0*TILEWIDTH, 5.5*TILEHEIGHT, TILEWIDTH, 3*TILEHEIGHT ),
    new InvisibleWall(1.5*TILEWIDTH, 7*TILEHEIGHT, 5*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(7.5*TILEWIDTH, 7*TILEHEIGHT, 5*TILEWIDTH, 1*TILEHEIGHT ),
    new InvisibleWall(9*TILEWIDTH, 4.5*TILEHEIGHT, 1*TILEWIDTH, 8*TILEHEIGHT ),
    new InvisibleWall(4.5*TILEWIDTH, 0*TILEHEIGHT, 9*TILEWIDTH, 1*TILEHEIGHT ),

    gate15_1, gate15_2,

];
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

    new FloatingFloor(3*TILEWIDTH, 2*TILEHEIGHT),
    new FloatingFloor(4*TILEWIDTH, 2*TILEHEIGHT),
    new FloatingFloor(5*TILEWIDTH, 2*TILEHEIGHT),
    new FloatingFloor(6*TILEWIDTH, 2*TILEHEIGHT),

    new FloatingFloor(3*TILEWIDTH, 3*TILEHEIGHT),
    new FloatingFloor(4*TILEWIDTH, 3*TILEHEIGHT),
    new FloatingFloor(5*TILEWIDTH, 3*TILEHEIGHT),
    new FloatingFloor(6*TILEWIDTH, 3*TILEHEIGHT),

    new FloatingFloor(3*TILEWIDTH, 4*TILEHEIGHT),
    new FloatingFloor(4*TILEWIDTH, 4*TILEHEIGHT),
    new FloatingFloor(5*TILEWIDTH, 4*TILEHEIGHT),
    new FloatingFloor(6*TILEWIDTH, 4*TILEHEIGHT),

    new FloatingFloor(3*TILEWIDTH, 5*TILEHEIGHT),
    new FloatingFloor(4*TILEWIDTH, 5*TILEHEIGHT),
    new FloatingFloor(5*TILEWIDTH, 5*TILEHEIGHT),
    new FloatingFloor(6*TILEWIDTH, 5*TILEHEIGHT),

    new FloatingFloor(2*TILEWIDTH, 3*TILEHEIGHT,1),
    new FloatingFloor(2*TILEWIDTH, 4*TILEHEIGHT,2),
    new FloatingFloor(7*TILEWIDTH, 3*TILEHEIGHT),
    new FloatingFloor(7*TILEWIDTH, 4*TILEHEIGHT),

    new FloatingFloor(1*TILEWIDTH, 4*TILEHEIGHT,0),
    new FloatingFloor(1*TILEWIDTH, 3*TILEHEIGHT,0),
    new FloatingFloor(8*TILEWIDTH, 3*TILEHEIGHT,0),
    new FloatingFloor(8*TILEWIDTH, 4*TILEHEIGHT,0),

    new OrbMonster(TILEWIDTH*4, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT, undefined, "red"),
    new OrbMonster(TILEWIDTH*6, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT, undefined, "blue"),

    new SeaUrchin(TILEWIDTH*2, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),
    new SeaUrchin(TILEWIDTH*7, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT),    
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

    
    new Octorok(TILEWIDTH*2, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),
    new Octorok(TILEWIDTH*4, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT),
    gate1,
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

    rotor0, 
    rotor1, 
    rotor2, 
    rotor3, 
    hidden_chest,

    new Octorok(TILEWIDTH*3, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT),
    new Octorok(TILEWIDTH*4, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT),
    new Octorok(TILEWIDTH*5, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),

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
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, 1*TILEWIDTH, TILEHEIGHT ),

    new FloatingFloor(2*TILEWIDTH, 1*TILEHEIGHT,3),
    new FloatingFloor(2*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(2*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(2*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(2*TILEWIDTH, 5*TILEHEIGHT,2),
    new FloatingFloor(2*TILEWIDTH, 6*TILEHEIGHT,3),
    new FloatingFloor(3*TILEWIDTH, 1*TILEHEIGHT,3),
    new FloatingFloor(3*TILEWIDTH, 2*TILEHEIGHT,1),
    new FloatingFloor(3*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(3*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(3*TILEWIDTH, 5*TILEHEIGHT,3),
    new FloatingFloor(4*TILEWIDTH, 3*TILEHEIGHT,1),
    new FloatingFloor(4*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(4*TILEWIDTH, 5*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 5*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 5*TILEHEIGHT,2),
    new FloatingFloor(6*TILEWIDTH, 6*TILEHEIGHT,3),
    new FloatingFloor(7*TILEWIDTH, 1*TILEHEIGHT,3),
    new FloatingFloor(7*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(7*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(7*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(7*TILEWIDTH, 5*TILEHEIGHT,3),
    new FloatingFloor(7*TILEWIDTH, 6*TILEHEIGHT,3),

    locked_gate1,

    new Octorok(TILEWIDTH*6, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT),
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
    
    new InvisibleWall(5*TILEWIDTH, 3*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(4*TILEWIDTH, 4*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),
    new InvisibleWall(3*TILEWIDTH, 5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT ),

    new Lights(TILEWIDTH*2, TILEHEIGHT*0, 0),
    new Lights(TILEWIDTH*7, TILEHEIGHT*0, 0),
    new Lights(TILEWIDTH*9, TILEHEIGHT*2, 3),
    new Lights(TILEWIDTH*9, TILEHEIGHT*5, 3),
    new Lights(TILEWIDTH*7, TILEHEIGHT*7, 1),
    new Lights(TILEWIDTH*2, TILEHEIGHT*7, 1),
    
    new OrbMonster(TILEWIDTH*2, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT, undefined, "red"),
    new OrbMonster(TILEWIDTH*7, TILEHEIGHT*5, TILEWIDTH, TILEHEIGHT, undefined, "green"),

    new Pipe(TILEWIDTH*2, TILEHEIGHT*2, "red"),
    new Pipe(TILEWIDTH*7, TILEHEIGHT*5, "green"),

    gate_22

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
    drawing_settings={sx: 320+3, sy: 512+5, sWidth: 160, sHeight: 128}),
    
    new InvisibleWall(0 * TILEWIDTH, TILEHEIGHT*3.5, TILEWIDTH, TILEHEIGHT * 6), // left margin
    new InvisibleWall(9 * TILEWIDTH, 3.5 * TILEHEIGHT, TILEWIDTH, TILEHEIGHT * 6), // right margin
    new InvisibleWall(0 * TILEWIDTH, 0 * TILEHEIGHT, TILEWIDTH * 7, TILEHEIGHT), // top margin left (blocks 0,0 to 3,0)
    new InvisibleWall(7 * TILEWIDTH, 0 * TILEHEIGHT, TILEWIDTH * 5, TILEHEIGHT), // top margin right (blocks 5,0 to 9,0)
    new InvisibleWall(4.5 * TILEWIDTH, 7 * TILEHEIGHT, TILEWIDTH * 10, TILEHEIGHT), // bottom margin

    new FloatingMoney(TILEWIDTH*7, TILEHEIGHT*2),
    new FloatingMoney(TILEWIDTH*6, TILEHEIGHT*2),
    new FloatingMoney(TILEWIDTH*5, TILEHEIGHT*2),
    new FloatingMoney(TILEWIDTH*4, TILEHEIGHT*2),
    new FloatingMoney(TILEWIDTH*3, TILEHEIGHT*2),

    new FloatingMoney(TILEWIDTH*7.5, TILEHEIGHT*3),
    new FloatingMoney(TILEWIDTH*6.5, TILEHEIGHT*3),
    new FloatingMoney(TILEWIDTH*5.5, TILEHEIGHT*3),
    new FloatingMoney(TILEWIDTH*4.5, TILEHEIGHT*3),
    new FloatingMoney(TILEWIDTH*3.5, TILEHEIGHT*3),
    new FloatingMoney(TILEWIDTH*2.5, TILEHEIGHT*3),
    
    new FloatingMoney(TILEWIDTH*7, TILEHEIGHT*4),
    new FloatingMoney(TILEWIDTH*6, TILEHEIGHT*4),
    new FloatingMoney(TILEWIDTH*5, TILEHEIGHT*4),
    new FloatingMoney(TILEWIDTH*4, TILEHEIGHT*4),
    new FloatingMoney(TILEWIDTH*3, TILEHEIGHT*4),
    new FloatingMoney(TILEWIDTH*2, TILEHEIGHT*4),
    new FloatingMoney(TILEWIDTH*2.5, TILEHEIGHT*5),
    new FloatingMoney(TILEWIDTH*3.5, TILEHEIGHT*5),
    new FloatingMoney(TILEWIDTH*4.5, TILEHEIGHT*5),
    new FloatingMoney(TILEWIDTH*5.5, TILEHEIGHT*5),
    new FloatingMoney(TILEWIDTH*6.5, TILEHEIGHT*5),
    new FloatingMoney(TILEWIDTH*7.5, TILEHEIGHT*5),

    new FloatingMoney(TILEWIDTH*7, TILEHEIGHT*6),
    new FloatingMoney(TILEWIDTH*6, TILEHEIGHT*6),
    new FloatingMoney(TILEWIDTH*5, TILEHEIGHT*6),
    new FloatingMoney(TILEWIDTH*4, TILEHEIGHT*6),
    new FloatingMoney(TILEWIDTH*3, TILEHEIGHT*6),

    new OrbMonster(TILEWIDTH*4, TILEHEIGHT*3, TILEWIDTH, TILEHEIGHT, undefined, "blue"),
    new OrbMonster(TILEWIDTH*2, TILEHEIGHT*6, TILEWIDTH, TILEHEIGHT, undefined, "blue"),
    

];
const dungeon_tile28 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 512+5, sWidth: 160, sHeight: 128}),

    new InvisibleWall(0*TILEWIDTH, 3.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*6 ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(9*TILEWIDTH, 6*TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(4.5*TILEWIDTH, 7*TILEHEIGHT, TILEWIDTH*10, TILEHEIGHT*1 ),

    new InvisibleWall(0.5*TILEWIDTH, 0*TILEHEIGHT, TILEWIDTH*7, TILEHEIGHT ),
    new InvisibleWall(8.5*TILEWIDTH, 0*TILEHEIGHT, TILEWIDTH*7, TILEHEIGHT ),

    new FloatingFloor(1*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(2*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(3*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(4*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 2*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 2*TILEHEIGHT,3),

    new FloatingFloor(1*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(2*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(3*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(4*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 3*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 3*TILEHEIGHT,3),

    new FloatingFloor(4*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 4*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 4*TILEHEIGHT,3),

    new FloatingFloor(4*TILEWIDTH, 5*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 5*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 5*TILEHEIGHT,3),

    new FloatingFloor(4*TILEWIDTH, 6*TILEHEIGHT,3),
    new FloatingFloor(5*TILEWIDTH, 6*TILEHEIGHT,3),
    new FloatingFloor(6*TILEWIDTH, 6*TILEHEIGHT,3),

    new Lights(TILEWIDTH*3, TILEHEIGHT*0, 0),
    new Lights(TILEWIDTH*6, TILEHEIGHT*0, 0),

    shield_chest,

    new OrbMonster(TILEWIDTH*6, TILEHEIGHT*2, TILEWIDTH, TILEHEIGHT, undefined, "green"),
    

];
const dungeon_tile29 = [new BackgroundElement(0, 0, PLAYSCREENWIDTH, PLAYSCREENHEIGHT, "ground", true, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 512+5, sWidth: 160, sHeight: 128}),
    
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(0*TILEWIDTH, TILEHEIGHT*6, TILEWIDTH, TILEHEIGHT*4 ),
    new InvisibleWall(4.5*TILEWIDTH, TILEHEIGHT*7, TILEWIDTH*10, TILEHEIGHT*1 ),
    new InvisibleWall(9*TILEWIDTH, TILEHEIGHT*4, TILEWIDTH*1, TILEHEIGHT*8 ),
    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*0, TILEWIDTH*4, TILEHEIGHT*1 ),
    new InvisibleWall(7*TILEWIDTH, TILEHEIGHT*0, TILEWIDTH*4, TILEHEIGHT*1 ),

    new InvisibleWall(1*TILEWIDTH, TILEHEIGHT*1, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*1, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(7*TILEWIDTH, TILEHEIGHT*1, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(8*TILEWIDTH, TILEHEIGHT*1, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(8*TILEWIDTH, TILEHEIGHT*6, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(7*TILEWIDTH, TILEHEIGHT*6, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(2*TILEWIDTH, TILEHEIGHT*6, TILEWIDTH*1, TILEHEIGHT*1 ),
    new InvisibleWall(1*TILEWIDTH, TILEHEIGHT*6, TILEWIDTH*1, TILEHEIGHT*1 ),

    new FloatingFloor(4*TILEWIDTH, 4*TILEHEIGHT,0),
    new FloatingFloor(4*TILEWIDTH, 3*TILEHEIGHT,0),
    new FloatingFloor(5*TILEWIDTH, 3*TILEHEIGHT,0),
    new FloatingFloor(5*TILEWIDTH, 4*TILEHEIGHT,0),

    createAnimatedFloorRed(6*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(7*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(8*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(6*TILEWIDTH, TILEHEIGHT*1),
    createAnimatedFloorRed(1*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(2*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(3*TILEWIDTH, TILEHEIGHT*2),
    createAnimatedFloorRed(3*TILEWIDTH, TILEHEIGHT*1),
    createAnimatedFloorGreen(3*TILEWIDTH, TILEHEIGHT*5),
    createAnimatedFloorGreen(2*TILEWIDTH, TILEHEIGHT*5),
    createAnimatedFloorGreen(1*TILEWIDTH, TILEHEIGHT*5),
    createAnimatedFloorGreen(3*TILEWIDTH, TILEHEIGHT*6),
    createAnimatedFloorGreen(6*TILEWIDTH, TILEHEIGHT*6),
    createAnimatedFloorGreen(6*TILEWIDTH, TILEHEIGHT*5),
    createAnimatedFloorGreen(7*TILEWIDTH, TILEHEIGHT*5),
    createAnimatedFloorGreen(8*TILEWIDTH, TILEHEIGHT*5),

    new Lights(TILEWIDTH*2, TILEHEIGHT*0, 0),
    new Lights(TILEWIDTH*7, TILEHEIGHT*0, 0),

    gate2,
    new Octorok(TILEWIDTH*3, TILEHEIGHT*4, TILEWIDTH, TILEHEIGHT),

];
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

level20.onAllEnemiesDefeated = function(scene) {
    scene.levelContent.forEach(obj => {
        if (obj instanceof Portcullis) {
            obj.open();
        }
    });
};
level29.onAllEnemiesDefeated = function(scene) {
    scene.levelContent.forEach(obj => {
        if (obj instanceof Portcullis) {
            obj.open();
        }
    });
}

level24.onPuzzleSolved = function(scene) {
    const allPipes = scene.levelContent.filter(obj => obj instanceof Pipe);
    const allOccupied = allPipes.every(pipe => pipe.isOccupied());

    if (allOccupied) {
        console.log("¡Puzzle resuelto!");

    }
};

level9.onAllEnemiesDefeated = function(scene) {
    const chest = scene.levelContent.find(obj => obj instanceof Chest);
    if (chest) {
        chest.x = 8 * TILEWIDTH;
        chest.y = 2 * TILEHEIGHT;
        chest.boundingBox.x = chest.x + TILEWIDTH / 2;
        chest.boundingBox.y = chest.y + TILEHEIGHT / 2;
        chest.defaultX = 8 * TILEWIDTH;
        chest.defaultY = 2 * TILEHEIGHT;

        keyB_chest.x = 8 * TILEWIDTH;
        keyB_chest.y = 2 * TILEHEIGHT;
        keyB_chest.defaultX = 8 * TILEWIDTH;
        keyB_chest.defaultY = 2 * TILEHEIGHT;
    }
}

level6.onAllEnemiesDefeated = function(scene) {
    scene.levelContent.forEach(obj => {
        if (obj instanceof Portcullis) {
            obj.open();
        }
    });
}
level12.onAllEnemiesDefeated = function(scene) {
    scene.levelContent.forEach(obj => {
        if (obj instanceof Portcullis) {
            obj.open();
        }
    });
}

level16.onAllEnemiesDefeated = function(scene) {
    scene.levelContent.forEach(obj => {
        if (obj instanceof Portcullis) {
            obj.open();
        }
    });
}

level1.onAllEnemiesDefeated = function(scene) {
    scene.levelContent.forEach(obj => {
        if (obj instanceof Portcullis) {
            obj.open();
        }
    });
}

level6.onEnter = function(scene) {
    console.log("Entering level 5, setting up the environment.", this.firstTimeEntering);
    // Additional setup for level 5 can be done here

    if (this.firstTimeEntering === undefined) {
        scene.player.scriptedMovement({x: 0, y: -1}, TILEWIDTH, 500, () => {
            scene.levelContent.forEach(obj => {
                if (obj instanceof Portcullis) {
                        obj.close();
                }
            });
        });

        
        const boss = new SeaUrchinBoss(TILEWIDTH*4, TILEHEIGHT*1, TILEWIDTH*2, TILEHEIGHT*2);   
        boss.scene = scene;

        scene.levelContent.push(boss);
        
        this.firstTimeEntering = false;

        this.firstTimeEntering = false;
    }
}

level12.onEnter = function(scene) {
    console.log("Entering level 11, setting up the environment.");
    // Additional setup for level 11 can be done here

    if (this.firstTimeEntering === undefined) {
        scene.player.scriptedMovement({x: 1, y: 0}, TILEWIDTH, 500, () => {
            scene.levelContent.forEach(obj => {
                if (obj instanceof Portcullis) {
                        obj.close();
                }
            });
        });

        // Add two enemies to the scene content
        const enemy1 = new Octorok(TILEWIDTH * 2, TILEHEIGHT * 2, TILEWIDTH, TILEHEIGHT);
        const enemy2 = new OrbMonster(TILEWIDTH * 7, TILEHEIGHT * 5, TILEWIDTH, TILEHEIGHT);
        const enemy3 = new OrbMonster(TILEWIDTH * 3, TILEHEIGHT * 6, TILEWIDTH, TILEHEIGHT, undefined, "green");
        const enemy4 = new OrbMonster(TILEWIDTH * 5, TILEHEIGHT * 3, TILEWIDTH, TILEHEIGHT, undefined, "blue");
        
        enemy1.scene = scene;
        enemy2.scene = scene;
        enemy3.scene = scene;
        enemy4.scene = scene;
        scene.levelContent.push(enemy1, enemy2, enemy3, enemy4);
        
        this.firstTimeEntering = false;
    }
}

level16.onEnter = function(scene) {
    console.log("Entering level 11, setting up the environment.");
    // Additional setup for level 11 can be done here

    if (this.firstTimeEntering === undefined) {
        scene.player.scriptedMovement({x: 0, y: -1.1}, TILEWIDTH, 500, () => {
            scene.levelContent.forEach(obj => {
                if (obj instanceof Portcullis) {
                        obj.close();
                }
            });
        });

        const midboss_stonehinox = new StoneHinox(TILEWIDTH * 4, TILEHEIGHT * 1, TILEWIDTH*2, TILEHEIGHT*2); //Como es 32x32 -> TILEWIDTH*2, TILEHEIGHT*2
        midboss_stonehinox.scene = scene;
        scene.levelContent.push(midboss_stonehinox);

        
        this.firstTimeEntering = false;
    }
}

level2.onEnter = function(scene) {
    console.log("End of the game.");
    scene.player.scriptedMovement({x: 1.5, y: 0}, TILEWIDTH, 700*1.5, () => {
        scene.player.scriptedMovement({x: 0, y: 1.1}, TILEWIDTH, 700*1.1, () => {
            scene.player.scriptedMovement({x: 2, y: 0}, TILEWIDTH, 700*2, () => {
                gamestatemanager.pushState(new EndGameMenuState(gamestatemanager, 5000));
            });
        });
    });
}


level1.onEnter = function(scene) {
    console.log("Entering level 11, setting up the environment.");
    // Additional setup for level 11 can be done here

    if (this.firstTimeEntering === undefined) {
        scene.player.scriptedMovement({x: 0, y: -1}, TILEWIDTH, 500, () => {
            scene.levelContent.forEach(obj => {
                if (obj instanceof Portcullis) {
                        obj.close();
                }
            });
        });

        // Add two enemies to the scene content
        //TODO: Quitar enemy poner final boss
        const enemy1 = new Enemy(TILEWIDTH * 2, TILEHEIGHT * 2, TILEWIDTH, TILEHEIGHT);
        const enemy2 = new Enemy(TILEWIDTH * 7, TILEHEIGHT * 5, TILEWIDTH, TILEHEIGHT);
        enemy1.scene = scene;
        enemy2.scene = scene;
        scene.levelContent.push(enemy1, enemy2);
        
        this.firstTimeEntering = false;
    }
}

level28.onLeave = function(scene) {
        if (scene.player.center.y > TILEHEIGHT * 6) { // Check if player is near the top edge
            scene.player.scriptedMovement({x: 0, y: -1.1}, TILEWIDTH, 1000, () => {
            });
        }
}

world.maps["dungeon1"].setLevels([
    level1, level2, level3, level4, level5, level6,
    level7, level8, level9, level10, level11, level12,
    level13, level14, level15, level16, level17, level18,
    level19, level20, level21, level22, level23, level24,
    level25, level26, level27, level28, level29, level30
]); 