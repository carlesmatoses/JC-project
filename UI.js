class Menu{
    constructor(gameStateManager, player) {
        this.background = textures.menu;
        this.mode = "outside"; // inside or outside
        this.gameStateManager = gameStateManager;
        this.player = player;
    }

    draw(context) {
        if (this.mode == "outside") {
            // Draw the menu background
            context.drawImage(this.background.img, 1, 179, 160, 144, 0, 0, context.canvas.width, context.canvas.height);
        }
        else if (this.mode == "inside") {
            // Draw the menu of the dungeon
            context.fillStyle = "rgba(0, 0, 0, 0.5)"; // semi-transparent black
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.fillStyle = "white";
            context.font = "30px Arial";
            context.fillText("Game Over", context.canvas.width / 2 - 50, context.canvas.height / 2);
        }

        // Draw the inventory
        this.player.inventory.draw(context);
    }

    update(timedelta){}

    handleInput(event) {
        if (event.isPressed("KeyI")) {
            this.gameStateManager.popState();
        }
        if (event.isPressed("ArrowUp")) {
            this.player.inventory.moveSelection("up");
        }
        if (event.isPressed("ArrowDown")) {
            this.player.inventory.moveSelection("down");
        }
        if (event.isPressed("ArrowLeft")) {
            this.player.inventory.moveSelection("left");
        }
        if (event.isPressed("ArrowRight")) {
            this.player.inventory.moveSelection("right");
        }

        if(event.isPressed('KeyF')) {
            this.player.inventory.equipSelectedItem('left');
        }
    }
}

/**
 * Draws the UI elements such as the life bar and money display.
 * This class is responsible for rendering the visual components
 * of the user interface to provide feedback to the player.
 */
class UI {
    constructor(gameStateManager, player) {
        this.healthBar = new HealthBar();
        this.moneyDisplay = new MoneyDisplay();
        this.texture = textures.menu;
        this.gameStateManager = gameStateManager;
        this.player = player;
    }

    draw(context) {
        // Draw a rectangle
        context.fillStyle = "blue";
        let pixels = transform(1,1, context);
        let tilePixels = transform(TILEWIDTH, TILEHEIGHT, context);

        context.drawImage(this.texture.img, 1, 1, 160, 16, 0, tilePixels.y*8, pixels.x, tilePixels.y);

        this.player.inventory.drawUI(context);

        // this.healthBar.draw(context);
        // this.moneyDisplay.draw(context);
    }

}

class HealthBar {
    constructor() {
        this.health = 100;
        this.maxHealth = 100;
        this.width = UIWIDTH/2;
        this.height =  UIHEIGHT/2;
    }

    draw(context) {
        let size = transform(this.width, this.height, context); 
        let pos = transform(UIWIDTH/2, PLAYSCREENHEIGHT, context);
        // Draw the rectangle
        context.fillStyle = "red";
        context.fillRect(pos.x, pos.y, size.x, size.y);
    }
}

class MoneyDisplay {
    constructor() {
        this.money = 0;
        this.width = 100;
        this.height = 20;
    }

    draw(context) {
        // Draw the rectangle
        context.fillStyle = "green";
        context.fillRect(0, 20, this.width, this.height);
    }
}

