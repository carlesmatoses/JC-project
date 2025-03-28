// Library to manage text rendering

class Text {
    constructor(content, x, y, color = "white", font = "20px 'Press Start 2P'") {
        this.content = content;
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;
    }

    draw(ctx) {
        let pos = transform(this.x, this.y, ctx);

        ctx.font = this.font;
        ctx.fillStyle = this.color;

        // Split the content by line breaks
        let lines = this.content.split("\n");

        // Draw each line with an updated Y position
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], pos.x, pos.y + (i * 12)); // 30 is the line height
        }
    }


    update(newContent) {
        this.content = newContent;
    }
}