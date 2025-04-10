class BackgroundElement {
    constructor(x, y, width, height, type, isWalkable, texture = null, color = null, drawing_settings=null) {
        this.x = x; // X position
        this.y = y; // Y position
        this.defaultX = x; // Default X position
        this.defaultY = y; // Default Y position
        this.width = width; // Width of the element
        this.height = height; // Height of the element
        this.type = type; // Type of the element (e.g., "ground", "wall", "rock")
        this.isWalkable = isWalkable; // Whether the user can walk on this element
        this.render_layer = 0; // Render layer = z index
        this.drawing_settings = drawing_settings; // Optional drawing settings for the element
        
        if (color)
        this.color = color; // Optional color for the element
        if (texture)
        this.texture = texture; // Optional texture (image) for the element
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);
        
        if (this.texture) {
            // Draw the texture if it exists
            if (this.drawing_settings) {
                const { sx, sy, sWidth, sHeight } = this.drawing_settings;
                context.drawImage(
                    this.texture.img,
                    sx || 0, sy || 0, sWidth || this.texture.img.width, sHeight || this.texture.img.height,
                    pos.x, pos.y, size.x, size.y
                );
            } else {
                context.drawImage(this.texture.img, pos.x, pos.y, size.x, size.y);
            }
        } else {
            // Draw the element based on its type
            if (this.color) {
                context.fillStyle = this.color;
            } else if (this.type === "ground") {
                context.fillStyle = "green"; // Example color for ground
            } else if (this.type === "wall") {
                context.fillStyle = "gray"; // Example color for wall
            } else if (this.type === "rock") {
                context.fillStyle = "brown"; // Example color for rock
            } else {
                context.fillStyle = "black"; // Default color
            }
            

            // Draw the rectangle representing the element
            context.fillRect(pos.x, pos.y, size.x, size.y);
        }
    }

    isColliding(playerX, playerY, playerWidth, playerHeight) {
        // Check if the player's position collides with this element
        return (
            playerX < this.x + this.width &&
            playerX + playerWidth > this.x &&
            playerY < this.y + this.height &&
            playerY + playerHeight > this.y
        );
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    translatePosition(x, y) {
        this.x += x;
        this.y += y;
    }

    resetPosition() {
        this.x = this.defaultX;
        this.y = this.defaultY;
    }
}

class Door extends BackgroundElement {
    constructor(x, y, width, height, isWalkable, texture = null, color = null, drawing_settings = null, destination = null, active = true, door = null) {
        super(x, y, width, height, "door", isWalkable, texture, color, drawing_settings);
        this.destination = destination; // Destination level or map the door leads to
        this.active = active; // Whether the door is active or not
        this.door = door; // Optional door object for additional functionality
        this.wasColliding = false; // Track previous collision state
        console.log("Door created at:", x, y, "with destination:", destination, "and active:", active);
    }

    setDestination(destination) {
        this.destination = destination; // Set the destination for the door
    }

    getDestination() {
        return this.destination; // Get the destination of the door
    }

    setDoor(door) {
        this.door = door; // Set the door object
    }

    activate() {
        this.active = true; // Activate the door
    }

    deactivate() {
        this.active = false; // Deactivate the door
    }

    isActive() {
        return this.active; // Check if the door is active
    }

    safeCheck(playerX, playerY, playerWidth, playerHeight) {
        if (this.isColliding(playerX, playerY, playerWidth, playerHeight)){
            this.deactivate(); // Deactivate the door if colliding on startup
        }
        // if (this.wasColliding && !this.isColliding(playerX, playerY, playerWidth, playerHeight)) {
        //     this.activate();
        //     console.log("Door activated!");
        // } else if (this.isColliding(playerX, playerY, playerWidth, playerHeight)) {
        //     this.deactivate();
        //     console.log("Door deactivated!");
        // }
        // this.wasColliding = this.isColliding(playerX, playerY, playerWidth, playerHeight);
        // console.log("wasColliding:", this.wasColliding, "isActive: ",this.active);
    }

    setWasColliding(value) {
        this.wasColliding = value; // Set the previous collision state
    }
}

/**
 * Class representing a level in the game. Contains static elements, enemies, items...
 * @class Level
 * @param {number} levelID - The ID of the level.
 * @param {Array} background_elements - The elements in the level.
 * 
 */
class Level{
    constructor(levelID, background_elements) {
        this.levelID = levelID; // ID of the level
        this.background_elements = background_elements; // Elements in the level
    }

    getElements() {
        return this.background_elements.map(element => {
            if (element instanceof Door) {
                // Create a new Door instance
                return new Door(
                    element.x, element.y, element.width, element.height,
                    element.isWalkable, element.texture, element.color,
                    element.drawing_settings, element.destination,
                    element.active, 
                    element.door,
                );
            } else if (element instanceof BackgroundElement) {
                // Create a new BackgroundElement instance
                return new BackgroundElement(
                    element.x, element.y, element.width, element.height,
                    element.type, element.isWalkable, element.texture,
                    element.color, element.drawing_settings
                );
            } else {
                console.warn("Unknown element type:", element);
                return null; // Handle unexpected types gracefully
            }
        });
    }
}

/**
 * Class representing a map in the game. Contains levels and their elements.
 * @class Map
 * @param {number} x - The number of columns in the map.
 * @param {number} y - The number of rows in the map.
 * @param {Array} levels - The levels in the map.
 * 
 * */
class Map {
    constructor(id, x, y, levels) {
        this.id = id; // ID of the map
        this.x = x;  // cols of matrix
        this.y = y; // rows of matrix
        this.levels = levels // levels of the map
    }

    getLevel(levelID) {
        // get the Level.LevelID == levelID
        return this.levels.find(level => level.levelID === levelID);
    }

    /**
     * Get a deep copy of elements of a specific level by its ID.
     */
    getLevelElements(levelID) {
        return this.getLevel(levelID).getElements(); // Returns the elements of the level with the given ID
    }

    getSize() {
        return { cols: this.x, rows: this.y }; // Returns the size of the map
    }
}

/**
 * Class representing a world in the game. Contains the maps
 */
class World {
    constructor(maps) {
        this.maps = maps.reduce((acc, map) => {
            acc[map.id] = map;
            return acc;
        }, {}); // Create a dictionary {map1.id: map1, map2.id: map2, ...}
    }
}

//  Doors
const door1 = new Door(1/10, 1/9, 1/10, 1/9, true, texture=null, color="yellow",drawing_settings=null,destination=2, active=true, door=null);
const door2 = new Door(5/10, 5/9, 1/10, 1/9, true, texture=null, color="purple",drawing_settings=null,destination=0, active=true, door=null);

door1.setDoor(door2); 
door2.setDoor(door1);

// The map contains 6x5 tiles, each tile is 160x128 pixels but they have a 1px gap between them
// ROW1
const tile1 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 0+1, sy: 1, sWidth: 160, sHeight: 128}), 
    door1,
];
const tile2 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 160+2, sy: 1, sWidth: 160, sHeight: 128})];
const tile3 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 320+3, sy: 1, sWidth: 160, sHeight: 128}),
    door2,
];
const tile4 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 480+4, sy: 1, sWidth: 160, sHeight: 128})];
const tile5 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 640+5, sy: 1, sWidth: 160, sHeight: 128})];
const tile6 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black", 
    drawing_settings={sx: 800+6, sy: 1, sWidth: 160, sHeight: 128})];
// ROW2
const tile7 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile8 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile9 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile10 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 128+2, sWidth: 160, sHeight: 128})];
const tile11 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 128+2, sWidth: 160, sHeight: 128})];   
const tile12 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 128+2, sWidth: 160, sHeight: 128})];
// ROW3
const tile13 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",    
    drawing_settings={sx: 0+1, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile14 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile15 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile16 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile17 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 256+3, sWidth: 160, sHeight: 128})];
const tile18 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 256+3, sWidth: 160, sHeight: 128})];
// ROW4
const tile19 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile20 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile21 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile22 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile23 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 384+4, sWidth: 160, sHeight: 128})];
const tile24 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 800+6, sy: 384+4, sWidth: 160, sHeight: 128})];
// ROW5
const tile25 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 0+1, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile26 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 160+2, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile27 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 320+3, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile28 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 480+4, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile29 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
    drawing_settings={sx: 640+5, sy: 512+5, sWidth: 160, sHeight: 128})];
const tile30 = [new BackgroundElement(0, 0, 1, 1, "ground", false, texture=textures.dungeon1, color="black",
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

// level_001 elements
let size_x = 1/10;
let size_y = 1/9;

function createBasicTail(x, y) {
    const basicTail = new BackgroundElement(x, y, size_x, size_y, "ground", false, texture=textures.brick, color="green");
    return basicTail;
}
function createBasicTailRock(x, y) {
    const basicTail = new BackgroundElement(x, y, size_x, size_y, "ground", false, texture=textures.dungeon0, color="green");
    return basicTail;
}

const levels = [
    level1, level2, level3, level4, level5, level6,
    level7, level8, level9, level10, level11, level12,
    level13, level14, level15, level16, level17, level18,
    level19, level20, level21, level22, level23, level24,
    level25, level26, level27, level28, level29, level30
];

const dungeon1 = new Map('dungeon1', 6, 5, levels); 

const world = new World([dungeon1]); // Create a world with the dungeon1 map
