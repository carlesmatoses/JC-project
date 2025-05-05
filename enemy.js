class Enemy {
    constructor(x, y, width, height, texture = 'imgs/enemies/Octorok.png') {
        this.x = x; // X position
        this.y = y; // Y position
        this.lastPosition = { x: x, y: y }; // Last position for collision detection
        this.width = width; // Width of the player
        this.height = height; // Height of the player
        this.render_layer = 0   ; //this.render_layer = -1;
        this.center = { x: x+width / 2, y: y+height / 2 }; // local center 
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width*0.9, height*0.9);

        // FIXME: Carles hay que buscar una manera de pasarle la escena y tambien el player para detectar colision con él 
        // Ademas esta con el codigo "antiguo" sin tener en cuenta las colisiones por el problema de pasarle la escena
        //this.scene = scene;

        //FIXME: Al poner su texture se bugea no se porque
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

        console.log("Enemigo Creado");

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
        
        //DEBUG
        // Draw the bounding box of the player
        context.strokeStyle = 'red'; // Set the color of the bounding box
        context.lineWidth = 1; // Set the width of the bounding box lines
        context.strokeRect(pos.x, pos.y, size.x, size.y); // Draw the bounding box
    
     

        //console.log("Enemigo Dibujado");

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
            //console.log("Animandose el enemigo");
        } else {
            this.sprite.currentKeyframe = 0; // Mostrar frame "quieto"
        }
        
        //this.setDirection(direction.x, direction.y);
       
    }
    
    /*
    update(deltaTime) {
        // Cambiar dirección cada cierto tiempo
        this.changeDirTimer += deltaTime;
        if (this.changeDirTimer >= this.timeToChange) {
            this.changeDirTimer = 0;
            this.timeToChange = 1000 + Math.random() * 2000;
            const randomDir = this.getRandomDirection();
            this.setDirection(randomDir.x, randomDir.y);
        }
    
        // Normalizar dirección
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;
    
        if (this.moving) {
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;
    
            let offsetX = this.direction.x * this.speed * deltaTime;
            let offsetY = this.direction.y * this.speed * deltaTime;
    
            // Guardar referencia para colisión
            let collidedX = false;
            let collidedY = false;
    
            // --- Movimiento en X ---
            this.x += offsetX;
            this.center.x = this.x + (this.width / 2);
            this.boundingBox.setPosition(this.center.x, this.center.y);
    
            for (let element of this.scene.levelContent) {
                if (element.boundingBox && element.isActive()) {
                    if (this.boundingBox.isColliding(element.boundingBox)) {
                        this.x -= offsetX; // revertir movimiento
                        this.center.x = this.x + (this.width / 2);
                        this.boundingBox.setPosition(this.center.x, this.center.y);
                        collidedX = true;
                        break;
                    }
                }
            }
    
            // --- Movimiento en Y ---
            this.y += offsetY;
            this.center.y = this.y + (this.height / 2);
            this.boundingBox.setPosition(this.center.x, this.center.y);
    
            for (let element of this.scene.levelContent) {
                if (element.boundingBox && element.isActive()) {
                    if (this.boundingBox.isColliding(element.boundingBox)) {
                        this.y -= offsetY; // revertir movimiento
                        this.center.y = this.y + (this.height / 2);
                        this.boundingBox.setPosition(this.center.x, this.center.y);
                        collidedY = true;
                        break;
                    }
                }
            }
    
            if (!collidedX && !collidedY) {
                this.lastDirection = { ...this.direction };
            }
        }
    
        // Animación según dirección
        let newAnim = this.animRight;
        if (this.lastDirection.x === -1) newAnim = this.animLeft;
        else if (this.lastDirection.x === 1) newAnim = this.animRight;
        else if (this.lastDirection.y === -1) newAnim = this.animUp;
        else if (this.lastDirection.y === 1) newAnim = this.animDown;
    
        if (this.sprite.currentAnimation !== newAnim) {
            this.sprite.setAnimation(newAnim);
        }
    
        // Actualizar sprite solo si se mueve
        if (this.moving) {
            this.sprite.update(deltaTime);
        } else {
            this.sprite.currentKeyframe = 0;
            this.sprite.elapsedTime = 0;
        }
    
        // Sincronizar sprite con posición
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    } */
    

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

    translatePosition(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    isActive() {
        return this.life;
    }
}

