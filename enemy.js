class Enemy {
    constructor(x, y, width, height, texture = 'imgs/enemies/Octorok.png') {
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Width of the player
        this.height = height; // Height of the player
        this.render_layer = -1;
        //this.texture = new Texture(texture); // Texture (sprites) for the player //OLD

        //Cara a futuro
        this.life = true; // CSi la unidad esta viva o muerta
        this.health = 1; //Cantidad de vida del enemigo.
        
        // movementS
        this.speed = 0.00005; //Modified 
        this.direction = { x: 0, y: 0 }; // Normalized movement vector
        this.lastDirection = { x: 0, y: 0 };; // Direction the player is facing
        this.moving = false; // Whether the player is moving
        
        // Tiempo para cambiar de dirección
		this.changeDirTimer = 0;
		this.timeToChange = 1000 + Math.random() * 2000; // entre 1 y 3 segundos

        // Crear sprite (esto reemplaza a tu this.texture y this.sprites)
		this.sprite = new Sprite(this.x, this.y, this.width, this.height, 10, new Texture(texture)); // 10 fps
   
        // Agregar animaciones propias del enemigo. Por defecto
		this.animDown = this.sprite.addAnimation();
		this.sprite.addKeyframe(this.animDown, [0, 0, 16, 16]); 
		this.sprite.addKeyframe(this.animDown, [16, 0, 16, 16]); // Revisar tamaño -> cambiarlo a 32x32

		this.animUp = this.sprite.addAnimation();
		this.sprite.addKeyframe(this.animUp, [64, 0, 16, 16]);
		this.sprite.addKeyframe(this.animUp, [80, 0, 16, 16]); 

		this.animLeft = this.sprite.addAnimation();
		this.sprite.addKeyframe(this.animLeft, [32, 0, 16, 16]);
		this.sprite.addKeyframe(this.animLeft, [48, 0, 16, 16]);

        this.animRight = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.animRight, [96, 0, 16, 16]);
		this.sprite.addKeyframe(this.animRight, [112, 0, 16, 16]);

		// Por ejemplo, podrías tener animaciones distintas para otros enemigos

		this.sprite.setAnimation(this.animDown); // Animación por defecto

        /* //OLD
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
        };*/


    }

    getRandomDirection(){
        const dirs = [
			{ x: 0, y: -1 }, // arriba
			{ x: 0, y: 1 },  // abajo
			{ x: -1, y: 0 }, // izquierda
			{ x: 1, y: 0 },  // derecha
			{ x: 0, y: 0 }   // quieto
		];
		return dirs[Math.floor(Math.random() * dirs.length)];
    }

    draw(context) {
        this.sprite.draw();
        
        //OLD
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);
    
        /*
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

        */

        //DEBUG
        // Draw the bounding box of the player
        context.strokeStyle = 'red'; // Set the color of the bounding box
        context.lineWidth = 1; // Set the width of the bounding box lines
        context.strokeRect(pos.x, pos.y, size.x, size.y); // Draw the bounding box
    
        /*
        //OLD
        // Restore context if mirrored
        if (this.lastDirection.x === 1 || this.lastDirection.y !== 0) context.restore();  // Only restore if mirrored
        */


    }

    update(deltaTime) {
        // Actualiza temporizador para cambiar dirección
		this.changeDirTimer += deltaTime;
		if (this.changeDirTimer >= this.timeToChange) {
			this.changeDirTimer = 0;
			this.timeToChange = 1000 + Math.random() * 2000;
			this.setDirection(this.getRandomDirection().x, this.getRandomDirection().y);
		}
        
        // Normalize direction to prevent diagonal speed boost
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;

        if (this.moving) {
            // Normalize movement
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;

            // Move enemy
            this.x += this.direction.x * this.speed * deltaTime;
            this.y += this.direction.y * this.speed * deltaTime;

            // Limitar movimiento a los bordes del canvas
            const canvas = document.getElementById("game-layer");
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            //FIXME: Arreglar 
            // Asegurar que no se salga del área visible
            this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
            this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
        }
        /*
        //OLD
        if (this.moving) {
            // Normalize movement
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;

            // Move enemy
            this.x += this.direction.x * this.speed * deltaTime;
            this.y += this.direction.y * this.speed * deltaTime;

            // **Handle Animation Frame Switching**
            //FIXME: Modificar
            this.animationTimer += deltaTime;
            if (this.animationTimer > this.frameDuration) {
                this.frame = this.frame === 0 ? 1 : 0; // Toggle between frame 0 and 1
                this.animationTimer = 0;
            }
        } else {
            this.frame = 0; // Reset to idle when not moving
        }*/

        
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        let newAnim = this.animRight; // default

        if (this.lastDirection.y === 1) newAnim = this.animDown;
        else if (this.lastDirection.y === -1) newAnim = this.animUp;
        else if (this.lastDirection.x === 1) newAnim = this.animRight;
        else if (this.lastDirection.x === -1) newAnim = this.animLeft;

        // Solo cambia la animación si es diferente
        if (this.sprite.currentAnimation !== newAnim) {
            this.sprite.setAnimation(newAnim);
        }

        // Solo animar si está moviéndose
        if (this.moving) {
            this.sprite.update(deltaTime);
        } else {
            this.sprite.currentKeyframe = 0; // Mostrar frame "quieto"
        }
        
        //this.setDirection(direction.x, direction.y);
       
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
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    resetPosition() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
    }
}

