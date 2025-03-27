function transform(x, y, ctx) {
    return {
        x: x * ctx.canvas.width,
        y: y * ctx.canvas.height
    };
}