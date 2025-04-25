function transform(x, y, ctx) {
    return {
        x: Math.floor(x * ctx.canvas.width),
        y: Math.floor(y * ctx.canvas.height)
    };
}

/*
    * Function to get adjacent levels in a grid layout.
    * @param {number} id - The ID of the current level.
    * @param {number} rows - The number of rows in the grid.
    * @param {number} cols - The number of columns in the grid.
    * @returns {object} - An object containing the IDs of the adjacent levels (top, left, bottom, right).
*/
function getAdjacentLevels(id, rows, cols) {
    // Calculate row and column based on index
    const row = Math.floor(id / cols);
    const col = id % cols;

    // Find adjacent levels
    const top = row > 0 ? id - cols : null;
    const bottom = row < rows - 1 ? id + cols : null;
    const left = col > 0 ? id - 1 : null;
    const right = col < cols - 1 ? id + 1 : null;

    return { top, left, bottom, right };
}

/*
    * Function to check the state of a button press.
    * @param {object} event - The keyboard event object.
    * @returns {object} - An object containing the state of the button (down, pressed, released).
*/
function checkButtonState(event) {
    const state = {
        down: event.type === 'keydown',
        pressed: event.repeat === false && event.type === 'keydown',
        released: event.type === 'keyup'
    };
    return state;
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}