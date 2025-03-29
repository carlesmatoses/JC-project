function transform(x, y, ctx) {
    return {
        x: x * ctx.canvas.width,
        y: y * ctx.canvas.height
    };
}

/*
    * Function to get adjacent levels in a grid layout.
    * @param {number} id - The ID of the current level.
    * @returns {object} - An object containing the IDs of the adjacent levels (top, left, bottom, right).
*/
function getAdjacentLevels(id) {
    const gridSize = 3; // 3x3 grid

    // Calculate row and column based on index
    const row = Math.floor(id / gridSize);
    const col = id % gridSize;

    // Find adjacent levels
    const top = row > 0 ? id - gridSize : null;
    const bottom = row < gridSize - 1 ? id + gridSize : null;
    const left = col > 0 ? id - 1 : null;
    const right = col < gridSize - 1 ? id + 1 : null;

    return { top, left, bottom, right };
}