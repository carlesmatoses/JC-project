
class Stats{
    constructor(health, attack, defense, strength, speed) {
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.strength = strength;
        this.speed = speed;
        
        this.bonuses = {
            health: 0,
            attack: 0,
            defense: 0,
            strength: 0,
            speed: 0
        };

        this.effects = {
            health: 0,
            attack: 0,
            defense: 0,
            strength: 0,
            speed: 0
        }
    }

    getTotalStats() {
        return {
            health: this.health + this.bonuses.health + this.effects.health,
            attack: this.attack + this.bonuses.attack + this.effects.attack,
            defense: this.defense + this.bonuses.defense + this.effects.defense,
            strength: this.strength + this.bonuses.strength + this.effects.strength,
            speed: this.speed + this.bonuses.speed + this.effects.speed
        };
    }
    applyEffects(effects) {
        for (let effect of effects) {
            if (this.effects[effect.stat] !== undefined) {
                this.effects[effect.stat] += effect.value;
            } else {
                console.error("Invalid stat for effect:", effect.stat);
            }
        }
    }
    removeEffects(effects) {
        for (let effect of effects) {
            if (this.effects[effect.stat] !== undefined) {
                this.effects[effect.stat] -= effect.value;
            } else {
                console.error("Invalid stat for effect:", effect.stat);
            }
        }
    }
}

// Inventory.js
class Inventory {
    constructor(player) {
        this.items = new Map(); // key: item.name or item.id, value: { item, quantity }
        this.equipedLeft = null; // left hand
        this.equipedRight = null; // right hand
        this.stats = player.stats; // reference to player stats
    }

    addItem(item, quantity = 1) {
        if (this.items.has(item.name)) {
            this.items.get(item.name).quantity += quantity;
        } else {
            this.items.set(item.name, { item, quantity });
        }
    }

    removeItem(item, quantity = 1) {
        if (!this.items.has(item.name)) return false;
        const entry = this.items.get(item.name);
        entry.quantity -= quantity;
        if (entry.quantity <= 0) this.items.delete(item.name);
        return true;
    }

    getItemQuantity(item) {
        return this.items.get(item.name)?.quantity || 0;
    }

    equipItem(item) {
        if (item instanceof Equipment) {
            this.equipedLeft = item;
            if (item.effects) this.stats.applyEffects(item.effects);
        } else {
            console.error("Item is not equipment or invalid slot.");
        }
    }
    unequipItem(item) {
        if (item instanceof Equipment) {
            if (this.equipedLeft === item) {
                this.equipedLeft = null;
            } else if (this.equipedRight === item) {
                this.equipedRight = null;
            } else {
                console.error("Item is not equipped in either hand.");
                return;
            }
            if (item.effects) this.stats.removeEffects(item.effects);
        } else {
            console.error("Item is not equipment or invalid slot.");
        }
    }
}


class Player {
    constructor(x, y, width, height, texture = 'imgs/link/link_sprites.png') {
        this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		// this.speed = 0.0004;
		this.direction = { x: 0, y: 0 };
		this.lastDirection = { x: 0, y: 1 }; // mirando hacia abajo por defecto
		this.moving = false;
        this.scene = null; // store a reference to the scene
        this.center = { x: x+width / 2, y: y+height / 2 }; // local center 
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width, height);
        this.handBoundingBox = new BoundingBox(this.center.x, this.center.y, width/4, height/4);

        // inventory
        this.stats = new Stats(100, 10, 5, 16, 0.0004); // health, attack, defense, strength, speed
        this.inventory = new Inventory(this);

        // Pushing mechanics
        this.lastBlockedDirection = null;
        this.pushAttemptTimer = 0;
        this.pushThreshold = 1*1000; // ms

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
        // if (this.lastDirection.x === 1) {
		// 	// Reflejar horizontalmente para derecha
		// 	context.save();
		// 	context.scale(-1, 1);
		// 	this.sprite.x = -this.x - this.width;
		// 	this.sprite.draw();
		// 	context.restore();
		// 	this.sprite.x = this.x; // Restaurar posición original
		// } else {
		// 	this.sprite.draw();
		// }

        if (DEBUG){
            this.boundingBox.draw(context);
            this.handBoundingBox.draw(context);
            
            // Draw a circle in the center of the player for debugging
            let centerPixels = transform(this.center.x,this.center.y,context) 
            context.beginPath();
            context.arc(centerPixels.x, centerPixels.y, 8, 0, 2 * Math.PI);
            context.fillStyle = "red";
            context.fill();
        }
    }

    update(deltaTime) {
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;
    
        if (this.moving) {
            // Normalizar dirección
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;
    
            // Mover personaje
            let offsetX = this.direction.x * this.stats.getTotalStats().speed * deltaTime;
            let offsetY = this.direction.y * this.stats.getTotalStats().speed * deltaTime;

            let collidedElement = null;
            // Move X first
            this.x += offsetX;
            this.center.x = this.x + (this.width / 2);
            this.boundingBox.setPosition(this.center.x, this.center.y);
            this.handBoundingBox.setPosition(
                this.center.x + (this.lastDirection.x * (this.width / 2 + this.width / 8)), 
                this.center.y + (this.lastDirection.y * (this.height / 2 + this.height / 8)),
            );

            let collidedX = false;


            for (let element of this.scene.levelContent) {
                if (element.boundingBox && element.isActive()) {
                    if (this.boundingBox.isColliding(element.boundingBox)) {
                        // Revert X movement
                        this.x -= offsetX;
                        this.center.x = this.x + (this.width / 2);
                        this.boundingBox.setPosition(this.center.x, this.center.y);
                        collidedX = true;

                        if (element.onCollision) {
                            element.onCollision({ scene: this.scene });
                        }

                        break;
                    }
                }
            }
            // Move Y
            this.y += offsetY;
            this.center.y = this.y + (this.height / 2);
            this.boundingBox.setPosition(this.center.x, this.center.y);
            this.handBoundingBox.setPosition(
                this.center.x + (this.lastDirection.x * (this.width / 2 + this.width / 8)), 
                this.center.y + (this.lastDirection.y * (this.height / 2 + this.height / 8)),
            );
            let collidedY = false;

            for (let element of this.scene.levelContent) {
                if (element.boundingBox && element.isActive()) {
                    if (this.boundingBox.isColliding(element.boundingBox)) {
                        // Revert Y movement
                        this.y -= offsetY;
                        this.center.y = this.y + (this.height / 2);
                        this.boundingBox.setPosition(this.center.x, this.center.y);
                        collidedY = true;

                        if (element.onCollision) {
                            element.onCollision({ scene: this.scene });
                        }

                        break;
                    }
                }
            }

            for (let element of this.scene.levelContent) {
                if (element.boundingBox && this.handBoundingBox.isColliding(element.boundingBox) && element.type !== "door") {
                    collidedElement = element;
                    break;
                }
            }
           
            if (collidedX || collidedY) {
                if (this.sameDirection(this.direction, this.lastBlockedDirection)) {
                    this.pushAttemptTimer += deltaTime;
                    if (this.pushAttemptTimer > this.pushThreshold && collidedElement?.isPushable) {
                        if (this.stats.getTotalStats().strength > 15) {
                            collidedElement.tryPush(this.direction, this.scene);
                            this.pushAttemptTimer = 0;
                        }
                        else {
                            this.pushAttemptTimer = 0;
                            this.lastBlockedDirection = { ...this.direction };
                            console.log("No tienes suficiente fuerza para empujar el objeto.");
                        }
                    }
                } else {
                    this.pushAttemptTimer = 0;
                    this.lastBlockedDirection = { ...this.direction };
                }
            } else {
                this.pushAttemptTimer = 0;
                this.lastBlockedDirection = null;
            }

            // // TODO: esto debe estar en draw
            // // Cambiar animación si cambia la dirección
            // if (this.direction.x === -1 && this.sprite.currentAnimation !== this.ANIM_LEFT) {
            //     this.sprite.setAnimation(this.ANIM_LEFT);
            // } else if (this.direction.x === 1 && this.sprite.currentAnimation !== this.ANIM_RIGHT) {
            //     this.sprite.setAnimation(this.ANIM_RIGHT);
            // } else if (this.direction.y === -1 && this.sprite.currentAnimation !== this.ANIM_UP) {
            //     this.sprite.setAnimation(this.ANIM_UP);
            // } else if (this.direction.y === 1 && this.sprite.currentAnimation !== this.ANIM_DOWN) {
            //     this.sprite.setAnimation(this.ANIM_DOWN);
            // }
    
            this.lastDirection = { ...this.direction };
        } else {
            // Quieto: mantener dirección anterior pero detener la animación en el primer frame
            this.direction = { x: 0, y: 0 };
            // // TODO: esto debe estar en draw
            // if (this.lastDirection.x === -1) this.sprite.setAnimation(this.ANIM_LEFT);
            // else if (this.lastDirection.x === 1) this.sprite.setAnimation(this.ANIM_RIGHT);
            // else if (this.lastDirection.y === -1) this.sprite.setAnimation(this.ANIM_UP);
            // else if (this.lastDirection.y === 1) this.sprite.setAnimation(this.ANIM_DOWN);
    
            // // Congelar animación en primer frame
            // this.sprite.currentKeyframe = 0;
            // this.sprite.elapsedTime = 0; // <- importante para que no avance por deltaTime
        }
    
        // // TODO: esto debe estar en draw
        // // Sincronizar posición del sprite
        // this.sprite.x = this.x;
        // this.sprite.y = this.y;
    
        // // TODO: esto debe estar en draw
        // // Solo actualizar sprite si está en movimiento
        // if (this.moving) {
        //     this.sprite.update(deltaTime);
        // }
    
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

        // if "f" pressed, check for interaction with level elements
        if (keyboard[70]) {
            if (!this.fKeyState || this.fKeyState.released) {
                for (let element of this.scene.levelContent) {
                    if (element.boundingBox && this.handBoundingBox.isColliding(element.boundingBox)) {
                        if (element.interact) {
                            element.interact(this); // Call the interact method of the element
                        }
                        break; // Stop after the first interaction
                    }
                }
            }
            this.fKeyState = { down: true, pressed: false, released: false };
        } else {
            this.fKeyState = { down: false, pressed: false, released: true };
        }

    }    

    sameDirection(dir1, dir2) {
        if (!dir1 || !dir2) return false;
        return Math.sign(dir1.x) === Math.sign(dir2.x) &&
               Math.sign(dir1.y) === Math.sign(dir2.y);
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

    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.center.x = x + (this.width / 2);
        this.center.y = y + (this.height / 2);
        this.boundingBox.setPosition(this.center.x, this.center.y);
    }

    resetPosition() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
        this.center.x = this.x + (this.width / 2);
        this.center.y = this.y + (this.height / 2);
        this.boundingBox.setPosition(this.center.x, this.center.y);
    }
}

