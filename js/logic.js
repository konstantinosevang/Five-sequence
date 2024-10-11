// js/logic.js

// DOM Elements
const board = document.getElementById('mainBoard');
const currentTurnDiv = document.getElementById('currentTurn');
const rotateButtonsContainer = document.querySelector('.rotation-controls');
const skipRotationButton = document.getElementById('skipRotationButton');
const undoButton = document.getElementById('undoButton');
const restartGameButton = document.getElementById('restartGameButton');
const restartSetButton = document.getElementById('restartSetButton');
const blackScoreSpan = document.getElementById('blackScore');
const whiteScoreSpan = document.getElementById('whiteScore');
const setWinnerDiv = document.getElementById('setWinner');

// Game State
let gameState = {
    board: createEmptyBoard(),
    currentPlayer: 'black',
    rotationMandatory: false,
    movesMade: 0,
    blackScore: 0,
    whiteScore: 0,
    setWinner: null,
    awaitingRotation: false,
    history: [],
};

// Initialize Game
window.onload = () => {
    const savedState = localStorage.getItem('marbleRotationGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        loadGameState();
    } else {
        initializeGame();
    }
};

// Create an empty game board
function createEmptyBoard() {
    return Array.from({ length: 6 }, () => Array(6).fill(null));
}

// Initialize Game Elements
function initializeGame() {
    createBoard();
    createRotationControls();
    updateStatus();
    saveGameState();
}

// Create the game board in the DOM
function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

// Create rotation controls dynamically
function createRotationControls() {
    rotateButtonsContainer.innerHTML = '';
    const subBoardNames = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'];
    subBoardNames.forEach((name, index) => {
        const control = document.createElement('div');
        control.classList.add('sub-board-control');

        const label = document.createElement('span');
        label.textContent = name;
        control.appendChild(label);

        const clockwiseButton = createRotateButton(index, 'clockwise');
        const counterButton = createRotateButton(index, 'counter');

        control.appendChild(clockwiseButton);
        control.appendChild(counterButton);

        rotateButtonsContainer.appendChild(control);
    });
}

// Create individual rotate button
function createRotateButton(subBoardIndex, direction) {
    const button = document.createElement('button');
    button.classList.add('rotate-button');
    button.dataset.subboard = subBoardIndex;
    button.dataset.direction = direction;
    button.title = `Rotate ${direction === 'clockwise' ? 'Clockwise' : 'Counter-Clockwise'}`;
    button.innerHTML = `<i class="fa-solid fa-rotate-${direction === 'clockwise' ? 'right' : 'left'}"></i>`;
    button.addEventListener('click', handleRotateButtonClick);
    return button;
}

// Load the saved game state
function loadGameState() {
    createBoard();
    createRotationControls();
    renderBoard();
    updateScores();
    updateSetWinner();
    updateStatus();
}

// Save the current game state to localStorage
function saveGameState() {
    localStorage.setItem('marbleRotationGameState', JSON.stringify(gameState));
}

// Handle cell click event
function handleCellClick(event) {
    if (gameState.setWinner || gameState.awaitingRotation) return;

    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);

    if (gameState.board[row][col] !== null) return;

    saveCurrentStateToHistory();

    placeMarble(row, col);
    checkForWinOrDraw(row, col);

    gameState.rotationMandatory = checkRotationMandatory();
    gameState.awaitingRotation = true;

    updateStatus();
    saveGameState();
}

// Place a marble on the board
function placeMarble(row, col) {
    gameState.board[row][col] = gameState.currentPlayer;
    const cell = getCellElement(row, col);
    cell.classList.add(gameState.currentPlayer);
    gameState.movesMade++;
    logMoveToServer(`${getCurrentPlayerName()} placed a marble at (${row + 1}, ${col + 1})`);
}

// Handle rotate button click event
function handleRotateButtonClick(event) {
    if (gameState.setWinner || !gameState.awaitingRotation) return;

    const subBoard = parseInt(event.currentTarget.dataset.subboard);
    const direction = event.currentTarget.dataset.direction;

    saveCurrentStateToHistory();

    rotateSubBoard(subBoard, direction);
    checkForWinAfterRotation();

    gameState.awaitingRotation = false;
    switchPlayer();

    updateStatus();
    saveGameState();
}

// Rotate a sub-board
function rotateSubBoard(subBoard, direction) {
    const subBoardIndices = getSubBoardIndices(subBoard);
    const subGrid = subBoardIndices.map(row => row.map(([r, c]) => gameState.board[r][c]));

    const rotatedGrid = direction === 'clockwise'
        ? rotateMatrixClockwise(subGrid)
        : rotateMatrixCounterClockwise(subGrid);

    subBoardIndices.forEach((row, i) => {
        row.forEach(([r, c], j) => {
            gameState.board[r][c] = rotatedGrid[i][j];
        });
    });

    animateSubBoardRotation(subBoard, direction);
    renderBoard();
    logMoveToServer(`${getCurrentPlayerName()} rotated ${getSubBoardName(subBoard)} sub-board ${direction}`);
}

// Switch to the next player
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black';
}

// Get the current player's display name
function getCurrentPlayerName() {
    return gameState.currentPlayer === 'black' ? 'Player 1 (Black)' : 'Player 2 (White)';
}

// Render the entire board
function renderBoard() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = getCellElement(row, col);
            cell.classList.remove('black', 'white');
            if (gameState.board[row][col]) {
                cell.classList.add(gameState.board[row][col]);
            }
            cell.style.transform = 'rotate(0deg)';
            cell.removeAttribute('data-rotation');
        }
    }
}

// Get cell element by row and column
function getCellElement(row, col) {
    return board.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
}

// Handle skip rotation button click
skipRotationButton.addEventListener('click', () => {
    if (gameState.setWinner || !gameState.awaitingRotation || gameState.rotationMandatory) return;

    saveCurrentStateToHistory();

    gameState.awaitingRotation = false;
    switchPlayer();

    logMoveToServer(`${getCurrentPlayerName()} skipped rotation`);

    updateStatus();
    saveGameState();
});

// Handle undo button click
undoButton.addEventListener('click', () => {
    if (gameState.history.length === 0) return;

    gameState = gameState.history.pop();
    renderBoard();
    updateScores();
    updateSetWinner();
    updateStatus();
    saveGameState();
});

// Handle restart game button click
restartGameButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to restart the current game? This will reset the board but keep the set scores.')) {
        resetBoard();
    }
});

// Handle restart set button click
restartSetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to restart the entire set? This will reset the board and all scores.')) {
        resetSet();
    }
});

// Save the current state to history for undo functionality
function saveCurrentStateToHistory() {
    const stateCopy = JSON.parse(JSON.stringify(gameState));
    stateCopy.history = [...gameState.history];
    gameState.history.push(stateCopy);
}

// Update game status and UI elements
function updateStatus() {
    if (gameState.setWinner) return;

    currentTurnDiv.textContent = gameState.awaitingRotation
        ? `${getCurrentPlayerName()}: Rotation is ${gameState.rotationMandatory ? 'mandatory' : 'optional'}.`
        : `${getCurrentPlayerName()}'s turn.`;

    const rotationButtons = document.querySelectorAll('.rotate-button');
    rotationButtons.forEach(button => {
        button.disabled = !gameState.awaitingRotation;
    });

    skipRotationButton.disabled = !gameState.awaitingRotation || gameState.rotationMandatory;
    undoButton.disabled = gameState.history.length === 0;
}

// Update scores display
function updateScores() {
    blackScoreSpan.textContent = gameState.blackScore;
    whiteScoreSpan.textContent = gameState.whiteScore;
}

// Update set winner display
function updateSetWinner() {
    if (gameState.setWinner) {
        setWinnerDiv.textContent = `${getCurrentPlayerName()} wins the set!`;
        disableGame();
    } else {
        setWinnerDiv.textContent = '';
    }
}

// Disable game interactions
function disableGame() {
    board.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
    document.querySelectorAll('.rotate-button').forEach(button => {
        button.disabled = true;
    });
    skipRotationButton.disabled = true;
    undoButton.disabled = true;
}

// Reset the game board for a new game
function resetBoard() {
    gameState.board = createEmptyBoard();
    gameState.currentPlayer = 'black';
    gameState.rotationMandatory = false;
    gameState.movesMade = 0;
    gameState.awaitingRotation = false;
    gameState.history = [];

    renderBoard();
    updateStatus();
    saveGameState();
}

// Reset the entire set
function resetSet() {
    resetBoard();
    gameState.blackScore = 0;
    gameState.whiteScore = 0;
    gameState.setWinner = null;

    updateScores();
    updateSetWinner();
    enableGame();
    saveGameState();
}

// Enable game interactions
function enableGame() {
    board.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

// Check for win or draw after marble placement
function checkForWinOrDraw(row, col) {
    if (checkWin(row, col)) {
        incrementScore();
        checkSetWinner();
    } else if (gameState.movesMade === 36) {
        alert("It's a draw!");
        resetBoard();
    }
}

// Check for win after rotation
function checkForWinAfterRotation() {
    if (checkWinAfterRotation()) {
        incrementScore();
        checkSetWinner();
    }
}

// Increment score for the current player
function incrementScore() {
    if (gameState.currentPlayer === 'black') {
        gameState.blackScore++;
    } else {
        gameState.whiteScore++;
    }
    updateScores();
}

// Check if a player has won the set
function checkSetWinner() {
    if (gameState.blackScore >= 5) {
        gameState.setWinner = 'black';
        updateSetWinner();
        saveGameState();
    } else if (gameState.whiteScore >= 5) {
        gameState.setWinner = 'white';
        updateSetWinner();
        saveGameState();
    } else {
        alert(`${getCurrentPlayerName()} wins this game!`);
        resetBoard();
    }
}

// Check for a win condition after a move
function checkWin(row, col) {
    const player = gameState.currentPlayer;
    return (
        checkDirection(row, col, 1, 0, player) || // Horizontal
        checkDirection(row, col, 0, 1, player) || // Vertical
        checkDirection(row, col, 1, 1, player) || // Diagonal down-right
        checkDirection(row, col, 1, -1, player)   // Diagonal up-right
    );
}

// Check for a win condition after rotation
function checkWinAfterRotation() {
    const player = gameState.currentPlayer;
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (gameState.board[row][col] === player && checkWin(row, col)) {
                return true;
            }
        }
    }
    return false;
}

// Check a specific direction for a win
function checkDirection(row, col, deltaX, deltaY, player) {
    let count = 1;
    count += countMarbles(row, col, deltaX, deltaY, player);
    count += countMarbles(row, col, -deltaX, -deltaY, player);
    return count >= 5;
}

// Count marbles in a specific direction
function countMarbles(row, col, deltaX, deltaY, player) {
    let count = 0;
    let r = row + deltaY;
    let c = col + deltaX;
    while (isValid(r, c) && gameState.board[r][c] === player) {
        count++;
        r += deltaY;
        c += deltaX;
    }
    return count;
}

// Validate row and column indices
function isValid(row, col) {
    return row >= 0 && row < 6 && col >= 0 && col < 6;
}

// Check if rotation is mandatory
function checkRotationMandatory() {
    for (let i = 0; i < 4; i++) {
        if (hasRotationalSymmetry(i)) {
            return false;
        }
    }
    return true;
}

// Check if a sub-board has rotational symmetry
function hasRotationalSymmetry(subBoard) {
    const subBoardIndices = getSubBoardIndices(subBoard);
    const marbles = subBoardIndices.flat().map(([r, c]) => gameState.board[r][c]);

    const matrix = arrayToMatrix(marbles);
    const rotatedClockwise = rotateMatrixClockwise(matrix);
    const rotatedCounterClockwise = rotateMatrixCounterClockwise(matrix);

    return (
        arraysEqual(marbles, matrixToArray(rotatedClockwise)) ||
        arraysEqual(marbles, matrixToArray(rotatedCounterClockwise))
    );
}

// Get indices of a sub-board
function getSubBoardIndices(subBoard) {
    const indices = [];
    const startRow = subBoard < 2 ? 0 : 3;
    const startCol = subBoard % 2 === 0 ? 0 : 3;

    for (let i = 0; i < 3; i++) {
        const rowIndices = [];
        for (let j = 0; j < 3; j++) {
            rowIndices.push([startRow + i, startCol + j]);
        }
        indices.push(rowIndices);
    }
    return indices;
}

// Get the name of the sub-board
function getSubBoardName(subBoard) {
    switch (subBoard) {
        case 0:
            return 'Top-Left';
        case 1:
            return 'Top-Right';
        case 2:
            return 'Bottom-Left';
        case 3:
            return 'Bottom-Right';
        default:
            return 'Unknown';
    }
}

// Log move to the server
function logMoveToServer(description) {
    fetch('/log_move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ move: description })
    })
    .then(response => response.json())
    .then(data => console.log('Move logged:', data))
    .catch(error => console.error('Error logging move:', error));
}
