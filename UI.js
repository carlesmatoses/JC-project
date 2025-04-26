/**
 * Draws the UI elements such as the life bar and money display.
 * This class is responsible for rendering the visual components
 * of the user interface to provide feedback to the player.
 */
class UI {
    constructor() {
        this.healthBar = new HealthBar();
        this.moneyDisplay = new MoneyDisplay();
        this.mode = "normal"; // normal, paused, gameover
        this.backgrund = textures.menu;
    }

    draw(context) {
        if (this.mode == "paused") {
            // Draw the menu background
            context.drawImage(this.backgrund.img, 1, 179, 160, 144, 0, 0, context.canvas.width, context.canvas.height);
        }
        else if (this.mode == "gameover") {
            // Draw the game over screen
            context.fillStyle = "rgba(0, 0, 0, 0.5)"; // semi-transparent black
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.fillStyle = "white";
            context.font = "30px Arial";
            context.fillText("Game Over", context.canvas.width / 2 - 50, context.canvas.height / 2);
        }
        else if (this.mode == "normal") {
        // Draw a rectangle
        context.fillStyle = "blue";
        let pixels = transform(1,1, context);
        let tilePixels = transform(TILEWIDTH, TILEHEIGHT, context);
        // the ones are there to fix the rounding error
        context.fillRect(0, pixels.y-tilePixels.y-1, pixels.x, tilePixels.y+1);

        this.healthBar.draw(context);
        this.moneyDisplay.draw(context);
        }
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
