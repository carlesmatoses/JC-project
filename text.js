// Library to manage text rendering

class Text {
    constructor(content, x, y, color = "white", fontSize = 20, fontFamily = "'Press Start 2P'", ctx) {
        this.content = content;
        this.x = x;
        this.y = y;
        this.color = color;
        this.fontSize = fontSize;  // Base font size
        this.fontFamily = fontFamily; // Font family/type
        this.ctx = ctx;

        if( !ctx.textRendering ) {
            console.warn( `Your browser doesn't support the textRendering property on Canvas
          If you are on Chrome be sure to enable chrome://flags/#enable-experimental-web-platform-features` );
        }

    }

    // Function to scale the font size based on canvas size
    getScaledFontSize() {
        const baseWidth = 160;  // Base canvas width
        const baseHeight = 144; // Base canvas height
        const scaleX = this.ctx.canvas.width / baseWidth;
        const scaleY = this.ctx.canvas.height / baseHeight;

        // Choose the smaller scale factor to maintain aspect ratio
        const scaleFactor = Math.min(scaleX, scaleY);

        return this.fontSize * scaleFactor;  // Scale the font size
    }

    draw(ctx) {
        let pos = transform(this.x, this.y, ctx);

        // Get the scaled font size
        const scaledFontSize = this.getScaledFontSize();
        // Set the font size and family dynamically
        ctx.font = `${scaledFontSize}px ${this.fontFamily}`;
        ctx.fillStyle = this.color;

        // ctx.imageSmoothingEnabled = false;
        // ctx.textRendering = "geometricPrecision";

        // Split the content by line breaks
        let lines = this.content.split("\n");

        // Draw each line with an updated Y position
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], pos.x, pos.y + (i * scaledFontSize));  // Adjust the line height based on font size
        }
    }

    update(newContent) {
        this.content = newContent;
    }
}