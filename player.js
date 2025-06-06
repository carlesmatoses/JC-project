class Stats{
    constructor(health, attack, defense, strength, speed) {
        this.health = health;
        this.maxHealth = health;
        this.attack = attack;
        this.defense = defense;
        this.strength = strength;
        this.speed = speed;
        this.fly = 0; 
        
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
            speed: 0,
            fly: 0,
        }
    }

    getHealth() {
        return {
            health:this.health + this.bonuses.health + this.effects.health,
            maxHealth: this.maxHealth + this.bonuses.health + this.effects.health
        };
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
    getIsFlying() {
        return this.effects.fly > 0;
    }
}

class Slot{
    constructor(x, y) {
        this.item = null;
        this.x = x; 
        this.y = y; 
        this.width = 24*4; 
        this.height = 16*4;
        this.selected = false;
    }

    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.item ? "rgba(255, 255, 255, 1)" : "rgb(97, 97, 97)"; // semi-transparent blue
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = this.selected ? "red" : "blue";
        context.stroke(); 

        if (this.item && this.item.icon) {
            context.drawImage(this.item.icon.img, this.x, this.y, this.width, this.height);
        }
        context.closePath();
    }

    drawUI(context, x, y ) {
        let pos = transform(x, y, context);
        let size = transform(TILEWIDTH*1.5, TILEHEIGHT, context);
        if (this.item) {
            context.drawImage(this.item.icon.img, pos.x, pos.y, size.x, size.y);
        } else {
            context.fillStyle = "rgb(255, 255, 140)"; // semi-transparent black
            context.fillRect(pos.x, pos.y, size.x, size.y);
        }

        context.closePath();
    }

    select() {
        this.selected = true;
    }
    setItem(item) {
        this.item = item;
    }
    getItem() {
        return this.item;
    }

}

class Key {
    constructor(id, name, icon=null) {
        this.id = id;
        this.name = name;
        this.icon = icon; 
    }
}

// Inventory.js
class Inventory {
    constructor(player) {
        this.player = player;
        this.stats = player.stats;
        this.money = 0;
        this.keys = new Map(); // key: key.id, value: Key object
        this.items = new Map(); // key: item.name, value: { item, quantity }
        this.resolution = 4;
        
        this.equipped = {
            left: new Slot(8 * this.resolution, 0),
            right: new Slot(24 * this.resolution * 2, 0),
        };

        this.slots = this.createSlots();
        this.selectedRow = 0;
        this.selectedCol = 0;
        this.getSlot(0, 0).select();

        this.healthBar = new HealthBar(); 
        this.moneyDisplay = new MoneyDisplay(0.5,0);

    }

    createSlots() {
        const slots = {};
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 2; col++) {
                const key = `_${row}${col}`;
                const x = (2 * 8 * (col*2) + 8) * this.resolution;
                const y = (row + 1) * 24 * this.resolution;
                slots[key] = new Slot(x, y);
            }
        }
        return slots;
    }

    getSlot(row, col) {
        return this.slots[`_${row}${col}`];
    }

    draw(context) {
        Object.values(this.slots).forEach(slot => slot.draw(context));
        this.equipped.left.draw(context);
        this.equipped.right.draw(context);

        this.healthBar.draw(context, this.player.stats.getHealth().maxHealth, this.player.stats.getHealth().health, UIWIDTH / 10 * 6.5, 0);
        this.moneyDisplay.draw(context, this.money);
    }

    drawUI(context) {
        // Draw the equipped items
        this.equipped.left.drawUI(context,TILEWIDTH*0.5,TILEHEIGHT*8);
        this.equipped.right.drawUI(context,TILEWIDTH*3,TILEHEIGHT*8);
    }

    addItem(item, quantity = 1) {
        if (item instanceof Key) {
            this.addKey(item);
            console.log("Key added to inventory:", item.id);
            return;
        }
        if (this.items.has(item.name)) {
            this.items.get(item.name).quantity += quantity;
        } else {
            this.items.set(item.name, { item, quantity });
        }
    }

    removeItem(item, quantity = 1) {
        const entry = this.items.get(item.name);
        if (!entry) return false;
        entry.quantity -= quantity;
        if (entry.quantity <= 0) this.items.delete(item.name);
        return true;
    }

    assignToEmptySlot(item) {
        for (let slot of Object.values(this.slots)) {
            if (!slot.getItem()) {
                slot.setItem(item);
                return true;
            }
        }
        console.error("No empty slot found for item:", item.name);
        return false;
    }

    getItemQuantity(item) {
        return this.items.get(item.name)?.quantity || 0;
    }

    equipItem(item, hand) {
        if (!(item instanceof Equipment)) {
            console.error("Cannot equip non-equipment item:", item);
            return;
        }

        if (hand !== "left" && hand !== "right") {
            console.error("Invalid hand:", hand);
            return;
        }

        const currentEquipped = this.equipped[hand];
        if (currentEquipped.item) {
            // Move the currently equipped item back into inventory
            this.addItem(currentEquipped.item);
            this.assignToEmptySlot(currentEquipped.item);
            this.stats.removeEffects(currentEquipped.item.effects);
        }

        currentEquipped.setItem(item);
        if (item.effects) this.stats.applyEffects(item.effects);
    }

    equipSelectedItem(hand) {
        const selectedSlot = this.getSlot(this.selectedRow, this.selectedCol);
        const item = selectedSlot.getItem();
        const handSlot = this.equipped[hand];

        if (item) {
            console.log("Equipping item:", item.name);
            // Equip the selected item
            this.equipItem(item, hand);
            selectedSlot.setItem(null); // Remove item from inventory slot
            this.removeItem(item); // Remove item from inventory
        } else if (handSlot.getItem()) {
            // Unequip the current hand item and store it in the inventory
            const handItem = handSlot.getItem();
            this.addItem(handItem); // Add the hand item back to the inventory.
            selectedSlot.setItem(handItem); // Assign the hand item to the selected slot
            handSlot.setItem(null); // Clear the hand slot
            this.stats.removeEffects(handItem.effects); // Remove effects of the unequipped item
        } else {
            console.error("No item selected to equip, and hand is already empty.");
        }
    }

    unequipItem(hand) {
        const slot = this.equipped[hand];
        if (slot && slot.getItem()) {
            const item = slot.getItem();
            this.addItem(item);
            this.assignToEmptySlot(item);
            slot.setItem(null);
            if (item.effects) this.stats.removeEffects(item.effects);
        }
    }

    moveSelection(dir) {
        switch (dir) {
            case "up": this.selectedRow = Math.max(0, this.selectedRow - 1); break;
            case "down": this.selectedRow = Math.min(4, this.selectedRow + 1); break;
            case "left": this.selectedCol = Math.max(0, this.selectedCol - 1); break;
            case "right": this.selectedCol = Math.min(1, this.selectedCol + 1); break;
        }
        this.updateSelectedSlot();
    }

    updateSelectedSlot() {
        Object.values(this.slots).forEach(slot => slot.selected = false);
        const selected = this.getSlot(this.selectedRow, this.selectedCol);
        if (selected) selected.select();
    }

    addKey(key) {
        if (this.keys.has(key.id)) {
            console.error("Key already exists:", key.id);
            return;
        }
        this.keys.set(key.id, key);
    }

    hasKey(keyId) {
        return this.keys.has(keyId);
    }

    removeKey(key) {
        if (!this.keys.has(key.id)) {
            console.error("Key not found:", key.id);
            return;
        }
        this.keys.delete(key.id);
    }
}


class Player {
    constructor(x, y, width, height, texture = 'imgs/link/link_spritePropio3.png') {
        this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.direction = { x: 0, y: 0 };
		this.lastDirection = { x: 0, y: 1 }; // mirando hacia abajo por defecto
		this.moving = false;
        this.scene = null; // store a reference to the scene
        this.center = { x: x+width / 2, y: y+height / 2 }; // local center 
        this.boundingBox = new BoundingBox(this.center.x, this.center.y, width*0.9, height*0.9); // 90% of the size
        this.handBoundingBox = new BoundingBox(this.center.x, this.center.y, (width)/4, (height)/4);

        this.levelID = 103;
        this.mapID = 'overworld'; 

        // inventory
        this.stats = new Stats(3, 0, 5, 5, 0.0004); // health, attack, defense, strength, speed
        this.inventory = new Inventory(this);
        // this.inventory.addItem(Shield);
        // this.inventory.assignToEmptySlot(Shield); 
        this.inventory.addItem(Sword);
        this.inventory.equipItem(Sword, "right");
        // this.inventory.addItem(BraceletStrength);
        // this.inventory.assignToEmptySlot(BraceletStrength);
        // this.inventory.addItem(Feather);
        // this.inventory.assignToEmptySlot(Feather);


        //Audio
        this.swordSwingAudio = AudioFX('audio/00005-LINK_PV002_SWORD_360_R2.wav');
        this.fullHealSound = AudioFX('audio/Pokemon Healing - Sound Effect (HD).wav' , {
            volume: 0.6
        }); //FIXME: Encontrar sonido correcto.

        // Pushing mechanics
        this.lastBlockedDirection = null;
        this.pushAttemptTimer = 0;
        this.pushThreshold = 1*1000; // ms

        //attack 
        this.isAttacking = false;
        this.attackDuration = 300; // milisegundos
        this.attackTimer = 0;

        //defend
        this.isDefending = false;
        this.defendingTimer = 0;

        //Timers de daño y muerte
        this.isFlashing = false;
        this.flashTimer = 0;
        this.flashDuration = 300; // ms
        this.flashInterval = 100; // ms

        //this.isFading = false;
        //this.fadeAlpha = 1;
        //this.fadeSpeed = 0.005; // por ms

        // Inmunity
        this.isImmune = false; // Immunity flag
        this.immunityTimer = 0; // Timer to track immunity duration
        this.immunityDuration = 1000; // 1 second of immunity (in milliseconds)

		// Sprite y animaciones Player
		this.texture = new Texture(texture);
		this.sprite = new Sprite(x, y, width, height, 10, this.texture);

        //Sino hacer spritesheet independiente
        this.swordTexture = new Texture(texture);
        this.swordSprite = new Sprite(x, y, width, height, 10, this.swordTexture);

        this.anim_facing = "down"; 

		// Creamos animaciones (puedes añadir más si tienes otras direcciones o acciones)
        this.ANIM_DOWN = this.sprite.addAnimation(); // 0
		this.sprite.addKeyframe(this.ANIM_DOWN, [0, 0, 15, 16]);
		this.sprite.addKeyframe(this.ANIM_DOWN, [16, 0, 15, 16]);

		this.ANIM_UP = this.sprite.addAnimation(); // 1
		this.sprite.addKeyframe(this.ANIM_UP, [32, 0, 15, 16]); // mismo frame que antes
		this.sprite.addKeyframe(this.ANIM_UP, [48, 0, 15, 16]); 

		this.ANIM_LEFT = this.sprite.addAnimation(); // 2
		this.sprite.addKeyframe(this.ANIM_LEFT, [64, 0, 15, 16]);
		this.sprite.addKeyframe(this.ANIM_LEFT, [80, 0, 15, 16]);

		this.ANIM_RIGHT = this.sprite.addAnimation(); // 3 (igual que left pero reflejado)
		this.sprite.addKeyframe(this.ANIM_RIGHT, [96, 0, 15, 16]);
		this.sprite.addKeyframe(this.ANIM_RIGHT, [112, 0, 15, 16]);


        //Animaciones Ataque Player
        this.ANIM_ATTACK_DOWN = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_ATTACK_DOWN,[0, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_DOWN,[16, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_DOWN,[32, 32, 15, 16]);
        
        this.ANIM_ATTACK_UP = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_ATTACK_UP, [48, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_UP, [64, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_UP, [80, 32, 15, 16]);
        
        this.ANIM_ATTACK_LEFT = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_ATTACK_LEFT, [96, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_LEFT, [112, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_LEFT, [128, 32, 15, 16]);

        this.ANIM_ATTACK_RIGHT = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_ATTACK_RIGHT, [176, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_RIGHT, [144, 32, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_ATTACK_RIGHT, [160, 32, 15, 16]);

        //Animaciones Defensa Player
        this.ANIM_DEFEND_DOWN = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_DEFEND_DOWN,[32, 64, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_DEFEND_DOWN,[48, 64, 15, 16]);

        this.ANIM_DEFEND_UP = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_DEFEND_UP,[64, 64, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_DEFEND_UP,[80, 64, 15, 16]);

        this.ANIM_DEFEND_LEFT = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_DEFEND_LEFT,[96, 64, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_DEFEND_LEFT,[112, 64, 15, 16]);

        this.ANIM_DEFEND_RIGHT = this.sprite.addAnimation();
        this.sprite.addKeyframe(this.ANIM_DEFEND_RIGHT,[128, 64, 15, 16]);
        this.sprite.addKeyframe(this.ANIM_DEFEND_RIGHT,[144, 64, 15, 16]);

        
        //Animaciones Sword
        // Simple
        this.SWORD_DOWN = this.swordSprite.addAnimation();
        this.swordSprite.addKeyframe(this.SWORD_DOWN,[0, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_DOWN,[16, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_DOWN, [32, 112, 16, 16]);

        this.SWORD_UP = this.swordSprite.addAnimation();
        this.swordSprite.addKeyframe(this.SWORD_UP, [48, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_UP, [64, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_UP, [80, 112, 16, 16]);

        this.SWORD_LEFT = this.swordSprite.addAnimation();
        this.swordSprite.addKeyframe(this.SWORD_LEFT, [96, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_LEFT, [112, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_LEFT, [128, 112, 16, 16]);

        this.SWORD_RIGHT = this.swordSprite.addAnimation();
        this.swordSprite.addKeyframe(this.SWORD_RIGHT, [176, 112, 16, 16]);       
        this.swordSprite.addKeyframe(this.SWORD_RIGHT, [160, 112, 16, 16]);
        this.swordSprite.addKeyframe(this.SWORD_RIGHT, [144, 112, 16, 16]);

        this.swordAttackOffsets = {
            down:   [ {x: -1, y: -1}, {x: -0.5, y: 0}, {x: 0, y: 0} ],
            up:     [ {x: 1, y: 1}, {x: 0.5, y: 0}, {x: 0, y: 0} ],
            left:   [ {x: 1, y: -1}, {x: 0, y: -0.5}, {x: 0, y: 0} ],
            right:  [ {x: -1, y: -1}, {x: 0, y: -0.5}, {x: 0, y: 0} ]
        };  
        this.sword_direction= "down"; 

    }

    draw(context) {
        // Lets control animations in the draw method, otherwise the code is unreadable and causes issues
        
        // WALKING STATE
        // Prioritize horizontal movement over vertical to prevent animation flickering
        if (!this.isAttacking && !this.isDefending) {
            if (this.lastDirection.x !== 0) {
                if (this.lastDirection.x === -1 && this.sprite.currentAnimation !== this.ANIM_LEFT) {
                    this.sprite.setAnimation(this.ANIM_LEFT);
                } else if (this.lastDirection.x === 1 && this.sprite.currentAnimation !== this.ANIM_RIGHT) {
                    this.sprite.setAnimation(this.ANIM_RIGHT);
                }
            } else if (this.lastDirection.y !== 0) {
                if (this.lastDirection.y === -1 && this.sprite.currentAnimation !== this.ANIM_UP) {
                    this.sprite.setAnimation(this.ANIM_UP);
                } else if (this.lastDirection.y === 1 && this.sprite.currentAnimation !== this.ANIM_DOWN) {
                    this.sprite.setAnimation(this.ANIM_DOWN);
                }
            }
        }

        // DEFENDING STATE
        if (this.isDefending) {
            if (this.lastDirection.x !== 0) {
                if (this.lastDirection.x === -1 && this.sprite.currentAnimation !== this.ANIM_DEFEND_LEFT) {
                    this.sprite.setAnimation(this.ANIM_DEFEND_LEFT);
                } else if (this.lastDirection.x === 1 && this.sprite.currentAnimation !== this.ANIM_DEFEND_RIGHT) {
                    this.sprite.setAnimation(this.ANIM_DEFEND_RIGHT);
                }
            } else if (this.lastDirection.y !== 0) {
                if (this.lastDirection.y === -1 && this.sprite.currentAnimation !== this.ANIM_DEFEND_UP) {
                    this.sprite.setAnimation(this.ANIM_DEFEND_UP);
                } else if (this.lastDirection.y === 1 && this.sprite.currentAnimation !== this.ANIM_DEFEND_DOWN) {
                    this.sprite.setAnimation(this.ANIM_DEFEND_DOWN);
                }
            }
        }

        // ATTACKING STATE
        if (this.isAttacking && !this._attackDrawn) {
                if (this.lastDirection.x === -1) this.sprite.setAnimation(this.ANIM_ATTACK_LEFT);
                else if (this.lastDirection.x === 1) this.sprite.setAnimation(this.ANIM_ATTACK_RIGHT);
                else if (this.lastDirection.y === -1) this.sprite.setAnimation(this.ANIM_ATTACK_UP);
                else if (this.lastDirection.y === 1) this.sprite.setAnimation(this.ANIM_ATTACK_DOWN);
                if (this.lastDirection.x === -1 && this.swordSprite.currentAnimation !== this.SWORD_LEFT) {
                    this.swordSprite.setAnimation(this.SWORD_LEFT);
                    this.sword_direction = "left";
                } else if (this.lastDirection.x === 1 && this.swordSprite.currentAnimation !== this.SWORD_RIGHT) {
                    this.swordSprite.setAnimation(this.SWORD_RIGHT);
                    this.sword_direction = "right";
                }
                if (this.lastDirection.y === -1 && this.swordSprite.currentAnimation !== this.SWORD_UP) {
                    this.swordSprite.setAnimation(this.SWORD_UP);
                    this.sword_direction = "up";
                } else if (this.lastDirection.y === 1 && this.swordSprite.currentAnimation !== this.SWORD_DOWN) {
                    this.swordSprite.setAnimation(this.SWORD_DOWN);
                    this.sword_direction = "down";
                }
            this.swordSprite.currentKeyframe = 0;
            this.swordSprite.timeInKeyframe= 0;
            this.swordSprite.elapsedTime = 0;
            this.sprite.currentKeyframe = 0;
            this.sprite.timeInKeyframe= 0;
            this.sprite.elapsedTime = 0;
            this._attackDrawn = true;
        }
        if (this.isAttacking){
            // Use this.sword_direction to decide the dir
            let swordDir = this.sword_direction;

            // Prevent diagonal sword direction: only allow one axis at a time
            // (sword_direction should already be set to "left", "right", "up", or "down")

            let dir = { x: 0, y: 0 };
            if (swordDir === "left") dir.x = -1;
            else if (swordDir === "right") dir.x = 1;
            else if (swordDir === "up") dir.y = -1;
            else dir.y = 1;

            let swordCenter = {
            x: this.center.x + (dir.x * (this.boundingBox.width)) - this.swordSprite.width / 2,
            y: this.center.y + (dir.y * (this.boundingBox.height)) - this.swordSprite.height / 2,
            };

            let frameIdx = this.swordSprite.currentKeyframe;
            let offset = this.swordAttackOffsets[swordDir][frameIdx];

            this.swordSprite.x = swordCenter.x + offset.x * TILEWIDTH;
            this.swordSprite.y = swordCenter.y + offset.y * TILEHEIGHT;

            if (frameIdx !== 2)   {
                this.swordSprite.update(deltaTime);
            }

            this.sprite.update(deltaTime);
        }

        if (!this.isAttacking) {
            this._attackDrawn = false;
            this.swordSprite.currentKeyframe = 0;
            this.swordSprite.timeInKeyframe= 0;
            this.swordSprite.elapsedTime = 0;
        }

        // decide what to draw
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.draw();
        if(this.isAttacking) this.swordSprite.draw();
        
        if (DEBUG){
            this.boundingBox.draw(context);
            this.handBoundingBox.draw(context);
            
            // Draw a circle in the center of the player for debugging
            let centerPixels = transform(this.center.x, this.center.y, context);
            context.beginPath();
            context.arc(centerPixels.x, centerPixels.y, 8, 0, 2 * Math.PI);
            context.fillStyle = "red";
            context.fill();

            // Draw a blue dot if player is immune
            if (this.isImmune) {
                context.beginPath();
                context.arc(centerPixels.x, centerPixels.y, 4, 0, 2 * Math.PI);
                context.fillStyle = "blue";
                context.fill();
            }
        }
    }

    update(deltaTime) {
        // Handle immunity timer
        if (this.isImmune) {
            this.immunityTimer += deltaTime;
            if (this.immunityTimer >= this.immunityDuration) {
                this.isImmune = false; // End immunity
                this.immunityTimer = 0; // Reset timer
            }
        }
        let magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2);
        this.moving = magnitude > 0;

        if (this.isAttacking) {
            this.attackTimer += deltaTime;
            this.swordSwingAudio.play();
        
            if (this.attackTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.attackTimer = 0;
                this.checkAttackCollision();
            }
        
            return; // no mover durante ataque
        }
        
        // Scripted movement handling
        if (this._scriptedMove) {
            let move = this._scriptedMove;
            move.elapsed += deltaTime;
            let totalTime = Math.min(move.elapsed, move.duration);
            let progress = totalTime / move.duration;
            let targetMove = move.distance * progress;
            let deltaMove = targetMove - move.moved;

            // Move the player
            this.translatePosition(
                move.direction.x * deltaMove,
                move.direction.y * deltaMove
            );
            move.moved += deltaMove;

            // End scripted movement
            if (move.elapsed >= move.duration) {
                this._scriptedMove = null;
                this.setDirection(0, 0);
                this.moving = false;
                if (move.onComplete) move.onComplete();
            }
            // Return early to prevent normal movement during scripted move
            return;
        }
    
        if (this.moving) {
            // Normalizar dirección
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

            // Move Y
            this.translatePosition(0, offsetY);
            for (let element of this.scene.levelContent) {
                if (element.boundingBox && element.isActive  && element.isActive()) {
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

            // Retrieve hand collided element
            for (let element of this.scene.levelContent) {
                if (element.boundingBox && this.handBoundingBox.isColliding(element.boundingBox) && element.type !== "door") {
                    collidedElement = element;
                    break;
                }
            }
           
            // Check if player is trying to push an object
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
                            return "strength";
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

            this.lastDirection = { ...this.direction };
        } else {
            // Quieto: mantener dirección anterior pero detener la animación en el primer frame
            this.direction = { x: 0, y: 0 };
        }

        // set the rendering frame
        if (this.moving && !this.isAttacking) {
            this.sprite.update(deltaTime);
        } else{
            this.sprite.currentKeyframe = 0;
        }


    }    

    checkAttackCollision() {

        const attackBox = new BoundingBox(
            this.swordSprite.x + this.swordSprite.width / 2,
            this.swordSprite.y + this.swordSprite.height / 2,
            this.swordSprite.width,
            this.swordSprite.height
        );

        for (let element of this.scene.levelContent) {
            if (element.boundingBox && attackBox.isColliding(element.boundingBox)) {
                if (element.takeDamage) {
                    console.log(this.stats.getTotalStats().attack);
                    element.takeDamage(this.stats.getTotalStats().attack);
                }
                if (element.onAttackCollision) {
                    element.onAttackCollision(this); // Call the onAttackCollision method of the element
                }
                if(DEBUG){
                    console.log("Colisión de ataque con:", element);
                }
            }

        }
    }

    fullHeal(){
        console.log("Restaurando toda a vida!")
        this.fullHealSound.play();
        this.stats.health = this.stats.maxHealth;
    }

    handleInput(keyboard) {
        // Leer teclas
        let direction = { x: 0, y: 0 };
        if (keyboard.isHeld('ArrowLeft') || keyboard.isHeld('KeyA')) direction.x = -1;
        if (keyboard.isHeld('ArrowRight') || keyboard.isHeld('KeyD')) direction.x = 1;
        if (keyboard.isHeld('ArrowUp') || keyboard.isHeld('KeyW')) direction.y = -1;
        if (keyboard.isHeld('ArrowDown') || keyboard.isHeld('KeyS')) direction.y = 1;
        this.setDirection(direction.x, direction.y);

        if (!keyboard.isHeld('ArrowLeft') && 
            !keyboard.isHeld('ArrowRight') && 
            !keyboard.isHeld('ArrowUp') && 
            !keyboard.isHeld('ArrowDown') &&
            !keyboard.isHeld('KeyA') && 
            !keyboard.isHeld('KeyD') && 
            !keyboard.isHeld('KeyW') && 
            !keyboard.isHeld('KeyS')) {
            this.setDirection(0, 0);
        }

        // if "f" pressed, check for interaction with level elements
        if (keyboard.isPressed('KeyF')) {
            for (let element of this.scene.levelContent) {
                if (element.boundingBox && this.handBoundingBox.isColliding(element.boundingBox)) {
                    if (element.interact) {
                        element.interact(this); // Call the interact method of the element
                    }
                    break; // Stop after the first interaction
                }
            }
        }
        
        //New: Attack press button
        if (keyboard.isPressed('KeyZ') && !this.isAttacking && !this.isDefending) {
            this.isAttacking = true;
            this.attackTimer = 0;
        }
        
        // Detect KeyX pressed and released for defending state
        if (keyboard.isPressed('KeyX')) {
            if (
                (this.inventory.equipped.left.getItem() && this.inventory.equipped.left.getItem().name === "Shield") ||
                (this.inventory.equipped.right.getItem() && this.inventory.equipped.right.getItem().name === "Shield")
            ) {
            this.isDefending = true;
            }
        }
        
        if (keyboard.isReleased && keyboard.isReleased('KeyX')) {
            this.isDefending = false;
        }

        if (keyboard.isPressed(REMOVE_HITBOX)) {
            // we will remove the bounding box or add it back
            if (this.boundingBox.width > 0 && this.boundingBox.height > 0) {
                this.removeBundingBox();
            } else {
                this.boundingBox.width = this.width * 0.9; // 90% of the size
                this.boundingBox.height = this.height * 0.9;
                this.boundingBox.setPosition(this.center.x, this.center.y);
            }
        }       
        //Health
        if (keyboard.isPressed(KEY_HEAL)){
            console.log("Intentando curar al player")
            this.fullHeal();
        }

        //Obtain Special Objects
        if (keyboard.isPressed(KEY_OBTAIN_SP_OBJECT)){
            if(this.inventory.getItemQuantity(BraceletStrength) == 0){
                this.inventory.addItem(BraceletStrength);
                this.inventory.assignToEmptySlot(BraceletStrength);
            }
            if(this.inventory.getItemQuantity(Feather) == 0){
                this.inventory.addItem(Feather);
                this.inventory.assignToEmptySlot(Feather);
            }
            
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
        if (!this.isAttacking){
            if (dx !== 0 || dy !== 0) {
                this.lastDirection.x = dx;
                this.lastDirection.y = dy;
            }
        }
    }

    translatePosition(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.center.x = this.x + this.width / 2;
        this.center.y = this.y + this.height / 2;

        this.boundingBox.translate(dx, dy);
        this.handBoundingBox.setPosition(
            this.center.x + (this.lastDirection.x * (this.boundingBox.width / 2 + this.width / 8)), 
            this.center.y + (this.lastDirection.y * (this.boundingBox.height / 2 + this.height / 8)),
        );
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

    takeDamage(damage, attackerPosition = null) {
        if (typeof CREATIVE_MODE !== "undefined" && CREATIVE_MODE) {
            console.log("Player is in CREATIVE_MODE, no damage taken!");
            return;
        }
        if (this.isImmune) {
            return; // Ignore damage if immune
        }

        // Defending logic
        if (this.isDefending && attackerPosition) {
            // Vector from player to attacker
            const dx = attackerPosition.x - this.center.x;
            const dy = attackerPosition.y - this.center.y;
            // Normalize
            const mag = Math.sqrt(dx * dx + dy * dy);
            if (mag > 0) {
            const attackDir = { x: dx / mag, y: dy / mag };
            const facing = { x: this.lastDirection.x, y: this.lastDirection.y };
            // Normalize facing
            const facingMag = Math.sqrt(facing.x * facing.x + facing.y * facing.y);
            if (facingMag > 0) {
                facing.x /= facingMag;
                facing.y /= facingMag;
            }
            // Dot product: > 0 means attacker is in front of player (within 180 degrees)
            const dot = attackDir.x * facing.x + attackDir.y * facing.y;
            if (dot > 0) {
                console.log("Attack blocked by shield!");
                return;
            }
            }
        }

        //this.isFlashing = true;
        this.flashTimer = 0;

        this.stats.health -= damage;
        // Prevent health from going below 0
        if (this.stats.health < 0) this.stats.health = 0;
        // Prevent health from going above maxHealth
        const maxHealth = this.stats.getHealth().maxHealth;
        if (this.stats.health > maxHealth) this.stats.health = maxHealth;

        if (this.stats.health <= 0) {
            this.playerDied();
        }


        // Activate immunity after taking damage
        this.isImmune = true;
        this.immunityTimer = 0; // Reset immunity timer
    }

    addMoney(amount) {
        this.inventory.money += amount;
    }

    playerDied() {
        // set menu view 

        this.scene.gameStateManager.pushState(new DeathMenuState(this.scene.gameStateManager));
        
        // get current level and map
        const level = world.maps[this.mapID].getLevel(this.levelID);
        level.firstTimeEntering = undefined; 

        // Reset player position or handle death logic
        // this.setPosition(TILEWIDTH, TILEHEIGHT*4); 
        // this.stats.health = this.stats.getHealth().maxHealth; 
    }
    playerRespawn() {
        // Reset player position or handle respawn logic
        this.levelID = 103;
        this.mapID = 'overworld'; 
        this.setPosition(TILEWIDTH, TILEHEIGHT*4); 
        this.stats.health = this.stats.getHealth().maxHealth; 
    }

    removeBundingBox(){
        this.boundingBox.width = 0;
        this.boundingBox.height = 0;
    }

    scriptedMovement(direction, distance, duration, onComplete) {
        // direction: {x, y}, distance: in pixels, duration: in ms
        this.setDirection(direction.x, direction.y);
        this.moving = true;

        // Set the sprite animation based on the direction
        if (direction.x === -1) this.sprite.setAnimation(this.ANIM_LEFT);
        else if (direction.x === 1) this.sprite.setAnimation(this.ANIM_RIGHT);
        else if (direction.y === -1) this.sprite.setAnimation(this.ANIM_UP);
        else if (direction.y === 1) this.sprite.setAnimation(this.ANIM_DOWN);

        this.sprite.currentKeyframe = 0;
        this.sprite.elapsedTime = 0;
        this.lastDirection = { ...direction };

        // Store scripted movement state
        this._scriptedMove = {
            direction: { ...direction },
            distance,
            duration,
            elapsed: 0,
            moved: 0,
            onComplete: typeof onComplete === "function" ? onComplete : null
        };
    }
}

