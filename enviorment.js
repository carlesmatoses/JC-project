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
    isColliding(other, epsilon = 0) {
        // If either bounding box has zero width or height, no collision
        if (this.width === 0 || this.height === 0 || other.width === 0 || other.height === 0) {
            return false;
        }
        // Check if this bounding box is colliding with another bounding box,
        // optionally expanding this box by epsilon for proximity checks
        const width = this.width + epsilon;
        const height = this.height + epsilon;
        return (
            Math.abs(this.x - other.x) < (width + other.width) / 2 &&
            Math.abs(this.y - other.y) < (height + other.height) / 2
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

class Portcullis extends BackgroundElement {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} direction - 0 (horizontal), 1 (horizontal alt), 2 (vertical), 3 (vertical alt)
     */
    constructor(x, y, direction = 0) {
        // For vertical (direction 2/3), height is 2 tiles, width is 1 tile
        // For horizontal (direction 0/1), width is 2 tiles, height is 1 tile
        let width = (direction === 2 || direction === 3) ? TILEWIDTH : TILEWIDTH * 2;
        let height = (direction === 2 || direction === 3) ? TILEHEIGHT * 2 : TILEHEIGHT;
        super(x, y, width, height, "portcullis", false, textures.portcullis, null, null);
        this.direction = direction;
        // Set bounding box at center
        this.boundingBox = new BoundingBox(
            this.x + this.width * 0.5,
            this.y + this.height * 0.5,
            width,
            height
        );
        this.isOpen = false;
        this.callback = null;

        if (this.isOpen) {
            this.boundingBox.width = 0;
            this.boundingBox.height = 0;
        }
    }

    open() {
        if (this.callback) {
            this.callback();
        }
        if (this.globalReference) {
            this.globalReference.isOpen = true;
            this.globalReference.boundingBox.width = 0;
            this.globalReference.boundingBox.height = 0;
        }
        this.isOpen = true;
        this.boundingBox.width = 0;
        this.boundingBox.height = 0;
    }

    close() {
        this.isOpen = false;
        if (this.direction === 2 || this.direction === 3) {
            this.boundingBox.width = TILEWIDTH;
            this.boundingBox.height = TILEHEIGHT * 2;
        } else {
            this.boundingBox.width = TILEWIDTH * 2;
            this.boundingBox.height = TILEHEIGHT;
        }
    }

    isOpened() {
        return this.isOpen;
    }

    draw(context) {
        const img = this.texture.img;
        let sx = 0, sy = 0, sWidth = 0, sHeight = 0;

        // Animation setup
        const ANIMATION_DURATION = 0.4; // seconds
        if (this.animationTimer === undefined) {
            this.animationTimer = 0;
            this.animationFrame = this.isOpen ? 2 : 0;
            this.animating = false;
            this.lastState = this.isOpen;
        }

        // Detect state change and start animation
        if (this.lastState !== this.isOpen) {
            this.animating = true;
            this.animationTimer = 0;
            this.lastState = this.isOpen;
        }

        // Animate if needed
        if (this.animating) {
            this.animationTimer += (context.deltaTime || 16) / 1000;
            let progress = Math.min(this.animationTimer / ANIMATION_DURATION, 1);
            if (this.isOpen) {
                if (progress < 0.5) this.animationFrame = 1;
                else this.animationFrame = 2;
            } else {
                if (progress < 0.5) this.animationFrame = 1;
                else this.animationFrame = 0;
            }
            if (progress >= 1) {
                this.animating = false;
                this.animationFrame = this.isOpen ? 2 : 0;
            }
        } else {
            this.animationFrame = this.isOpen ? 2 : 0;
        }

        // Sprite selection logic
        if (this.direction === 0 || this.direction === 1) {
            // Horizontal: 3 frames, 32x16, separated by 1px, y=0 or y=17
            sWidth = 32;
            sHeight = 16;
            sx = this.animationFrame * (32 + 1);
            sy = this.direction === 0 ? 0 : 17;
        } else if (this.direction === 2 || this.direction === 3) {
            // Vertical: 3 frames, 16x32, separated by 1px, y=34, direction 2: frames 0-2, direction 3: frames 3-5
            sWidth = 16;
            sHeight = 32;
            let frame = this.animationFrame;
            let col = (this.direction === 2) ? frame : frame + 3;
            sx = col * (16 + 1);
            sy = 34;
        }

        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);

        context.drawImage(
            img,
            sx, sy, sWidth, sHeight,
            pos.x, pos.y, size.x, size.y
        );

        if (DEBUG) {
            this.boundingBox.draw(context);
        }
    }
}

class PortcullisKeyLock extends Portcullis {
    constructor(x, y, key, direction = 0) {
        super(x, y, direction);
        this.key = key; 
        this.texture = textures.portcullis_lock; 
    }

    interact(player) {
        if (player.inventory.hasKey(this.key.id)) {
            this.open(); // Open the portcullis if the player has the key
            console.log("Portcullis opened with key:", this.key);
            player.inventory.removeKey(this.key); // Remove the key from the player's inventory
        } else {
            console.log("Portcullis is locked! You need a key to open it.");
            // Optionally, you can show a message to the player
            addDialog(["This portcullis is locked! You need a key to open it."]);
        }
    }
}

class Chest extends BackgroundElement {
    constructor(x, y) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "chest", false, textures.chest, null, null);
        this.isOpen = false; // Whether the chest is open or not
        this.content = null; // Content of the chest (e.g., items, coins)
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, 0.9*TILEWIDTH, 0.9*TILEHEIGHT); // Bounding box for collision detection
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
            if (!(this.content instanceof Key)) {
                player.inventory.assignToEmptySlot(this.content); // Assign the item to an empty slot in the inventory
            }
            if(this.callback) this.callback(); // Call the callback function if provided

            // we set a DialogState to show the content of the chest
            addDialog([`You found: ${this.content.name}`]);

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

class Statue extends BackgroundElement {
    constructor(x, y, dialog, options = null, onSelect = null) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "statue", false, textures.statue, null, null);
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
        this.dialog = dialog; 
        this.options = options; 
        this.onSelect = onSelect;
    }

    interact(player) {
        addDialog(this.dialog, this.options, this.onSelect) // Show the dialog when interacting with the statue
    }

    draw(context) {
        // call super.draw(context) to draw the statue texture
        super.draw(context); // Draw the statue texture
        if (DEBUG) {
            // Draw the bounding box for debugging
            // console.log(this.x)
        }
    }
}

class Rotor extends BackgroundElement {
    constructor(x, y, identifier = 0, neighbors = [], current_color = 0) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "rotor", false, textures.rotor, null, null);
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
        this.identifier = identifier;
        this.neighbors = neighbors; 
        this.current_color = current_color;
        this.color_seq = ["red", "green", "blue", "yellow"];
        this.onSolved = null;
        this.texture_red = textures.rotor_red;
        this.texture_green = textures.rotor_green;
        this.texture_blue = textures.rotor_blue;
        this.texture_yellow = textures.rotor_yellow;

        // set inital texture based on current_color
        switch (this.current_color) {
            case 0:
                this.texture = this.texture_red;
                break;
            case 1:
                this.texture = this.texture_green;
                break;
            case 2:
                this.texture = this.texture_blue;
                break;
            case 3:
                this.texture = this.texture_yellow;
                break;
            default:
                this.texture = this.texture_red; // Default to red if color is invalid
        }
    }
    
    onAttackCollision(player) {
        let elements = player.scene.levelContent;
        this.current_color = (this.current_color + 1) % 4;
        for (let element of elements) {
            if (element instanceof Rotor) {
                if (this.neighbors.includes(element.identifier)) {
                    element.current_color = (element.current_color + 1) % 4;
                }
            }
        }
        // Check if all Rotors have the same current_color as this Rotor
        let allSame = elements
            .filter(e => e instanceof Rotor)
            .every(e => e.current_color === this.current_color);
        if (allSame && this.onSolved) {
            console.log("All Rotors have the same color:", this.color_seq[this.current_color]);
            // You can trigger a callback or event here if needed
            this.onSolved(player); 
        }
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);

        // Animation setup
        const SPRITE_COUNT = 4;
        const SPRITE_WIDTH = 16;
        const SPRITE_HEIGHT = 16;
        const SEPARATOR = 1;
        const ANIMATION_DURATION = 200; // ms

        // Animation state
        if (this.animationTimer === undefined) {
            this.animationTimer = 0;
            this.animating = false;
            this.animationFrame = 0;
            this.lastColor = this.current_color;
        }

        // Detect color change to start animation
        if (this.lastColor !== this.current_color) {
            this.animating = true;
            this.animationTimer = 0;
            this.lastColor = this.current_color;
            this.animationFrame = 0;
        }

        // Animate if needed
        if (this.animating) {
            this.animationTimer += (context.deltaTime || 16);
            let progress = Math.min(this.animationTimer / ANIMATION_DURATION, 1);
            // Animation: iterate over all frames, then stop at frame 0
            this.animationFrame = Math.floor(progress * SPRITE_COUNT);
            if (this.animationFrame >= SPRITE_COUNT) {
                this.animationFrame = 0;
                this.animating = false;
                // Set texture to the corresponding color when animation ends
                switch (this.current_color) {
                    case 0:
                        this.texture = this.texture_red;
                        break;
                    case 1:
                        this.texture = this.texture_green;
                        break;
                    case 2:
                        this.texture = this.texture_blue;
                        break;
                    case 3:
                        this.texture = this.texture_yellow;
                        break;
                }
            }
        } else {
            this.animationFrame = 0;
        }

        // Draw the sprite
        let sx = this.animationFrame * (SPRITE_WIDTH + SEPARATOR);
        let sy = 0;

        context.drawImage(
            this.texture.img,
            sx, sy, SPRITE_WIDTH, SPRITE_HEIGHT,
            pos.x, pos.y, size.x, size.y
        );

        if (DEBUG) {
            this.boundingBox.draw(context);
        }
    }
}

class Lights extends BackgroundElement {
    constructor(x, y, direction) {
        super(x, y, TILEWIDTH, TILEHEIGHT, "lights", false, textures.lights, null, null);
        this.boundingBox = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
        this.animationTimer = 0;
        this.animationFrameIndex = 0;
        this.direction = direction;
    }
    draw(context) {
        // Animation parameters
        const SPRITE_SIZE = 16;
        const SPRITE_COLS = 4;
        const SPRITE_ROWS = 4;
        const NORMAL_DURATION = 160; // ms per frame
        const LONG_DURATION = 800;   // 5 * 160ms

        // Animation sequence: [0,1,2,3,2,1,0]
        const sequence = [0, 1, 2, 3, 2, 1, 0];
        const durations = [LONG_DURATION, NORMAL_DURATION, NORMAL_DURATION, NORMAL_DURATION, NORMAL_DURATION, NORMAL_DURATION, LONG_DURATION];

        // Initialize animation state if needed
        if (this.animationTimer === undefined) {
            this.animationTimer = 0;
            this.animationFrameIndex = 0;
        }

        // Advance animation timer
        this.animationTimer += (context.deltaTime || 16);
        if (this.animationTimer >= durations[this.animationFrameIndex]) {
            this.animationTimer -= durations[this.animationFrameIndex];
            this.animationFrameIndex = (this.animationFrameIndex + 1) % sequence.length;
        }

        // Determine which row to use based on direction (default to 0 if not set)
        const row = typeof this.direction === "number" ? this.direction % SPRITE_ROWS : 0;
        const frame = sequence[this.animationFrameIndex];
        const sx = frame * SPRITE_SIZE + 1 * frame;
        const sy = row * SPRITE_SIZE + 1 * row;

        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);

        context.drawImage(
            this.texture.img,
            sx, sy, SPRITE_SIZE, SPRITE_SIZE,
            pos.x, pos.y, size.x, size.y
        );

        if (DEBUG) {
            this.boundingBox.draw(context);
        }
    }
}

class FloatingFloor extends BackgroundElement{
    constructor(x, y, uses = 3){
        super(x, y, TILEWIDTH, TILEHEIGHT, "floating_floor", true, null, "cyan", null);
        this.boundingBoxPressure = new BoundingBox(x+0.5*TILEWIDTH, y+0.2*TILEHEIGHT, TILEWIDTH*0.2, TILEHEIGHT*0.2); 
        this.uses = uses; // Number of uses before disappearing
        this.onCooldown = false; 
        this.cooldownTime = 1000; // ms
        this.cooldownTimer = 0;
        this.texture = textures.floating_floor; 
    }

    steptOn(player) {
        if (player.stats.getIsFlying()) return;

        if (!this.onCooldown && this.uses > 0) {
            this.uses -= 1;
            this.onCooldown = true;
            this.cooldownTimer = this.cooldownTime;
            if (this.uses <= 0) {
                this.active = false; // Or remove from scene in update
                if (player && typeof player.takeDamage === "function") {
                    player.takeDamage(10);
                    console.log("Floating floor disappeared, player took damage!");
                }
            } 
            switch (this.uses) {
                case 3:
                    this.color = "green";
                    break;
                case 2:
                    this.color = "yellow";
                    break;
                case 1:
                    this.color = "red";
                    break;
                default:
                    this.color = null;
            }
        } else if  (!this.onCooldown && this.uses <= 0){
            // floor is broken, user will fall  to the void
            player.takeDamage(10);
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.onCooldown) {
            this.cooldownTimer -= deltaTime;
            if (this.cooldownTimer <= 0) {
                this.onCooldown = false;
                this.cooldownTimer = 0;
            }
        }
    }

    draw(context) {
        if (this.texture && this.uses > 0) {
            let pos = transform(this.x, this.y, context);
            let size = transform(this.width, this.height, context);
            let sx = 0;
            if (this.uses === 3) sx = 0;
            else if (this.uses === 2) sx = 16;
            else if (this.uses === 1) sx = 32;
            context.drawImage(this.texture.img, sx, 0, 16, 16, pos.x, pos.y, size.x, size.y);
        } else {
            this.texture = null;
        }
        if (DEBUG) {
            this.boundingBoxPressure.draw(context);
        }
    }
}

class Pipe extends BackgroundElement{
    constructor(x,y, color){
        super(x, y, TILEWIDTH, TILEHEIGHT, "pipe", true, null, color, null);
        this.colorPipe = color;
        this.center = { x: x, y: y};
        this.boundingBoxPressure = new BoundingBox(x+0.5*TILEWIDTH, y+0.5*TILEHEIGHT, TILEWIDTH*0.2, TILEHEIGHT*0.2);
        this.occupied = false;

        
        
    }


    isOccupied() {
        return this.occupied;
    }

    draw(context){
        //super.draw(context);

        this.boundingBoxPressure.draw(context);
    }


}

class FloatingHeart extends BackgroundElement{
    constructor(x, y){
        super(x, y, TILEWIDTH, TILEHEIGHT, "floating_heart", true, textures.floating_heart, "blue", null);
        this.boundingBoxPressure = new BoundingBox(x+0.5*TILEWIDTH, y+0.2*TILEHEIGHT, TILEWIDTH*0.2, TILEHEIGHT*0.2);
    }

    steptOn(player) {
        console.log("Floating heart collected, player healed!");
        if (player && typeof player.takeDamage === "function") {
            player.takeDamage(-1); // Heal the player by 10 health points

            // remove the floating heart from the scene
            player.scene.levelContent = player.scene.levelContent.filter(element => element !== this);
        }
    }
}

class FloatingMoney extends BackgroundElement{
    constructor(x, y){
        super(x, y, TILEWIDTH/2, TILEHEIGHT, "floating_heart", true, textures.floating_money, "green");
        this.boundingBoxPressure = new BoundingBox(x+0.25*TILEWIDTH, y+0.5*TILEHEIGHT, 0.5*TILEWIDTH, TILEHEIGHT);
    }

    draw(context) {
        super.draw(context); // Draw the floating money texture
        if (DEBUG) {
            this.boundingBoxPressure.draw(context); // Draw the bounding box for debugging
        }
    }

    steptOn(player) {
        if (player && typeof player.takeDamage === "function") {
            if (player.addMoney === undefined) return;
            player.addMoney(1); // Heal the player by 10 health points

            // remove the floating heart from the scene
            player.scene.levelContent = player.scene.levelContent.filter(element => element !== this);

            // remove the floating money from the permanent scene
            const global_level = player.scene.getLevel();
            global_level.removeElement(this.globalReference); 
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
function createStatue(x, y, dialog, options = null, onSelect = null) {
    let element =  new Statue(x, y, dialog, options, onSelect);
    return element;
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
    constructor(name, icon, effects = {}) {
        super(name, icon, false);
        this.type = "equipment";
        this.effects = effects;
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

const BraceletStrength = new Equipment("Power Bracelet", textures.braceletStrength, [new Effect("strength", 15, 0)]);
const Shield = new Equipment("Shield", textures.shield, [new Effect("defense", 10, 0)]);
const Sword = new Equipment("Sword", textures.sword, [new Effect("attack", 10, 0)]);
const Feather = new Equipment("Feather", textures.feather, [new Effect("fly", 1, 0)]);

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
                // Create a new Tombstone instance
                let copy = new Tombstone(
                    element.x, element.y,
                    element.isWalkable
                );
                copy.texture = element.texture; 
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
            } else if (element instanceof Statue) {
                let copy = new Statue(
                    element.x, element.y, element.dialog, element.options, null
                );
                copy.globalReference = element;
                copy.boundingBox = element.boundingBox;
                copy.callback = element.callback;

                // Rebind onSelect with proper 'copy' reference
                if (element.onSelect) {
                    copy.onSelect = (selectedIndex) => element.onSelect(selectedIndex, copy);
                }

                return copy;
            } else if (element instanceof PortcullisKeyLock) {
                // Create a new PortcullisKeyLock instance
                let copy = new PortcullisKeyLock(
                    element.x, element.y, element.key, element.direction
                );
                copy.boundingBox =  element.boundingBox; 
                copy.globalReference = element;
                copy.isOpen = element.isOpen; // Copy the isOpen state
                copy.callback = element.callback; 
                copy.texture = element.texture; 
                return copy;
            } else if (element instanceof Portcullis) { 
                // Create a new Portcullis instance
                let copy = new Portcullis(
                    element.x, element.y, element.direction
                );
                copy.boundingBox =  element.boundingBox; 
                copy.globalReference = element;
                copy.isOpen = element.isOpen; // Copy the isOpen state
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof Rotor) {
                // Create a new Rotor instance
                let copy = new Rotor(
                    element.x, element.y, 
                    element.identifier,
                    element.neighbors,
                    element.current_color
                );
                copy.onSolved = element.onSolved; // Copy the onSolved callback
                copy.globalReference = element;
                copy.boundingBox = element.boundingBox; 
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof FloatingHeart) {
                // Create a new FloatingObject instance
                let copy = new FloatingHeart(
                    element.x, element.y
                );
                copy.globalReference = element;
                copy.boundingBoxPressure = element.boundingBoxPressure; 
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof FloatingMoney) {
                // Create a new FloatingObject instance
                let copy = new FloatingMoney(
                    element.x, element.y
                );
                copy.globalReference = element;
                copy.boundingBoxPressure = element.boundingBoxPressure; 
                copy.callback = element.callback; 
                return copy;
            } else if (element instanceof FloatingFloor) {
                // Create a new FloatingFloor instance
                let copy = new FloatingFloor(
                    element.x, element.y, element.uses
                );
                copy.globalReference = element;
                copy.boundingBoxPressure = element.boundingBoxPressure; 
                copy.callback = element.callback; 
                return copy;
            }else if(element instanceof Pipe){
                let copy = new Pipe(
                    element.x, element.y, element.color
                );
                copy.globalReference = element;
                copy.boundingBoxPressure = element.boundingBoxPressure; 
                copy.callback = element.callback; 
                return copy;
            }else if (element instanceof Lights) {
                // Create a new Lights instance
                let copy = new Lights(
                    element.x, element.y, element.direction
                );
                copy.globalReference = element;
                copy.boundingBox = element.boundingBox; 
                copy.direction = element.direction; // Copy the direction
                copy.update = element.update; // Copy the update method
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
                return new element.constructor(
                    element.x,
                    element.y,
                    element.width,
                    element.height,
                    element.texture,
                    element.color
                );
                //return new Enemy(element.x, element.y, element.width, element.height, element.texture); 
            } else if (element instanceof Projectile){
                console.log("El elemento es un projectile");
                return new Projectile(element.center, element.width, element.height);
            } else {
                console.warn("Unknown element type:", element);
                return null; // Handle unexpected types gracefully
            }
        });
    }

    removeElement(element) {
        // Remove an element from the level's background elements
        this.background_elements = this.background_elements.filter(el => el !== element);
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
