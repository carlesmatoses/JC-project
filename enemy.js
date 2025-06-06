class Projectile {
    constructor(center, width, height, direction, parent, damage = 0.5) {
        this.width = width; 
        this.height = height; 
        this.center = { x: center.x, y: center.y };
        this.lastCenter = { x: center.x, y: center.y }; // Last position for collision detection
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width, height);
        this.attack = damage;
        this.speed = 0.0004;
        this.direction = direction;   
        this.render_layer = -1;
        this.texture = textures.projectile; // Texture for the projectile
        this.parent = parent;

        this.isFading = false;
        this.alpha = 1.0; // Opacidad completa
        this.fadeSpeed = 0.005; // Velocidad a la que se desvanece
    }

    draw(context) {
        // Dibujar el proyectil como un rectángulo
        let topleftcorner = {
            x: this.center.x - this.width / 2,
            y: this.center.y - this.height / 2
        };
        let pos = transform(topleftcorner.x, topleftcorner.y, context);
        let size = transform(this.width, this.height, context);
        
        context.save(); // Guardar el estado original del contexto

         if (this.isFading) {
            context.globalAlpha = this.alpha;
        }

        // Dibujar la textura del proyectil
        if (this.texture && this.texture.isLoaded()) {
            context.drawImage(this.texture.img, pos.x, pos.y, size.x * 1.2, size.y  * 1.2);
        }

        if(DEBUG){
            this.boundingBox.draw(context);

            context.fillStyle = "green"; // Color del proyectil
            context.fillRect(pos.x, pos.y, size.x, size.y);
            context.restore();
        }

        context.restore();

    }

    update(deltaTime) {
        if (this.isFading) {
            this.alpha -= this.fadeSpeed * deltaTime;
            if (this.alpha <= 0) {
                this.destroy(this.parent.scene);
            }
            return; 
        }

        // Calcular desplazamiento en base a la dirección y velocidad del projectile
        const offsetX = this.direction.x * this.speed * deltaTime;
        const offsetY = this.direction.y * this.speed * deltaTime;
        this.translatePosition(offsetX, offsetY);
        this.lastCenter.x = this.center.x;
        this.lastCenter.y = this.center.y;

        // kill it if its out of bounds
        if (
            this.center.x + this.width / 2 < 0 ||
            this.center.x - this.width / 2 > 1 ||
            this.center.y + this.height / 2 < 0 ||
            this.center.y - this.height / 2 > TILEHEIGHT * 8
        ) {
            this.destroy(this.parent.scene);
        }
    }

    setPosition(x, y) {
        this.center.x = x;
        this.center.y = y;
        this.boundingBox.setPosition(this.center.x, this.center.y);
    }

    translatePosition(dx, dy) {
        this.center.x += dx;
		this.center.y += dy;
        this.boundingBox.translate(dx, dy);
    }

    resetPosition() {
        this.center.x = this.lastCenter.x;
        this.center.y = this.lastCenter.y;
        this.boundingBox.setPosition(this.center.x, this.center.y);
    }

    destroy(scene) {
        scene.levelContent = scene.levelContent.filter(e => e !== this);
    }
    onHit(target, scene){
        if (target.takeDamage) {
            target.takeDamage(this.attack, this.center);
        }
        //this.destroy(scene);
        this.isFading = true;
    }

}



class Enemy {
    constructor(x, y, width, height, texture =  textures.enemy, color = "red") {
        this.x = x; // X position
        this.y = y; // Y position
        this.lastPosition = { x: x, y: y }; // Last position for collision detection
        this.width = width; // Width of the player
        this.height = height; // Height of the player
        this.render_layer = 0   ; //this.render_layer = -1;
        this.center = { x: x+width / 2, y: y+height / 2 }; // local center 
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width*0.9, height*0.9);

        this.color = color;
        this.texture = texture; 
        this.type = "enemy";
        this.scene = null;

        //Effect Sounds
        this.takeDamageSound = AudioFX("audio/Minecraft_Damage-SoundEffect.wav");

        //Stats
        this.life = true; // CSi la unidad esta viva o muerta
        this.stats = new Stats(20, 0.5, 5, 5, 0.00005); //(health, attack, defense, strength, speed)    

        //Timers de daño y muerte
        this.isFlashing = false;
        this.flashTimer = 0;
        this.flashDuration = 300; // ms
        this.flashInterval = 100; // ms

        this.isFading = false;
        this.fadeAlpha = 1;
        this.fadeSpeed = 0.005; // por ms

        this.sprite = null;

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
        context.save(); // DEBUG: per a que es esta linea?

        // Controlar transparencia según efectos
        if (this.isFlashing) {
            //console.log("Daño recibido draw");
            const mod = Math.floor(this.flashTimer / this.flashInterval) % 2;
            context.globalAlpha = (mod === 0) ? 0 : 1;
        } else if (this.isFading) {
            context.globalAlpha = this.fadeAlpha;
        } else {
            context.globalAlpha = 1;
        }

        if(this.sprite){
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.draw(context);
        }
        

        context.restore();

        if (DEBUG) {
            this.boundingBox.draw(context);
        }

    }


    update(deltaTime) {

        if (!this.life && !this.isFading) return; 

        

        // Manejar parpadeo al recibir daño
        if (this.isFlashing) {
            //console.log("Daño recibido");
            this.flashTimer += deltaTime;
            if (this.flashTimer >= this.flashDuration) {
                this.isFlashing = false;
                this.flashTimer = 0;
            }
        }

        // Manejar desvanecimiento al morir
        if (this.isFading) {
            this.fadeAlpha -= this.fadeSpeed * deltaTime;
            if (this.fadeAlpha <= 0) {
                this.fadeAlpha = 0;
                this.isFading = false;
                //Elimina el enemigo
                if (this.scene) {
                    this.scene.levelContent = this.scene.levelContent.filter(e => e !== this);
                }
            }
        }

        if (!this.life) return;

        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
       
    }

    
    takeDamage(damageAmount) {
        if (!this.life) return; // Si ya está muerto, ignorar

        this.stats.health -= damageAmount;

        console.log(`Enemy took ${damageAmount} damage. Remaining health: ${this.stats.health }`);

        this.takeDamageSound.play();

        // Activar parpadeo
        this.isFlashing = true;
        this.flashTimer = 0;
    
        if (this.stats.health <= 0) {
            this.die();
        }

    }

    die() {
        if (!this.life) return;

        this.life = false;
        this.isFading = true;
        this.fadeAlpha = 1;
        console.log("Enemy died (fading out)");
        this.drop();
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
        return this.life || this.isFading;
    }

    drop() {
        console.log("Drop");
        const rand = Math.random(); // valor entre 0 y 1
        const x = this.x;
        const y = this.y;


        if (rand < 0.2) { // 20% de soltar corazón
            console.log("Drop Corazon");
            const heart = new FloatingHeart(x, y);
            this.scene.levelContent.push(heart);
        } else if (rand < 0.7) { // 50% de soltar moneda
            console.log("drop Moneda");
            const money = new FloatingMoney(x, y);
            this.scene.levelContent.push(money);
        }
        // 30% de no soltar nada
    }


}

class SeaUrchin extends Enemy{
    constructor(x, y, width, height, texture = textures.seaurchin){ 
        super(x, y, width, height, texture );

        this.stats =  new Stats(10, 2.0, 5, 5, 0.0000);

        this.sprite = new Sprite(this.x, this.y, this.width, this.height, 10, texture); // 10 fps

        this.animBasic = this.sprite.addAnimation();
		this.sprite.addKeyframe(this.animBasic, [0, 0, 16, 16]); 
		this.sprite.addKeyframe(this.animBasic, [16, 0, 16, 16]); // [x,y,w,h]
        this.sprite.addKeyframe(this.animBasic, [32, 0, 16, 16]); // [x,y,w,h]
        this.sprite.addKeyframe(this.animBasic, [48, 0, 16, 16]); // [x,y,w,h]

        this.sprite.setAnimation(this.animBasic); // Animación por defecto


    }

    update(deltaTime) {
        super.update(deltaTime); // Llama a la lógica de daño y fade del padre

        if (!this.life) return;

        // Actualizar animación
        this.sprite.update(deltaTime);

        const player = this.scene?.player;
        if (player && player.boundingBox && this.boundingBox.isColliding(player.boundingBox)) {
            if (player.takeDamage) {
                player.takeDamage(this.stats.getTotalStats().attack);
            }
        }
    }
}

class SeaUrchinBoss extends Enemy {
    constructor(x, y, width, height, texture = textures.seaurchin) {
        super(x, y, width, height, texture);
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width*1, height*1);
        this.center = { x: x + width / 2, y: y + height / 2 }; // local center
        
        this.stats = new Stats(300, 1.5, 5, 5, 0.0000);
        this.sprite = new Sprite(this.x, this.y, this.width, this.height, 5, texture); // 10 fps
        this.animBasic = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.animBasic, [0, 0, 16, 16]);
        this.sprite.addKeyframe(this.animBasic, [16, 0, 16, 16]);
        this.sprite.addKeyframe(this.animBasic, [32, 0, 16, 16]);
        this.sprite.addKeyframe(this.animBasic, [48, 0, 16, 16]);
        this.sprite.setAnimation(this.animBasic);

        // Phase and timers
        this.phase = 1;
        this.attackTimer = 0;
        this.cooldownTimer = 0;
        this.projectilesFired = 0;
        this.isAttacking = false;
        this.moveTarget = null;
        this.moveSpeed = 0.0005; // adjust for smooth movement (pixels/ms)
        this.waiting = false;
        this.semicircleTimer = 0;
        this.semicircleProjectiles = 0;
        this.side = "left";
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (!this.life) return;
        this.sprite.update(deltaTime);

        // Add 4 seconds of waiting once spawned
        if (this.spawnWait === undefined) {
            this.spawnWait = 0;
        }
        if (this.spawnWait < 4000) {
            this.spawnWait += deltaTime;
            return;
        }

        this.hp = this.stats.getTotalStats().health; 

        // Detect phase change
        let prevPhase = this._lastPhase || 1;
        let currentPhase;
        if (this.hp > 200) {
            currentPhase = 1;
        } else if (this.hp > 100) {
            currentPhase = 2;
        } else {
            currentPhase = 3;
        }
        if (currentPhase !== prevPhase) {
            console.log(`SeaUrchinBoss phase changed: ${prevPhase} -> ${currentPhase}`);
            this._lastPhase = currentPhase;
            this.projectilesFired = 0; 
            // Optionally reset timers or state here if needed
        }

        // Phase selection
        if (currentPhase === 1) {
            this.phase1Logic(deltaTime);
        } else if (currentPhase === 2) {
            this.phase2Logic(deltaTime);
        } else {
            this.phase3Logic(deltaTime);
        }

        // Contact damage
        const player = this.scene?.player;
        if (player && player.boundingBox && this.boundingBox.isColliding(player.boundingBox)) {
            if (player.takeDamage) {
                player.takeDamage(this.stats.getTotalStats().attack);
            }
        }
    }

    // PHASE 1: 3 projectiles towards player, 1.5s burst, 1.5s cooldown
    phase1Logic(deltaTime) {
        if (!this.phase1Timer) this.phase1Timer = 0;
        if (!this.projectilesFired) this.projectilesFired = 0;

        this.phase1Timer += deltaTime;

        // Fire projectile every 500ms, max 3 projectiles
        if (this.projectilesFired < 3 && this.phase1Timer >= this.projectilesFired * 500) {
            this.fireProjectileAtPlayer(); // assume this method exists
            this.projectilesFired++;
        }

        // After 3 projectiles + 1.5s pause, reset
        if (this.phase1Timer >= 1500 + 1500) {
            this.phase1Timer = 0;
            this.projectilesFired = 0;
        }
    }

    phase2Logic(deltaTime) {
        console.log("State", {
            isAttacking: this.isAttacking,
            projectilesFired: this.projectilesFired,
            moveTarget: this.moveTarget,
        });
        const center = { x: TILEWIDTH * 4, y: TILEHEIGHT * 6 };
        const returnPosition = { x: TILEWIDTH * 4, y: TILEHEIGHT * 2 };

        // Move to center
        if (!this.moveTarget && !this.isAttacking && this.projectilesFired === 0) {
            this.moveTarget = center;
        }

        // Moving logic
        if (this.moveTarget) {
            this.moveTowards(this.moveTarget, deltaTime);
            if (this.reachedTarget(this.moveTarget)) {
                this.moveTarget = null;
                if (this.projectilesFired === 0) {
                    this.isAttacking = true;
                    this.attackTimer = 0;
                    this.projectilesFired = 1;
                    this.fireProjectilesInCircle(8);
                    this.cooldownTimer = 0;
                    return; // prevent cooldownTimer increment in same frame
                }
            }
            return;
        }

        // Cooldown after circular shot
        if (this.projectilesFired === 1) {
            this.cooldownTimer += deltaTime;
            if (this.cooldownTimer >= 3500) {
                this.projectilesFired = 2;
                this.moveTarget = returnPosition;
                this.isAttacking = false;
            }
            return;
        }

        // After returning to position, fire semi-circle over 2 seconds
        if (!this.isAttacking && this.projectilesFired === 2 && this.reachedTarget(returnPosition)) {
            this.isAttacking = true;
            this.semicircleTimer = 0;
            this.semicircleProjectiles = 0;
        }

        if (this.isAttacking && this.projectilesFired === 2) {
            this.semicircleTimer += deltaTime;
            const totalProjectiles = 8;
            const interval = 2000 / totalProjectiles;

            while (this.semicircleProjectiles < totalProjectiles &&
                this.semicircleTimer >= this.semicircleProjectiles * interval) {
                const angle = Math.PI + (this.semicircleProjectiles / (totalProjectiles - 1)) * Math.PI;
                this.fireProjectileAtAngle(-angle); // still flipping?
                this.semicircleProjectiles++;
            }

            if (this.semicircleTimer >= 2000) {
                this.isAttacking = false;
                this.projectilesFired = 0;
                this.moveTarget = null; // start phase again
            }
        }
    }


    // PHASE 3: Move left, fire all, cooldown, move right, fire all, repeat
    phase3Logic(deltaTime) {
        const left = { x: TILEWIDTH * 2, y: TILEHEIGHT * 2 };
        const right = { x: TILEWIDTH * 6, y: TILEHEIGHT * 2 };

        if (!this.phase3Side) this.phase3Side = 'left'; // Track which side to go next
        if (!this.cooldownTimer) this.cooldownTimer = 0;

        if (!this.moveTarget) {
            this.moveTarget = (this.phase3Side === 'left') ? left : right;
        }

        this.moveTowards(this.moveTarget, deltaTime, 100); // smooth movement, speed = 100 px/sec

        if (this.reachedTarget(this.moveTarget)) {
            this.cooldownTimer += deltaTime;

            if (this.cooldownTimer === deltaTime) {
                this.fireProjectilesInCircle(12); // fire on arrival
            }

            if (this.cooldownTimer >= 2000) {
                this.cooldownTimer = 0;
                this.phase3Side = (this.phase3Side === 'left') ? 'right' : 'left';
                this.moveTarget = null;
            }
        }
    }

    // Helper: move smoothly towards a target
    moveTowards(target, deltaTime) {
        const dx = target.x - this.center.x;
        const dy = target.y - this.center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.01) {
            console.log("Reached target position");
            this.setPosition(target.x, target.y);
            return;
        }
        
        this.translatePosition(dx * this.moveSpeed * deltaTime, dy * this.moveSpeed * deltaTime);

        // console.log(`Moving towards target: ${target.x}, ${target.y}`);
        // const step = this.moveSpeed * deltaTime;
        // this.x += (dx / dist) * Math.min(step, dist);
        // this.y += (dy / dist) * Math.min(step, dist);
        // this.center.x = this.x + this.width / 2;
        // this.center.y = this.y + this.height / 2;
        // this.boundingBox.setPosition(this.center.x, this.center.y);
    }

    reachedTarget(target) {
        return Math.abs(this.center.x - target.x) < 0.01 && Math.abs(this.center.y - target.y) < 0.01;
    }

    // Fire a projectile at the player
    fireProjectileAtPlayer() {
        const player = this.scene?.player;
        if (!player) return;
        const dx = player.center.x - this.center.x;
        const dy = player.center.y - this.center.y;
        const mag = Math.sqrt(dx * dx + dy * dy);
        if (mag === 0) return;
        const direction = { x: dx / mag, y: dy / mag };
        const projectile = new Projectile(
            { x: this.center.x, y: this.center.y },
            TILEWIDTH, TILEHEIGHT,
            direction,
            this,
            this.stats.getTotalStats().attack
        );
        this.scene.levelContent.push(projectile);
    }

    // Fire projectiles in a circle (all directions)
    fireProjectilesInCircle(count) {
        for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * i) / count;
            this.fireProjectileAtAngle(angle);
        }
    }

    // Fire a projectile at a specific angle (radians)
    fireProjectileAtAngle(angle) {
        // Offset the projectile spawn position slightly in the direction to avoid overlap
        const offsetDistance = TILEWIDTH * .6;
        const direction = { x: Math.cos(angle), y: Math.sin(angle) };
        const spawnX = this.center.x + direction.x * offsetDistance;
        const spawnY = this.center.y + direction.y * offsetDistance;
        const projectile = new Projectile(
            { x: spawnX, y: spawnY },
            TILEWIDTH*.6, TILEHEIGHT*.6,
            direction,
            this,
            this.stats.getTotalStats().attack
        );
        this.scene.levelContent.push(projectile);
    }

    setPosition(x, y) {
        this.center.x = x;
        this.center.y = y;
        this.x = this.center.x - this.width / 2;
        this.y = this.center.y - this.height / 2;
        this.boundingBox.setPosition(x, y);
    }

}

class Octorok extends Enemy{
    //Ver como añadir stats personalizados
    constructor(x, y, width, height, texture = textures.octorok){ 

        super(x, y, width, height, texture );
        //timer de proyectil
        this.shootTimer = 0;
        this.shootInterval = 10000; // ms 

        // movementS
        this.speed = 0.001; 
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
		this.sprite.addKeyframe(this.animDown, [16, 0, 16, 16]); // [x,y,w,h]

		this.animUp = this.sprite.addAnimation();
		this.sprite.addKeyframe(this.animUp, [64, 0, 16, 16]);
		this.sprite.addKeyframe(this.animUp, [80, 0, 16, 16]); 

		this.animLeft = this.sprite.addAnimation();
		this.sprite.addKeyframe(this.animLeft, [32, 0, 16, 16]);
		this.sprite.addKeyframe(this.animLeft, [48, 0, 16, 16]);

        this.animRight = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.animRight, [96, 0, 16, 16]);
		this.sprite.addKeyframe(this.animRight, [112, 0, 16, 16]);


		this.sprite.setAnimation(this.animDown); // Animación por defecto
    }


    update(deltaTime){
        super.update(deltaTime);

        this.shootTimer += deltaTime;

        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.shoot();
        }

        // Actualiza temporizador para cambiar dirección
		this.changeDirTimer += deltaTime;
		if (this.changeDirTimer >= this.timeToChange) {
			this.changeDirTimer = 0;
			this.timeToChange = 1000 + Math.random() * 2000;
            let direction = this.getRandomDirection();
            this.setDirection(direction.x, direction.y);
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
                if (element.boundingBox && element.isActive && element.isActive()) {
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
                if (element.boundingBox && element.isActive && element.isActive()) {
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

    shoot() {
        const direction = { x: this.lastDirection.x, y: this.lastDirection.y };

        // Asegúrate de que no sea un vector nulo. Solo occurre cuando el enemigo aún no se ha movido
        if (direction.x === 0 && direction.y === 0) return;
        const projectileStart = {
            x: this.center.x,
            y: this.center.y
        };
        const projectileDirection = { 
            x: this.lastDirection.x, 
            y: this.lastDirection.y 
        };
        const projectile = new Projectile(projectileStart, TILEWIDTH/2.0, TILEHEIGHT/2.0, projectileDirection, this);
        this.scene.levelContent = this.scene.levelContent.concat([projectile]);
    }
}


class OrbMonster extends Enemy{
    //Ver como añadir stats personalizados
    constructor(x, y, width, height, texture = textures.orbmonster, color = "red"){ 

        super(x, y, width, height, texture, color);
        this.hitCounter = 0;
        this.orbTimer = 0; // Time for whichs hitCounter is the OrbMons
        this.orbInterval = 5000; //ms
        this.canMove = true;
        this.isPushable = false;

        this.colorOM = color;

        this.stats = new Stats(40, 1.0, 5, 5, 0.0002); //(health, attack, defense, strength, speed) 
        this.speed = 0.001; 
        this.direction = { x: 0, y: 0 }; // Normalized movement vector
        this.lastDirection = { x: 0, y: 0 };; // Direction the player is facing
        this.moving = false; // Whether the player is moving

        // Tiempo para cambiar de dirección
		this.changeDirTimer = 0;
		this.timeToChange = 1000 + Math.random() * 2000; // entre 1 y 3 segundos

        // Crear sprite 
		this.sprite = new Sprite(this.x, this.y, this.width, this.height, 10, texture); // 10 fps

        if (this.colorOM == "blue"){
            // Agregar animaciones propias del enemigo. Por defecto
            this.animDown = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animDown, [0, 16, 24, 16]);
            this.sprite.addKeyframe(this.animDown, [24, 16, 24, 16]);

            this.animUp = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animUp, [48, 16, 24, 16]);
            this.sprite.addKeyframe(this.animUp, [72, 16, 24, 16]); 

            this.animLeft = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animLeft, [24, 16, 24, 16]);
            this.sprite.addKeyframe(this.animLeft, [0, 16, 24, 16]);

            this.animRight = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animRight, [0, 16, 24, 16]);
            this.sprite.addKeyframe(this.animRight, [24, 16, 24, 16]);

            this.animFirstHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animFirstHit, [96, 16, 16, 16]);

            this.animSecondHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animSecondHit, [112, 16, 16, 16]);

            this.animThirdHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animThirdHit, [128, 16, 16, 16]);

            this.sprite.setAnimation(this.animDown); // Animación por defecto*/

        }else if (this.colorOM == "green"){
            // Agregar animaciones propias del enemigo. Por defecto
            this.animDown = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animDown, [0, 32, 24, 16]);
            this.sprite.addKeyframe(this.animDown, [24, 32, 24, 16]);

            this.animUp = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animUp, [48, 32, 24, 16]);
            this.sprite.addKeyframe(this.animUp, [72, 32, 24, 16]); 

            this.animLeft = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animLeft, [24, 32, 24, 16]);
            this.sprite.addKeyframe(this.animLeft, [0, 32, 24, 16]);

            this.animRight = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animRight, [0, 32, 24, 16]);
            this.sprite.addKeyframe(this.animRight, [24, 32, 24, 16]);

            this.animFirstHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animFirstHit, [96, 32, 16, 16]);

            this.animSecondHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animSecondHit, [112, 32, 16, 16]);

            this.animThirdHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animThirdHit, [128, 32, 16, 16]);

            this.sprite.setAnimation(this.animDown); // Animación por defecto*/
        }else{
            this.animDown = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animDown, [0, 0, 24, 16]);
            this.sprite.addKeyframe(this.animDown, [24, 0, 24, 16]);

            this.animUp = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animUp, [48, 0, 24, 16]);
            this.sprite.addKeyframe(this.animUp, [72, 0, 24, 16]); 

            this.animLeft = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animLeft, [24, 0, 24, 16]);
            this.sprite.addKeyframe(this.animLeft, [0, 0, 24, 16]); 
            
            this.animRight = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animRight, [0, 0, 24, 16]);
            this.sprite.addKeyframe(this.animRight, [24, 0, 24, 16]);

            this.animFirstHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animFirstHit, [96, 0, 16, 16]);

            this.animSecondHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animSecondHit, [112, 0, 16, 16]);

            this.animThirdHit = this.sprite.addAnimation();
            this.sprite.addKeyframe(this.animThirdHit, [128, 0, 16, 16]);

            this.sprite.setAnimation(this.animDown); // Animación por defecto
            
        }
    }


    update(deltaTime){
        super.update(deltaTime);

        // Manejo de fases (retroceso por no recibir daño)
        if (this.hitCounter > 0) {
            this.orbTimer += deltaTime;

            if (this.orbTimer >= this.orbInterval) {
                this.orbTimer = 0;

                this.hitCounter -= 1;

                if (this.hitCounter === 0) {
                    this.stats.health = 40;
                    this.sprite.setAnimation(this.animRight); 
                    this.canMove = true;
                } else if (this.hitCounter === 1) {
                    this.stats.health = 30;
                    this.sprite.setAnimation(this.animFirstHit);
                } else if (this.hitCounter === 2) {
                    console.log("Hitcounter 2");
                    this.stats.health = 20;
                    this.stats.attack = 1.0;
                    this.isPushable = false;
                    this.sprite.setAnimation(this.animSecondHit);
                }
            }
        }

        // Solo se mueve si puede moverse
        if (!this.canMove) return;

        // Actualiza temporizador para cambiar dirección
		this.changeDirTimer += deltaTime;
		if (this.changeDirTimer >= this.timeToChange) {
			this.changeDirTimer = 0;
			this.timeToChange = 1000 + Math.random() * 2000;
            let direction = this.getRandomDirection();
            this.setDirection(direction.x, direction.y);
		}
        
        // Normalize direction to prevent diagonal speed boost
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;

        if (this.moving) {
            this.orbTimer = 0;

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
                if (element.boundingBox && element.isActive && element.isActive()) {
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
                if (element.boundingBox && element.isActive && element.isActive()) {
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

    takeDamage(damageAmount) {
        super.takeDamage(damageAmount);
        
        console.log("OrbMonster obteniendo daño");
        
        if(this.stats.health <= 0) return;

        
        const hp = this.stats.health;

        if (hp <= 0) {
            this.die();
            return;
        }

        if (this.stats.health <= 10 && this.hitCounter < 3) {
            console.log("Fase 3");
            this.hitCounter = 3;
            this.sprite.setAnimation(this.animThirdHit);
            this.canMove = false;
            this.isPushable = true; 
            this.orbTimer = 0;
            this.stats.attack = 0.0;

        }
        // Fase 2 (20 HP)
        else if (this.stats.health <= 20 && this.hitCounter < 2) {
            console.log("Fase 2");
            this.hitCounter = 2;
            this.sprite.setAnimation(this.animSecondHit);
            this.canMove = false;
            this.orbTimer = 0;
        }
        // Fase 1 (30 HP)
        else if (this.stats.health <= 30 && this.hitCounter < 1) {
            console.log("Fase 1");
            this.hitCounter = 1;
            this.sprite.setAnimation(this.animFirstHit);
            this.canMove = false;
            this.orbTimer = 0;
        }

        
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

    isOrb(){
        return this.hitCounter === 3;
    }

}




