    class Player {
    constructor(x, y, width, height, texture = 'imgs/link/link_sprites.png') {
        this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = 0.0002;
		this.direction = { x: 0, y: 0 };
		this.lastDirection = { x: 0, y: 1 }; // mirando hacia abajo por defecto
		this.moving = false;

		// Sprite y animaciones
		this.texture = new Texture(texture);
		this.sprite = new Sprite(x, y, width, height, 10, this.texture);

		// Creamos animaciones (puedes añadir más si tienes otras direcciones o acciones)
		this.ANIM_DOWN = this.sprite.addAnimation(); // 0
		this.sprite.addKeyframe(this.ANIM_DOWN, [1, 11, 15, 16]);
		this.sprite.addKeyframe(this.ANIM_DOWN, [1, 11, 15, 16]);

		this.ANIM_UP = this.sprite.addAnimation(); // 1
		this.sprite.addKeyframe(this.ANIM_UP, [18, 11, 15, 16]); // mismo frame que antes
		this.sprite.addKeyframe(this.ANIM_UP, [18, 11, 15, 16]); // repetir si no tienes otra imagen

		this.ANIM_LEFT = this.sprite.addAnimation(); // 2
		this.sprite.addKeyframe(this.ANIM_LEFT, [35, 11, 15, 16]);
		this.sprite.addKeyframe(this.ANIM_LEFT, [52, 11, 15, 16]);

		this.ANIM_RIGHT = this.sprite.addAnimation(); // 3 (igual que left pero reflejado)
		this.sprite.addKeyframe(this.ANIM_RIGHT, [35, 11, 15, 16]);
		this.sprite.addKeyframe(this.ANIM_RIGHT, [52, 11, 15, 16]);

    }

    draw(context) {
        if (this.lastDirection.x === 1) {
			// Reflejar horizontalmente para derecha
			context.save();
			context.scale(-1, 1);
			this.sprite.x = -this.x - this.width;
			this.sprite.draw();
			context.restore();
			this.sprite.x = this.x; // Restaurar posición original
		} else {
			this.sprite.draw();
		}

		// Bounding box opcional
		let pos = transform(this.x, this.y, context);
		let size = transform(this.width, this.height, context);
		context.strokeStyle = 'red';
		context.lineWidth = 1;
		context.strokeRect(pos.x, pos.y, size.x, size.y);
    }

    update(deltaTime) {
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;
    
        if (this.moving) {
            // Normalizar dirección
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;
    
            // Mover personaje
            this.x += this.direction.x * this.speed * deltaTime;
            this.y += this.direction.y * this.speed * deltaTime;
    
            // Cambiar animación si cambia la dirección
            if (this.direction.x === -1 && this.sprite.currentAnimation !== this.ANIM_LEFT) {
                this.sprite.setAnimation(this.ANIM_LEFT);
            } else if (this.direction.x === 1 && this.sprite.currentAnimation !== this.ANIM_RIGHT) {
                this.sprite.setAnimation(this.ANIM_RIGHT);
            } else if (this.direction.y === -1 && this.sprite.currentAnimation !== this.ANIM_UP) {
                this.sprite.setAnimation(this.ANIM_UP);
            } else if (this.direction.y === 1 && this.sprite.currentAnimation !== this.ANIM_DOWN) {
                this.sprite.setAnimation(this.ANIM_DOWN);
            }
    
            this.lastDirection = { ...this.direction };
        } else {
            // Quieto: mantener dirección anterior pero detener la animación en el primer frame
            this.direction = { x: 0, y: 0 };
    
            if (this.lastDirection.x === -1) this.sprite.setAnimation(this.ANIM_LEFT);
            else if (this.lastDirection.x === 1) this.sprite.setAnimation(this.ANIM_RIGHT);
            else if (this.lastDirection.y === -1) this.sprite.setAnimation(this.ANIM_UP);
            else if (this.lastDirection.y === 1) this.sprite.setAnimation(this.ANIM_DOWN);
    
            // Congelar animación en primer frame
            this.sprite.currentKeyframe = 0;
            this.sprite.elapsedTime = 0; // <- importante para que no avance por deltaTime
        }
    
        // Sincronizar posición del sprite
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    
        // Solo actualizar sprite si está en movimiento
        if (this.moving) {
            this.sprite.update(deltaTime);
        }
    
        // Leer teclas
        let direction = { x: 0, y: 0 };
        if (keyboard[37]) direction.x = -1;
        if (keyboard[39]) direction.x = 1;
        if (keyboard[38]) direction.y = -1;
        if (keyboard[40]) direction.y = 1;
        this.setDirection(direction.x, direction.y);
    
        if (!keyboard[37] && !keyboard[39] && !keyboard[38] && !keyboard[40]) {
            this.setDirection(0, 0);
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

