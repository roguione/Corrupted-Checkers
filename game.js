console.log("javascript is up");

// 1. Constants

// Retrieve main elements from the DOM.
const gridContainer = document.querySelector('#grid-container');
const startButton = document.querySelector('#start-button');
const messageDisplay = document.querySelector('#message');
const newGameButton = document.querySelector('#new-game-button');

// 2. Variables

// Define primary game state variables.
let grid = [];
let selectedChecker = null;
let playerTurn = 1;
let scores = { 1: 0, 2: 0 };
let gameStarted = false;

// 3. Board Functions

/**
 * Initializes the 8x8 game board matrix.
 */
function initializeBoard() {
    for (let i = 0; i < 8; i++) {
        grid[i] = [];
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0 && i < 3) {
                grid[i][j] = 2; // Assign Player 2's pieces.
            } else if ((i + j) % 2 !== 0 && i > 4) {
                grid[i][j] = 1; // Assign Player 1's pieces.
            } else {
                grid[i][j] = 0; // Designate square as empty.
            }
        }
    }
}

/**
 * Constructs the visual game board using the DOM.
 */
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = createCell(row, col);
            gridContainer.appendChild(cell);

            if (grid[row][col] !== 0) {
                const checker = createChecker(row, col, grid[row][col]);
                cell.appendChild(checker);
            }
        }
    }
}

/**
 * Creates and returns a cell div for the game board.
 */
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-x', col);
    cell.setAttribute('data-y', row);

    if ((row + col) % 2 === 1) {
        cell.classList.add('light-green');  // Checker square styling.
    }

    cell.addEventListener('click', cellClick);

    return cell;
}

/**
 * Generates and returns a checker div for a specific player.
 */
function createChecker(row, col, player) {
    const checker = document.createElement('div');
    checker.classList.add('checker', `player${player}`);
    checker.setAttribute('data-player', player);
    checker.addEventListener('click', checkerClick);

    return checker;
}

/**
 * Defines actions when a checker piece is clicked.
 */
function checkerClick(e) {
    if (!gameStarted) return;

    console.log("Checker clicked");

    e.stopPropagation();

    if (selectedChecker) {
        selectedChecker.classList.remove('selected');
    }

    selectedChecker = e.target;
    selectedChecker.classList.add('selected');
}

/**
 * Outlines actions when an individual cell is clicked.
 */
function cellClick(e) {
    if (!gameStarted) return;

    console.log("Cell clicked");

    const [fromRow, fromCol] = getCheckerPosition(selectedChecker);
    const [toRow, toCol] = getCellPosition(e.currentTarget);

    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        console.log("Valid move made");
        moveChecker(fromRow, fromCol, toRow, toCol);
    
        // Check for a valid jump move and increase score
        if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
            scores[playerTurn]++;
        }
    
        if (toRow === 0 || toRow === 7) {
            declareWinner(playerTurn);
            return;
        }
    
        switchPlayer();
    
        if (playerTurn === 2) {
            computerPlay();
        }
    
        updateBoard();
    }    
}

/**
 * Simple AI to randomly select valid moves for the computer. found online tweaked some to work in my script
 */
function computerPlay() {
    console.log("Computer's turn");

    let validMoves = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (grid[i][j] === 2) {
                const moves = getValidMoves(i, j);
                validMoves = validMoves.concat(moves);
            }
        }
    }

    if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        moveChecker(randomMove[0], randomMove[1], randomMove[2], randomMove[3]);

        if (randomMove[2] === 0 || randomMove[2] === 7) {
            declareWinner(playerTurn);
        }

        switchPlayer();
        updateBoard();
    }
}

/**
 * Lists all valid moves for a given position on board for checker.
 */
function getValidMoves(row, col) {
    const direction = playerTurn === 1 ? -1 : 1;
    let validMoves = [];

    if (isValidMove(row, col, row + 2 * direction, col + 2)) {
        validMoves.push([row, col, row + 2 * direction, col + 2]);
    }
    if (isValidMove(row, col, row + 2 * direction, col - 2)) {
        validMoves.push([row, col, row + 2 * direction, col - 2]);
    }

    return validMoves;
}

console.log('validMoves');
/**
 * Performs the action of moving a checker piece on the board.
 */
function moveChecker(fromRow, fromCol, toRow, toCol) {
    console.log(`Move checker from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);

    grid[toRow][toCol] = grid[fromRow][fromCol];
    grid[fromRow][fromCol] = 0;

    if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        grid[midRow][midCol] = 0;  // Capturing the opponent's checker.
    }
}

/**
 * Changes the active player.
 */
function switchPlayer() {
    console.log(`Player ${playerTurn} finished their turn`);

    playerTurn = playerTurn === 1 ? 2 : 1;
}

/**
 * Determines the validity of a proposed move.
 */
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const direction = playerTurn === 1 ? -1 : 1;
    const isValidSingleMove = (fromRow + direction === toRow) && 
                              (fromCol + 1 === toCol || fromCol - 1 === toCol) && 
                              grid[toRow][toCol] === 0;

    if (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;

        if (grid[midRow][midCol] !== 0 && grid[midRow][midCol] !== playerTurn) {
            return true;  // Valid jump move.
        }
    }

    return isValidSingleMove;
}

/**
 * Returns the position (row, col) of a clicked checker.
 */
function getCheckerPosition(checker) {
    const col = +checker.parentElement.getAttribute('data-x');
    const row = +checker.parentElement.getAttribute('data-y');
    return [row, col];
}

/**
 * Acquires the position (row, col) of a clicked cell.
 */
function getCellPosition(cell) {
    const col = +cell.getAttribute('data-x');
    const row = +cell.getAttribute('data-y');
    return [row, col];
}

/**
 * Updates the visual game board to reflect the current state.
 */
function updateBoard() {
    console.log("Updating the board");

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = '';

        const [row, col] = getCellPosition(cell);

        if (grid[row][col] !== 0) {
            const checker = createChecker(row, col, grid[row][col]);
            cell.appendChild(checker);
        }
    });
}

/**
 * Announces the winner of the game.
 */
function declareWinner(player) {
    console.log(`Player ${player} won`);

    gameStarted = false;
    messageDisplay.textContent = `Player ${player} wins!`;
    scores[player]++;
}

function newGame() {
    console.log("New game started");
    gameStarted = true;
    selectedChecker = null;
    playerTurn = 1;
    scores = { 1: 0, 2: 0 };
    initializeBoard();
    createBoard();
    messageDisplay.textContent = `Player ${playerTurn}'s turn`;
}

// 4. Event listeners

newGameButton.addEventListener('click', newGame);

// Listen to the start button to initiate the game.
startButton.addEventListener('click', () => {
    console.log("Starting the game");

    gameStarted = true;
    initializeBoard();
    createBoard();
    messageDisplay.textContent = `Player ${playerTurn}'s turn`;
});

