class Player {
    constructor(x, y, width, height, texture = 'imgs/link/link_sprites.png') {
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Width of the player
        this.height = height; // Height of the player
        this.texture = new Texture(texture); // Texture (sprites) for the player
        
        // movement
        this.speed = 0.0002;
        this.direction = { x: 0, y: 0 }; // Normalized movement vector
        this.lastDirection = { x: 0, y: 0 };; // Direction the player is facing
        this.moving = false; // Whether the player is moving
        
        // Animation
        this.frame = 0; // Current frame of the player's animation (0,1)
        this.animationTimer = 0;
        this.frameDuration = 100; // Time in milliseconds for each frame
        this.lastPosition = { x: 0, y: 0 }; // Last position of the player for collision detection
        
        // Sprites
        this.sprites = {
            idle_walk_0: { start: { x: 1, y: 11 }, end: { x: 16, y: 27 } }, // facing down
            idle_walk_1: { start: { x: 18, y: 11 }, end: { x: 33, y: 27 } }, // facing up
            idle_walk_2_1: { start: { x: 35, y: 11 }, end: { x: 50, y: 27 } }, // facing left
            idle_walk_2_2: { start: { x: 52, y: 11 }, end: { x: 67, y: 27 } }  // facing left 2
        };
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);
    
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
        
        let centerX = this.x + (this.width / 2);
        let centerY = this.y + (this.height / 2);
        let centerPixels = transform(centerX,centerY,context) 
        let sizePixels = transform(this.width, this.height, context);

        // Draw the bounding box of the player
        context.strokeStyle = 'red'; // Set the color of the bounding box
        context.lineWidth = 1; // Set the width of the bounding box lines
        context.strokeRect(centerPixels.x-sizePixels.x/2, centerPixels.y-sizePixels.y/2, sizePixels.x, sizePixels.y); // Draw the bounding box
        
        // Draw a circle in the center of the player for debugging
        context.beginPath();
        context.arc(centerPixels.x, centerPixels.y, 4, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();

        // Draw the hand rectangle for collision detection
        let handRect = {
            x: (centerX-this.width/8) + (this.lastDirection.x * (this.width/2+this.width/8)),
            y: (centerY-this.height/8) + (this.lastDirection.y * (this.height/2+this.height/8)),
            width: this.width/4,
            height: this.height/4
        };

        let handRectPixels = transform(handRect.x, handRect.y, context);
        let handRectSizePixels = transform(handRect.width, handRect.height, context);
        context.strokeStyle = 'blue'; // Set the color of the hand rectangle
        context.lineWidth = 1; // Set the width of the hand rectangle lines
        context.strokeRect(handRectPixels.x, handRectPixels.y, handRectSizePixels.x, handRectSizePixels.y); // Draw the hand rectangle

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


        // Player movement control
        let direction = { x: 0, y: 0 };

        if (keyboard[37]) direction.x += -1; // Left arrow
        if (keyboard[39]) direction.x += 1;  // Right arrow
        if (keyboard[38]) direction.y += -1; // Up arrow
        if (keyboard[40]) direction.y += 1;  // Down arrow

        this.setDirection(direction.x, direction.y);

        // reset direction if no key is pressed
        if(!keyboard[37] && !keyboard[39] && !keyboard[38] && !keyboard[40]) this.setDirection(0, 0);


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

    collidesWith(element) {
        // Check if the player is colliding with the specified element
        return element.isColliding(this.x, this.y, this.width, this.height);
    }

    collidesWithHand(elements) {
        // Define the hand rectangle based on the player's direction
        let handRect = {
            x: (this.x + this.width / 2) + (this.lastDirection.x * (this.width / 2 + this.width / 8)),
            y: (this.y + this.height / 2) + (this.lastDirection.y * (this.height / 2 + this.height / 8)),
            width: this.width / 4,
            height: this.height / 4
        };

        // Check collision with each element in the provided array
        for (let element of elements) {
            if (element.isColliding(handRect.x, handRect.y, handRect.width, handRect.height) && element.interact) {
                element.interact(this); // Call the interact method of the element
                return element; // Return the first element that collides
            }
        }

        return null; // No collision detected
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    resetPosition() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
    }
}

