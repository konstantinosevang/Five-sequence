// js/animations.js

/**
 * Animates the rotation of a sub-board.
 * @param {number} subBoard - Index of the sub-board (0 to 3).
 * @param {string} direction - 'clockwise' or 'counter'.
 */
function animateSubBoardRotation(subBoard, direction) {
    const subBoardCells = getSubBoardCells(subBoard);

    // Add rotation class to highlight the sub-board
    subBoardCells.forEach(cell => {
        cell.classList.add('rotating');
    });

    // Calculate rotation angle
    const rotationAngle = direction === 'clockwise' ? 90 : -90;

    // Apply rotation to each cell
    subBoardCells.forEach(cell => {
        let currentRotation = parseInt(cell.getAttribute('data-rotation')) || 0;
        currentRotation += rotationAngle;
        cell.style.transform = `rotate(${currentRotation}deg)`;
        cell.setAttribute('data-rotation', currentRotation);
    });

    // Remove rotation class after animation
    setTimeout(() => {
        subBoardCells.forEach(cell => {
            cell.classList.remove('rotating');
        });
    }, 700); // Match with CSS transition duration
}

/**
 * Gets the cells of a sub-board.
 * @param {number} subBoard - Index of the sub-board.
 * @returns {Array} - Array of cell elements.
 */
function getSubBoardCells(subBoard) {
    const indices = getSubBoardIndices(subBoard);
    const cells = [];
    indices.forEach(row => {
        row.forEach(([r, c]) => {
            const cell = getCellElement(r, c);
            cells.push(cell);
        });
    });
    return cells;
}
