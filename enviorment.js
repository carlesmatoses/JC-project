class BackgroundElement {
    constructor(x, y, width, height, type, isWalkable, texture = null) {
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Width of the element
        this.height = height; // Height of the element
        this.type = type; // Type of the element (e.g., "ground", "wall", "rock")
        this.isWalkable = isWalkable; // Whether the user can walk on this element
        
        if (texture)
        this.texture = new Texture(texture); // Optional texture (image) for the element
    }

    draw(context) {
        let pos = transform(this.x, this.y, context);
        let size = transform(this.width, this.height, context);

        if (this.texture) {
            // Draw the texture if it exists
            context.drawImage(this.texture.img, pos.x, pos.y, size.x, size.y);

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
            context.fillRect(pos.x, pos.y, size.x, size.y);
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

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
}



// level_001 elements
let size_x = 1/10;
let size_y = 1/9;
background_rock = "imgs/brick.png";

function createBasicTail(x, y) {
    const basicTail = new BackgroundElement(x, y, size_x, size_y, "ground", false, background_rock);
    return basicTail;
}

const level_001_elements = [
    createBasicTail(0,        0),
    createBasicTail(size_x,   0),
    createBasicTail(size_x*2, 0),
    createBasicTail(size_x*3, 0),
    createBasicTail(size_x*4, 0),
    createBasicTail(size_x*5, 0),
    createBasicTail(size_x*6, 0),
    createBasicTail(size_x*7, 0),
    createBasicTail(size_x*8, 0),
    createBasicTail(size_x*9, 0),

    createBasicTail(0,        size_y),
    createBasicTail(size_x,   size_y),
    createBasicTail(size_x*2, size_y),
    createBasicTail(size_x*3, size_y),
    createBasicTail(size_x*4, size_y),
    createBasicTail(size_x*5, size_y),
    createBasicTail(size_x*6, size_y),
    createBasicTail(size_x*7, size_y),
    createBasicTail(size_x*8, size_y),
    createBasicTail(size_x*9, size_y),

    createBasicTail(0,        size_y*2),
    createBasicTail(size_x,   size_y*2),
    createBasicTail(size_x*2, size_y*2),
    createBasicTail(size_x*3, size_y*2),
    createBasicTail(size_x*4, size_y*2),
    createBasicTail(size_x*5, size_y*2),
    createBasicTail(size_x*6, size_y*2),
    createBasicTail(size_x*7, size_y*2),
    createBasicTail(size_x*8, size_y*2),
    createBasicTail(size_x*9, size_y*2),

    createBasicTail(0,        size_y*3),
    createBasicTail(size_x,   size_y*3),
    createBasicTail(size_x*2, size_y*3),
    createBasicTail(size_x*3, size_y*3),
    createBasicTail(size_x*4, size_y*3),
    createBasicTail(size_x*5, size_y*3),
    createBasicTail(size_x*6, size_y*3),
    createBasicTail(size_x*7, size_y*3),
    createBasicTail(size_x*8, size_y*3),
    createBasicTail(size_x*9, size_y*3),

    createBasicTail(0,        size_y*4),
    createBasicTail(size_x,   size_y*4),
    createBasicTail(size_x*2, size_y*4),
    createBasicTail(size_x*3, size_y*4),
    createBasicTail(size_x*4, size_y*4),
    createBasicTail(size_x*5, size_y*4),
    createBasicTail(size_x*6, size_y*4),
    createBasicTail(size_x*7, size_y*4),
    createBasicTail(size_x*8, size_y*4),
    createBasicTail(size_x*9, size_y*4),

    createBasicTail(0,        size_y*5),
    createBasicTail(size_x,   size_y*5),
    createBasicTail(size_x*2, size_y*5),
    createBasicTail(size_x*3, size_y*5),
    createBasicTail(size_x*4, size_y*5),
    createBasicTail(size_x*5, size_y*5),
    createBasicTail(size_x*6, size_y*5),
    createBasicTail(size_x*7, size_y*5),
    createBasicTail(size_x*8, size_y*5),
    createBasicTail(size_x*9, size_y*5),

    createBasicTail(0,        size_y*6),
    createBasicTail(size_x,   size_y*6),
    createBasicTail(size_x*2, size_y*6),
    createBasicTail(size_x*3, size_y*6),
    createBasicTail(size_x*4, size_y*6),
    createBasicTail(size_x*5, size_y*6),
    createBasicTail(size_x*6, size_y*6),
    createBasicTail(size_x*7, size_y*6),
    createBasicTail(size_x*8, size_y*6),
    createBasicTail(size_x*9, size_y*6),

    createBasicTail(0,        size_y*7),
    createBasicTail(size_x,   size_y*7),
    createBasicTail(size_x*2, size_y*7),
    createBasicTail(size_x*3, size_y*7),
    createBasicTail(size_x*4, size_y*7),
    createBasicTail(size_x*5, size_y*7),
    createBasicTail(size_x*6, size_y*7),
    createBasicTail(size_x*7, size_y*7),
    createBasicTail(size_x*8, size_y*7),
    createBasicTail(size_x*9, size_y*7),

    createBasicTail(0,        size_y*8),
    createBasicTail(size_x,   size_y*8),
    createBasicTail(size_x*2, size_y*8),
    createBasicTail(size_x*3, size_y*8),
    createBasicTail(size_x*4, size_y*8),
    createBasicTail(size_x*5, size_y*8),
    createBasicTail(size_x*6, size_y*8),
    createBasicTail(size_x*7, size_y*8),
    createBasicTail(size_x*8, size_y*8),
    createBasicTail(size_x*9, size_y*8),

    createBasicTail(0,        size_y*9),
    createBasicTail(size_x,   size_y*9),
    createBasicTail(size_x*2, size_y*9),
    createBasicTail(size_x*3, size_y*9),
    createBasicTail(size_x*4, size_y*9),
    createBasicTail(size_x*5, size_y*9),
    createBasicTail(size_x*6, size_y*9),
    createBasicTail(size_x*7, size_y*9),
    createBasicTail(size_x*8, size_y*9),
    createBasicTail(size_x*9, size_y*9),
];