class BackgroundElement {
    constructor(x, y, width, height, type, isWalkable, texture = null) {
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Width of the element
        this.height = height; // Height of the element
        this.type = type; // Type of the element (e.g., "ground", "wall", "rock")
        this.isWalkable = isWalkable; // Whether the user can walk on this element
        this.texture = texture; // Optional texture (image) for the element
    }

    draw(context) {
        if (this.texture) {
            // Draw the texture if it exists
            const img = new Image();
            img.src = this.texture;
            img.onload = () => {
                context.drawImage(img, this.x, this.y, this.width, this.height);
            };
        } else {
            // Draw the element based on its type
            if (this.type === "ground") {
                context.fillStyle = "green"; // Example color for ground
            } else if (this.type === "wall") {
                context.fillStyle = "gray"; // Example color for wall
            } else if (this.type === "rock") {
                context.fillStyle = "brown"; // Example color for rock
            }

            // Draw the rectangle representing the element
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    isColliding(playerX, playerY) {
        // Check if the player's position collides with this element
        return (
            playerX >= this.x &&
            playerX <= this.x + this.width &&
            playerY >= this.y &&
            playerY <= this.y + this.height
        );
    }
}



// level_001 elements
let size = 16;
background_rock = "./imgs/varied.png";


const level_001_elements = [
    new BackgroundElement(0, 0, size, size, "ground", true, background_rock),
    new BackgroundElement(size, 0, size, size, "wall", false, background_rock),
    new BackgroundElement(size*2, 0, size, size, "rock", false, background_rock),
];