class BoundingBox {
    constructor(x, y, width, height) {
        this.x = x; // X position of the center of the bounding box
        this.y = y; // Y position of the center of the bounding box
        this.width = width; // Width of the bounding box
        this.height = height; // Height of the bounding box
    }
    /**
     * isColliding - Check if this bounding box is colliding with another bounding box.
     * @param {BoundingBox} other - The other bounding box to check for collision.
     * @returns boolean - True if the bounding boxes are colliding, false otherwise.
     */
    isColliding(other) {
        // Check if this bounding box is colliding with another bounding box
        return (
            Math.abs(this.x - other.x) < (this.width + other.width) / 2 &&
            Math.abs(this.y - other.y) < (this.height + other.height) / 2
        );
    }

    draw(context) {
        // Use the bounding box object for drawing the bounding box
        let boundingBoxPixels = transform(this.x, this.y, context);
        let boundingBoxSizePixels = transform(this.width, this.height, context);

        // Draw the bounding box of the player
        context.strokeStyle = 'red'; // Set the color of the bounding box
        context.lineWidth = 1; // Set the width of the bounding box lines
        context.strokeRect(
            boundingBoxPixels.x - boundingBoxSizePixels.x / 2,
            boundingBoxPixels.y - boundingBoxSizePixels.y / 2,
            boundingBoxSizePixels.x,
            boundingBoxSizePixels.y
        );
    }

    translate(x, y) {
        // Translate the bounding box by a given x and y offset
        this.x += x;
        this.y += y;
    }

    setPosition(x, y) {
        // Set the position of the bounding box to a new x and y
        this.x = x;
        this.y = y;
    }
}

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
        
        // Bounding box for collision detection
        this.boundingBox = new BoundingBox(0, 0, 0, 0); // Empty bounding box

        if (color)
        this.color = color; // Optional color for the element
        if (texture)
        this.texture = texture; // Optional texture (image) for the element

        this.globalReference = null; // Reference to the global object for callbacks
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
        } else if (this.color) {
            // Draw the element based on its type
            context.fillStyle = this.color;
            // Draw the rectangle representing the element
            context.fillRect(pos.x, pos.y, size.x, size.y);
        }

        if (DEBUG){
            // Draw the bounding box for debugging
            this.boundingBox.draw(context);
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

    tryPush(direction, scene) {
        const targetX = this.x + direction.x * TILEWIDTH;
        const targetY = this.y + direction.y * TILEHEIGHT;
    
        // Create a temporary bounding box to simulate the move
        const testBox = new BoundingBox(
            targetX + this.width / 2,
            targetY + this.height / 2,
            this.width,
            this.height
        );
    
        // Check for collisions with other solid objects in the scene
        let blocked = scene.levelContent.some(obj => {
            if (obj === this || !obj.boundingBox) return false;
            if (testBox.isColliding(obj.boundingBox)){
                console.log("Colliding with: ", obj.type, "at", obj.x, obj.y);
            }
            return testBox.isColliding(obj.boundingBox);
        });
    
        if (!blocked) {
            this.x = targetX;
            this.y = targetY;
            this.defaultX = targetX;
            this.defaultY = targetY;
            this.boundingBox.setPosition(this.x + this.width / 2, this.y + this.height / 2);
            if (this.callback) {
                this.callback(); // Call the callback function if provided
            }
        } else {
            console.log("Can't push there.");
        }
    }

    update(deltaTime) {
        // Update the element's position or state based on deltaTime
        // This method can be overridden in subclasses for specific behavior
    }
}

class Door extends BackgroundElement {
    constructor(x, y,  texture = null, map = null, level = null, active = true, destination_door = null) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "door", false, texture, null, null);
        this.map = map; 
        this.level = level; 
        this.active = active; // Whether the door is active or not
        this.door = destination_door; // Optional door object for additional functionality
        this.wasColliding = false; // Track previous collision state
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, 0.8*TILEWIDTH, 0.8*TILEHEIGHT); // Bounding box for collision detection
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
        console.log("Door activated!");
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
            scene.levelTransitionDoorAnimation(this.door.level, this.door.map.id, {x:this.door.x, y:this.door.y});
            return; 
        } else {
            console.log("Door is inactive, cannot pass through.");
        }
    }

    transition(scene){
        if (this.active) {
            console.log("Transitioning to level:", this.destination);
            // scene.levelTransitionDoorAnimation(this.getDestination(), {x:this.door.x, y:this.door.y});
        } else {
            console.log("Door is inactive, cannot transition.");
        }
    }
}

class Chest extends BackgroundElement {
    constructor(x, y) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "chest", false, textures.chest, null, null);
        this.isOpen = false; // Whether the chest is open or not
        this.content = null; // Content of the chest (e.g., items, coins)
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, 0.9*TILEWIDTH, 0.9*TILEHEIGHT); // Bounding box for collision detection
        console.log("is chest oppened?", this.isOpen);
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
            player.inventory.addItem(this.content); // Add the content to the player's inventory
            if(this.callback) this.callback(); // Call the callback function if provided
        } else {
            // this.close(); // Close the chest if it is already open
            console.log("Chest has already been oppened!");
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

        if (DEBUG) {
            // Draw the bounding box for debugging
            this.boundingBox.draw(context);
        }
    }
}

class Tombstone extends BackgroundElement {
    constructor(x, y) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "tombstone", false, textures.tombstone, null, null);
        this.render_layer = 0; // Render layer for tombstones
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT); // Bounding box for collision detection
        this.isPushable = true; // Tombstones are pushable
        this.callback = null; // Optional callback function for when the tombstone is pushed
    }

}

class InvisibleWall extends BackgroundElement {
    constructor(x, y, width, height) {
        super(x, y, width, height, "wall", false, null, null, null);
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, width, height); // Bounding box for collision detection
    }

    draw(context) {
        if(DEBUG){
            // Draw the invisible wall (no visual representation)
            // Optional: Draw a bounding box for debugging
            this.boundingBox.draw(context);
        }
    }
}

function createVase(x, y){
    let element =  new BackgroundElement(x, y, TILEWIDTH, TILEHEIGHT, "vase", false, texture = textures.vase, color = null, drawing_settings={sx:0, sy:0, sWidth:16, sHeight:16});
    element.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT); // Bounding box for collision detection
    return element; // Return the vase element
}
function createFirePlace(x, y) {
    let element =  new BackgroundElement(x, y, TILEWIDTH, TILEHEIGHT, "fireplace", false, texture = textures.fireplace, color = null, drawing_settings={sx:0, sy:0, sWidth:16, sHeight:16});
    element.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT); // Bounding box for collision detection
    
    element.update = function(deltaTime) {
        if (this.animationTimer === undefined) {
            this.animationTimer = 0;
            this.animationFrame = 0;
        }
    
        this.animationTimer += deltaTime;
        

        const frameDuration = {0:1000, 1:3000, 2:1000, 3:1000}; // ms per frame (adjust as needed)
        
        if (this.animationTimer >= frameDuration[this.animationFrame]) {
            this.animationTimer -= frameDuration[this.animationFrame]; // subtract instead of reset to preserve leftover time
            this.animationFrame = (this.animationFrame + 1) % 4;
            switch (this.animationFrame) {
                case 0:
                    this.drawing_settings = { sx: 0, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
                case 1:
                    this.drawing_settings = { sx: 16, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
                case 2:
                    this.drawing_settings = { sx: 32, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
                case 3:
                    this.drawing_settings = { sx: 48, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
            }
        }
    };
    
    return element; // Return the fireplace element
}
function createAnimatedFloor(x, y, texture) {
    let element =  new BackgroundElement(x, y, TILEWIDTH, TILEHEIGHT, "animated_floor", true, texture = texture, color = null, drawing_settings={sx:0, sy:0, sWidth:16, sHeight:16});

    element.update = function(deltaTime) {
        if (this.animationTimer === undefined) {
            this.animationTimer = 0;
            this.animationFrame = 0;
        }
    
        this.animationTimer += deltaTime;
        

        const frameDuration = 250; // ms per frame (adjust as needed)
        
        if (this.animationTimer >= frameDuration) {
            this.animationTimer -= frameDuration; // subtract instead of reset to preserve leftover time
            this.animationFrame = (this.animationFrame + 1) % 4;
            switch (this.animationFrame) {
                case 0:
                    this.drawing_settings = { sx: 0, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
                case 1:
                    this.drawing_settings = { sx: 16, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
                case 2:
                    this.drawing_settings = { sx: 32, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
                case 3:
                    this.drawing_settings = { sx: 48, sy: 0, sWidth: 16, sHeight: 16 };
                    break;
            }
        }
    };
    return element; // Return the animated floor element
}
function createAnimatedFloorRed(x, y) {
    return createAnimatedFloor(x, y, textures.red_floor); // Create an animated floor with red texture
}
function createAnimatedFloorBlue(x, y) {
    return createAnimatedFloor(x, y, textures.blue_floor); // Create an animated floor with blue texture
}
function createAnimatedFloorGreen(x, y) {
    return createAnimatedFloor(x, y, textures.green_floor); // Create an animated floor with green texture
}

// ITEMS
// Item.js
class Item {
    constructor(name, icon, isStackable = true) {
        this.name = name;
        this.icon = icon;
        this.isStackable = isStackable;
        this.maxStackSize = 10;
        this.type = "generic"; // could be 'equipment', 'consumable', etc.
        this.effects = []; // array of effects that this item can apply
    }
}

class Equipment extends Item {
    constructor(name, icon, slot, effects = {}) {
        super(name, icon, false); // equipment is usually not stackable
        this.type = "equipment";
        this.slot = slot; // e.g., 'head', 'body', 'legs', etc.
        this.effects = effects; // e.g., { armor: 5 }
    }
}

class Effect {
    constructor(stat, value, duration) {
        this.stat = stat; // e.g., 'health', 'attack', etc.
        this.value = value; // e.g., +5 or -3
        this.duration = duration; // in seconds, 0 means it does not expire
        this.startTime = null; // to track when the effect started
    }

    isExpired(currentTime) {
        if (this.duration === 0) return false; // Does not expire
        return (currentTime - this.startTime) >= this.duration * 1000;
    }
}
const BraceletStrength = new Equipment("Power Bracelet", "imgs/items/bracelet_strength.png", null, [new Effect("strength", 15, 0)]);


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
                let copy = new Door(
                    element.x, element.y, element.texture, element.map,
                    element.level, element.active,
                    element.door,
                );
                copy.globalReference = element;
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof Chest) {
                // Create a new Chest instance
                let copy = new Chest(
                    element.x, element.y
                );
                copy.globalReference = element;
                copy.isOpen = element.isOpen; // Copy the isOpen state
                copy.content = element.content; // Copy the content of the chest
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof Tombstone) {
                console.log("Tombstone created at:", element.x, element.y);
                // Create a new Tombstone instance
                let copy = new Tombstone(
                    element.x, element.y,
                    element.isWalkable
                );
                copy.globalReference = element;
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof InvisibleWall) {
                // Create a new InvisibleWall instance
                let copy = new InvisibleWall(
                    element.x, element.y, element.width, element.height
                );
                copy.globalReference = element;
                copy.boundingBox = element.boundingBox; // Copy the bounding box
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof BackgroundElement) {
                // Create a new BackgroundElement instance
                let copy = new BackgroundElement(
                    element.x, element.y, element.width, element.height,
                    element.type, element.isWalkable, element.texture,
                    element.color, element.drawing_settings
                );
                copy.globalReference = element;
                copy.boundingBox = element.boundingBox;
                copy.callback = element.callback; 
                copy.update = element.update; // Copy the update method
                return copy;
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
class MapContainer {
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

    setLevels(levels) {
        this.levels = levels; // Set the levels of the map
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
let size_x = TILEWIDTH;
let size_y = TILEHEIGHT;

function createBasicTail(x, y) {
    const basicTail = new BackgroundElement(x, y, size_x, size_y, "ground", false, texture=textures.brick, color="green");
    return basicTail;
}
function createBasicTailRock(x, y) {
    const basicTail = new BackgroundElement(x, y, size_x, size_y, "ground", false, texture=textures.dungeon0, color="green");
    return basicTail;
}

const world = new World([
    new MapContainer('overworld', 16, 16, []),
    new MapContainer('dungeon1', 6, 5, []),
]); // Create a world with the dungeon1 map
window.world = world; // Make the world accessible globally for debugging
