class BackgroundElement {
    constructor(x, y, width, height, type, isWalkable, texture = null) {
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Width of the element
        this.height = height; // Height of the element
        this.type = type; // Type of the element (e.g., "ground", "wall", "rock")
        this.isWalkable = isWalkable; // Whether the user can walk on this element
        
        if (texture)
        this.texture = new Texture(texture); // Optional texture (image) for the element
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);

        if (this.texture) {
            // Draw the texture if it exists
            context.drawImage(this.texture.img, pos.x, pos.y, size.x, size.y);

        } else {
            // Draw the element based on its type
            if (this.type === "ground") {
                context.fillStyle = "green"; // Example color for ground
            } else if (this.type === "wall") {
                context.fillStyle = "gray"; // Example color for wall
            } else if (this.type === "rock") {
                context.fillStyle = "brown"; // Example color for rock
            }
            

            // Draw the rectangle representing the element
            context.fillRect(pos.x, pos.y, size.x, size.y);
        }
    }

    isColliding(playerX, playerY) {
        // Check if the player's position collides with this element
        return (
            playerX >= this.x &&
            playerX <= this.x + this.width &&
            playerY >= this.y &&
            playerY <= this.y + this.height
        );
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
}


class Player {
    constructor(x, y, width, height, texture = 'imgs/link/link_sprites.png') {
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Width of the player
        this.height = height; // Height of the player
        this.texture = new Texture(texture); // Texture (image) for the player
        
        // movement
        this.speed = 0.0005;
        this.direction = { x: 0, y: 0 }; // Normalized movement vector
        this.lastDirection = { x: 0, y: 0 };; // Direction the player is facing
        this.moving = false; // Whether the player is moving
        // Animation
        this.frame = 0; // Current frame of the player's animation (0,1)
        this.animationTimer = 0;
        this.frameDuration = 200; // Time in milliseconds for each frame
        // Sprites
        this.sprites = {
            idle_walk_0: { start: { x: 1, y: 11 }, end: { x: 16, y: 26 } }, // facing down
            idle_walk_1: { start: { x: 18, y: 11 }, end: { x: 33, y: 26 } }, // facing up
            idle_walk_2_1: { start: { x: 35, y: 11 }, end: { x: 50, y: 26 } }, // facing left
            idle_walk_2_2: { start: { x: 52, y: 11 }, end: { x: 67, y: 26 } }  // facing left 2
        };
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);
    
        // Draw the player
        context.imageSmoothingEnabled = false;
    
        // Determine the sprite based on direction
        let spriteKey;
        if (this.lastDirection.x === -1) { // Left
            // Select idle_walk_2_1 or idle_walk_2_2 based on frame
            spriteKey = this.frame === 0 ? 'idle_walk_2_1' : 'idle_walk_2_2';
        } else if (this.lastDirection.x === 1) { // Right
            // Select idle_walk_2_1 or idle_walk_2_2 for right (mirroring already handled by scaling)
            spriteKey = this.frame === 0 ? 'idle_walk_2_1' : 'idle_walk_2_2';
            context.save();  // Save current state
            context.scale(-1, 1); // Flip horizontally
            pos.x = -pos.x - size.x; // Offset mirrored sprite
        } else if (this.lastDirection.y === -1) { // Up
            spriteKey = 'idle_walk_1'; // Same sprite for both frames
            if (this.frame === 1) {
                context.save();  // Save current state
                context.scale(-1, 1); // Flip horizontally for frame 1
                pos.x = -pos.x - size.x; // Offset mirrored sprite
            }
        } else if (this.lastDirection.y === 1) { // Down
            spriteKey = 'idle_walk_0'; // Same sprite for both frames
            if (this.frame === 1) {
                context.save();  // Save current state
                context.scale(-1, 1); // Flip horizontally for frame 1
                pos.x = -pos.x - size.x; // Offset mirrored sprite
            }
        } else {
            spriteKey = 'idle_walk_0'; // Default sprite (standing still)
        }
    
        // Select the sprite based on the key
        const sprite = this.sprites[spriteKey];
    
        // Draw the sprite to the canvas
        context.drawImage(
            this.texture.img,
            sprite.start.x,
            sprite.start.y,
            sprite.end.x - sprite.start.x,
            sprite.end.y - sprite.start.y,
            pos.x,
            pos.y,
            size.x,
            size.y
        );
    
        // Restore context if mirrored
        if (this.lastDirection.x === 1 || this.lastDirection.y !== 0) context.restore();  // Only restore if mirrored
    }

    update(deltaTime) {
        // Normalize direction to prevent diagonal speed boost
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;
        
        if (this.moving) {
            // Normalize movement
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;

            // Move player
            this.x += this.direction.x * this.speed * deltaTime;
            this.y += this.direction.y * this.speed * deltaTime;

            // **Handle Animation Frame Switching**
            this.animationTimer += deltaTime;
            if (this.animationTimer > this.frameDuration) {
                this.frame = this.frame === 0 ? 1 : 0; // Toggle between frame 0 and 1
                this.animationTimer = 0;
            }
        } else {
            this.frame = 0; // Reset to idle when not moving
        }
    }

    setDirection(dx, dy) {
        this.direction.x = dx;
        this.direction.y = dy;

        // Only update lastDirection if there's movement
        if (dx !== 0 || dy !== 0) {
            this.lastDirection.x = dx;
            this.lastDirection.y = dy;
        }
    }

    isColliding(element) {
        // Check if the player is colliding with the specified element
        return element.isColliding(this.x, this.y);
    }
}


// level_001 elements
let size_x = 1/10;
let size_y = 1/9;
background_rock = "imgs/brick.png";

function createBasicTail(x, y) {
    const basicTail = new BackgroundElement(x, y, size_x, size_y, "ground", false, background_rock);
    return basicTail;
}

const level_001_elements = [

    

    createBasicTail(0,        0),
    createBasicTail(size_x,   0),
    createBasicTail(size_x*2, 0),
    createBasicTail(size_x*3, 0),
    createBasicTail(size_x*4, 0),
    createBasicTail(size_x*5, 0),
    createBasicTail(size_x*6, 0),
    createBasicTail(size_x*7, 0),
    createBasicTail(size_x*8, 0),
    createBasicTail(size_x*9, 0),

    createBasicTail(0,        size_y),
    createBasicTail(size_x,   size_y),
    createBasicTail(size_x*2, size_y),
    createBasicTail(size_x*3, size_y),
    createBasicTail(size_x*4, size_y),
    createBasicTail(size_x*5, size_y),
    createBasicTail(size_x*6, size_y),
    createBasicTail(size_x*7, size_y),
    createBasicTail(size_x*8, size_y),
    createBasicTail(size_x*9, size_y),

    createBasicTail(0,        size_y*2),
    createBasicTail(size_x,   size_y*2),
    createBasicTail(size_x*2, size_y*2),
    createBasicTail(size_x*3, size_y*2),
    createBasicTail(size_x*4, size_y*2),
    createBasicTail(size_x*5, size_y*2),
    createBasicTail(size_x*6, size_y*2),
    createBasicTail(size_x*7, size_y*2),
    createBasicTail(size_x*8, size_y*2),
    createBasicTail(size_x*9, size_y*2),

    createBasicTail(0,        size_y*3),
    createBasicTail(size_x,   size_y*3),
    createBasicTail(size_x*2, size_y*3),
    createBasicTail(size_x*3, size_y*3),
    createBasicTail(size_x*4, size_y*3),
    createBasicTail(size_x*5, size_y*3),
    createBasicTail(size_x*6, size_y*3),
    createBasicTail(size_x*7, size_y*3),
    createBasicTail(size_x*8, size_y*3),
    createBasicTail(size_x*9, size_y*3),

    createBasicTail(0,        size_y*4),
    createBasicTail(size_x,   size_y*4),
    createBasicTail(size_x*2, size_y*4),
    createBasicTail(size_x*3, size_y*4),
    createBasicTail(size_x*4, size_y*4),
    createBasicTail(size_x*5, size_y*4),
    createBasicTail(size_x*6, size_y*4),
    createBasicTail(size_x*7, size_y*4),
    createBasicTail(size_x*8, size_y*4),
    createBasicTail(size_x*9, size_y*4),

    createBasicTail(0,        size_y*5),
    createBasicTail(size_x,   size_y*5),
    createBasicTail(size_x*2, size_y*5),
    createBasicTail(size_x*3, size_y*5),
    createBasicTail(size_x*4, size_y*5),
    createBasicTail(size_x*5, size_y*5),
    createBasicTail(size_x*6, size_y*5),
    createBasicTail(size_x*7, size_y*5),
    createBasicTail(size_x*8, size_y*5),
    createBasicTail(size_x*9, size_y*5),

    createBasicTail(0,        size_y*6),
    createBasicTail(size_x,   size_y*6),
    createBasicTail(size_x*2, size_y*6),
    createBasicTail(size_x*3, size_y*6),
    createBasicTail(size_x*4, size_y*6),
    createBasicTail(size_x*5, size_y*6),
    createBasicTail(size_x*6, size_y*6),
    createBasicTail(size_x*7, size_y*6),
    createBasicTail(size_x*8, size_y*6),
    createBasicTail(size_x*9, size_y*6),

    createBasicTail(0,        size_y*7),
    createBasicTail(size_x,   size_y*7),
    createBasicTail(size_x*2, size_y*7),
    createBasicTail(size_x*3, size_y*7),
    createBasicTail(size_x*4, size_y*7),
    createBasicTail(size_x*5, size_y*7),
    createBasicTail(size_x*6, size_y*7),
    createBasicTail(size_x*7, size_y*7),
    createBasicTail(size_x*8, size_y*7),
    createBasicTail(size_x*9, size_y*7),

    createBasicTail(0,        size_y*8),
    createBasicTail(size_x,   size_y*8),
    createBasicTail(size_x*2, size_y*8),
    createBasicTail(size_x*3, size_y*8),
    createBasicTail(size_x*4, size_y*8),
    createBasicTail(size_x*5, size_y*8),
    createBasicTail(size_x*6, size_y*8),
    createBasicTail(size_x*7, size_y*8),
    createBasicTail(size_x*8, size_y*8),
    createBasicTail(size_x*9, size_y*8),

    createBasicTail(0,        size_y*9),
    createBasicTail(size_x,   size_y*9),
    createBasicTail(size_x*2, size_y*9),
    createBasicTail(size_x*3, size_y*9),
    createBasicTail(size_x*4, size_y*9),
    createBasicTail(size_x*5, size_y*9),
    createBasicTail(size_x*6, size_y*9),
    createBasicTail(size_x*7, size_y*9),
    createBasicTail(size_x*8, size_y*9),
    createBasicTail(size_x*9, size_y*9),
];