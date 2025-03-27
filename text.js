// Library to manage text rendering

class Text {
    constructor(content, x, y, color = "white", font = "20px Arial") {
        this.content = content;
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.content, this.x, this.y);
    }

    update(newContent) {
        this.content = newContent;
    }
}