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
        this.active = true; // Whether the element is active or not
        
        if (color)
        this.color = color; // Optional color for the element
        if (texture)
        this.texture = texture; // Optional texture (image) for the element
    }

    draw(context) {
        if (this.color == null && this.texture == null) {
            // console.warn("No color or texture provided for drawing the element.");
            return; // No color or texture to draw
        }

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

    isActive() {
        return this.active; // Check if the element is active
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

    onCollision({player, scene}) {
        if (this.active) {
            console.log("Door collision detected!");
            scene.levelTransitionDoorAnimation(this.getDestination(), {x:this.door.x, y:this.door.y});
            return; 
        } else {
            console.log("Door is inactive, cannot pass through.");
        }
    }
}

class Chest extends BackgroundElement {
    constructor(x, y, width, height, isWalkable, texture = textures.chest, color = null, drawing_settings = null) {
        super(x, y, width, height, "chest", isWalkable, texture, color, drawing_settings);
        this.isOpen = false; // Whether the chest is open or not
        this.content = null; // Content of the chest (e.g., items, coins)
    }

    open() {
        this.isOpen = true; // Open the chest
    }

    close() {
        this.isOpen = false; // Close the chest
    }

    isOpened() {
        return this.isOpen; // Check if the chest is open
    }

    interact(player) {
        if (!this.isOpen) {
            this.open(); // Open the chest if it is not already open
            console.log("Chest opened!");
            // Add logic to give content to the player
            // e.g., player.addItem(this.content);
        } else {
            this.close(); // Close the chest if it is already open
            console.log("Chest closed!");
        }
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);

        if (this.isOpen) {
            // Draw the open chest texture (16x0 to 32x16)
            context.drawImage(this.texture.img, 16, 0, 16, 16, pos.x, pos.y, size.x, size.y);
        } else {
            // Draw the closed chest texture (0x0 to 16x16)
            context.drawImage(this.texture.img, 0, 0, 16, 16, pos.x, pos.y, size.x, size.y);
        }
    }
}

class Tombstone extends BackgroundElement {
    constructor(x, y) {
        super(x, y, 1/10, 1/8, "tombstone", false, textures.tombstone, null, null);
        this.render_layer = 0; // Render layer for tombstones
    }
    push() {
        // Logic to push the tombstone (e.g., move it or change its state)
        console.log("Tombstone pushed!");
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
            } else if (element instanceof Chest) {
                // Create a new Chest instance
                console.log("Chest created at:", element.x, element.y);
                return new Chest(
                    element.x, element.y, element.width, element.height,
                    element.isWalkable, element.texture, element.color,
                    element.drawing_settings
                );
            } else if (element instanceof Tombstone) {
                console.log("Tombstone created at:", element.x, element.y);
                // Create a new Tombstone instance
                return new Tombstone(
                    element.x, element.y,
                    element.isWalkable
                );
            } else if (element instanceof BackgroundElement) {
                // Create a new BackgroundElement instance
                console.log("BackgroundElement created at:", element.x, element.y);
                return new BackgroundElement(
                    element.x, element.y, element.width, element.height,
                    element.type, element.isWalkable, element.texture,
                    element.color, element.drawing_settings
                );
            } else if (element instanceof Enemy){
                return new Enemy(element.x, element.y, element.width, element.height, element.texture); 
            }else {
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

    addMap(map) {
        this.maps[map.id] = map; // Add a new map to the world
    }
}



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

const world = new World([]); // Create a world with the dungeon1 map
window.world = world; // Make the world accessible globally for debugging
