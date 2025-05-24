class Enemy {
    constructor(x, y, width, height, texture =  textures.enemy) {
        this.x = x; // X position
        this.y = y; // Y position
        this.lastPosition = { x: x, y: y }; // Last position for collision detection
        this.width = width; // Width of the player
        this.height = height; // Height of the player
        this.render_layer = 0   ; //this.render_layer = -1;
        this.center = { x: x+width / 2, y: y+height / 2 }; // local center 
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width*0.8, height*0.8);
        this.type = "enemy";
        this.scene = null;

        //Cara a futuro
        this.life = true; // CSi la unidad esta viva o muerta
        this.health = 1; //Cantidad de vida del enemigo.
        this.stats = new Stats(100, 0.5, 5, 5, 0.00005); 

        // movementS
        this.speed = 0.00005; //Modified 
        this.direction = { x: 0, y: 0 }; // Normalized movement vector
        this.lastDirection = { x: 0, y: 0 };; // Direction the player is facing
        this.moving = false; // Whether the player is moving
        
        // Tiempo para cambiar de dirección
		this.changeDirTimer = 0;
		this.timeToChange = 1000 + Math.random() * 2000; // entre 1 y 3 segundos

        // Crear sprite 
		this.sprite = new Sprite(this.x, this.y, this.width, this.height, 10, texture); // 10 fps
   
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
        this.sprite.x  = this.x;
        this.sprite.y  = this.y;
        this.sprite.draw();
        
        if (DEBUG){
            this.boundingBox.draw(context);
        }
    }

    
    //OLD
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

            // Mover personaje
            let offsetX = this.direction.x * this.stats.getTotalStats().speed * deltaTime;
            let offsetY = this.direction.y * this.stats.getTotalStats().speed * deltaTime;
            let collidedElement = null;
            let collidedX = false;
            let collidedY = false;

            // Move X
            this.translatePosition(offsetX, 0);
            for (let element of this.scene.levelContent) {
                if (element === this) continue; // Skip self
                if (element.boundingBox && element.isActive()) {
                    if (this.boundingBox.isColliding(element.boundingBox)) {
                        // Revert X movement
                        this.translatePosition(-offsetX, 0);
                        collidedX = true;

                        if (element.onCollision)
                            element.onCollision({ scene: this.scene });
                        
                        break;
                    }
                }
            }
            // check if collision with the scene.player
            if (this.scene.player.boundingBox && this.boundingBox.isColliding(this.scene.player.boundingBox)) {
                // Revert X movement
                this.translatePosition(-offsetX, 0);
                collidedX = true;
            }
            // Check for collision with the scene boundaries
            if (this.x < 0 || this.x > 1) {
                // Revert X movement
                this.translatePosition(-offsetX, 0);
                collidedX = true;
            }

            // Move Y
            this.translatePosition(0, offsetY);
            for (let element of this.scene.levelContent) {
                if (element === this) continue; // Skip self
                if (element.boundingBox && element.isActive()) {
                    if (this.boundingBox.isColliding(element.boundingBox)) {
                        // Revert Y movement
                        this.translatePosition(0, -offsetY);
                        collidedY = true;

                        if (element.onCollision) 
                            element.onCollision({ scene: this.scene });

                        break;
                    }
                }
            }
            // check if collision with the scene.player
            if (this.scene.player.boundingBox && this.boundingBox.isColliding(this.scene.player.boundingBox)) {
                // Revert Y movement
                this.translatePosition(0, -offsetY);
                collidedY = true;
            }
            // Check for collision with the scene boundaries
            if (this.y < 0 || this.y > TILEHEIGHT*7) {
                // Revert Y movement
                this.translatePosition(0, -offsetY);
                collidedY = true;
            }
        }
        // Store last position only when is the actual object who is moving and not the camera
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;

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
        // Check if the enemy is colliding with the specified element
        return element.isColliding(this.x, this.y, this.width, this.height);
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.boundingBox.setPosition(x, y);
    }

    resetPosition() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
        this.boundingBox.setPosition(this.x, this.y);
    }

    translatePosition(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.boundingBox.translate(dx, dy);
        this.center.x = this.x + this.width / 2;
        this.center.y = this.y + this.height / 2;
        // this.lastPosition.x = this.x;
        // this.lastPosition.y = this.y;
    }

    isActive() {
        return this.life;
    }
}

