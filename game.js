// Logging to console for debugging purposes
console.log("javascript is up");

// 1. Constants

// Get DOM elements for the game board, start button, message display, and new game button
const gridContainer = document.querySelector('#grid-container');
const startButton = document.querySelector('#start-button');
const messageDisplay = document.querySelector('#message');
const newGameButton = document.querySelector('#new-game-button');

// 2. Variables

// Set up primary game state variables, such as the game grid, 
// the current selected checker piece, current player's turn, players' scores, and game status
let grid = [];
let selectedChecker = null;
let playerTurn = 1;
let scores = { 1: 0, 2: 0 };
let gameStarted = false;

// 3. Board Functions

// Initializes the 8x8 game grid. It assigns player pieces and empty spots
function initializeBoard() {
    for (let i = 0; i < 8; i++) {
        grid[i] = [];
        for (let j = 0; j < 8; j++) {
            // Assign checkers for OG
            if ((i + j) % 2 !== 0 && i < 3) {
                grid[i][j] = 2;
            } 
            // Assign checkers for Player 1
            else if ((i + j) % 2 !== 0 && i > 4) {
                grid[i][j] = 1;
            } 
            // Empty spots
            else {
                grid[i][j] = 0;
            }
        }
    }
}

// Constructs the visual representation of the game board on the page
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = createCell(row, col);
            gridContainer.appendChild(cell);

            // Add checkers to the board
            if (grid[row][col] !== 0) {
                const checker = createChecker(row, col, grid[row][col]);
                cell.appendChild(checker);
            }
        }
    }
}

// Create an individual cell (square) for the game board
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-x', col);
    cell.setAttribute('data-y', row);

    // Apply different styles for the playable squares
    if ((row + col) % 2 === 1) {
        cell.classList.add('light-green');
    }

    // Add event listener to handle cell clicks
    cell.addEventListener('click', cellClick);

    return cell;
}

// Generate a checker piece for a specified player
function createChecker(row, col, player) {
    const checker = document.createElement('div');
    checker.classList.add('checker', `player${player}`);
    checker.setAttribute('data-player', player);

    // Add event listener to handle checker piece clicks
    checker.addEventListener('click', checkerClick);

    return checker;
}

// Logic for when a checker piece is clicked on
function checkerClick(e) {
    // If the game hasn't started yet, don't proceed
    if (!gameStarted) return;

    console.log("Checker clicked");

    // Prevent event bubbling to parent elements
    e.stopPropagation();

    // If there's a previously selected checker, deselect it
    if (selectedChecker) {
        selectedChecker.classList.remove('selected');
    }

    // Set the current checker as the selected checker
    selectedChecker = e.target;
    selectedChecker.classList.add('selected');
}

// Defines the logic for when a cell (square) on the board is clicked
function cellClick(e) {
    if (!gameStarted) return;

    console.log("Cell clicked");

    // Get positions of the selected checker and the clicked cell
    const [fromRow, fromCol] = getCheckerPosition(selectedChecker);
    const [toRow, toCol] = getCellPosition(e.currentTarget);

    // Check if the move is valid.
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        console.log("Valid move made");
        moveChecker(fromRow, fromCol, toRow, toCol);

        // If it's a jump move, increase the score
        if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
            scores[playerTurn]++;
        }

        // Check for game-ending conditions
        if (toRow === 0 || toRow === 7) {
            declareWinner(playerTurn);
            return;
        }

        // Switch to OG

        // If it's OOOG's turn, let the OG make a move
        if (playerTurn === 2) {
            computerPlay();
        }

        // Refresh the board to reflect the current game state
        updateBoard();
    }    
}

// A basic AI function for the computer to randomly select a valid move.....intnet find
function computerPlay() {
    console.log("OG's turn");

    let validMoves = [];

    // Loop through the grid to find valid moves for OOOG
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (grid[i][j] === 2) {
                const moves = getValidMoves(i, j);
                validMoves = validMoves.concat(moves);
            }
        }
    }

    // If there are valid moves available, select OG one at random
    if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        moveChecker(randomMove[0], randomMove[1], randomMove[2], randomMove[3]);

        // Check for game-ending conditions for OG
        if (randomMove[2] === 0 || randomMove[2] === 7) {
            declareWinner(playerTurn);
        }

        // Switch to the other player and update the board
        switchPlayer();
        updateBoard();
    }
}

// Determine the valid moves a checker piece can make from a given position
function getValidMoves(row, col) {
    const direction = playerTurn === 1 ? -1 : 1;
    let validMoves = [];

    // Check for potential jump moves
    if (isValidMove(row, col, row + 2 * direction, col + 2)) {
        validMoves.push([row, col, row + 2 * direction, col + 2]);
    }
    if (isValidMove(row, col, row + 2 * direction, col - 2)) {
        validMoves.push([row, col, row + 2 * direction, col - 2]);
    }

    return validMoves;
}

// Log the determined valid moves for debugging purposes
console.log('validMoves');

// Execute the movement of a checker piece on the game board
function moveChecker(fromRow, fromCol, toRow, toCol) {
    console.log(`Move checker from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);

    // Move the checker in the game grid.
    grid[toRow][toCol] = grid[fromRow][fromCol];
    grid[fromRow][fromCol] = 0;

    // If it's a jump move, remove the jumped-over piece
    if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
        grid[(fromRow + toRow) / 2][(fromCol + toCol) / 2] = 0;
    }

    // Remove selection styling from the moved checker
    if (selectedChecker) {
        selectedChecker.classList.remove('selected');
    }

    selectedChecker = null;
}

// Declare the winner of the game
function declareWinner(player) {
    messageDisplay.textContent = `Player ${player} wins!`;
    gameStarted = false;
}

// Switch the turn to the other player
function switchPlayer() {
    playerTurn = playerTurn === 1 ? 2 : 1;
}

// Reset the game state to its initial configuration,..intnet find that i tweaked to fit my game
function resetGame() {
    grid = [];
    selectedChecker = null;
    playerTurn = 1;
    scores = { 1: 0, 2: 0 };
    gameStarted = false;
    messageDisplay.textContent = '';
    gridContainer.innerHTML = '';

    initializeBoard();
    createBoard();
}

// Refresh the visual representation of the game board
function updateBoard() {
    gridContainer.innerHTML = '';
    createBoard();
}

// 4. Utility Functions

// Check if the move from a starting position to an ending position is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const direction = playerTurn === 1 ? -1 : 1;

    // If the move is outside the game board or onto an occupied square, it's invalid
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7 || grid[toRow][toCol] !== 0) {
        return false;
    }

    // Check for a simple move one square forward
    if (toRow === fromRow + direction && (toCol === fromCol + 1 || toCol === fromCol - 1)) {
        return true;
    }

    // Check for a jump move two squares forward
    if (toRow === fromRow + 2 * direction) {
        if (toCol === fromCol + 2 && grid[fromRow + direction][fromCol + 1] !== 0 && grid[fromRow + direction][fromCol + 1] !== playerTurn) {
            return true;
        }
        if (toCol === fromCol - 2 && grid[fromRow + direction][fromCol - 1] !== 0 && grid[fromRow + direction][fromCol - 1] !== playerTurn) {
            return true;
        }
    }

    return false;
}

// Get the position of a checker piece
function getCheckerPosition(checker) {
    const cell = checker.parentNode;
    return getCellPosition(cell);
}

// Get the position of a cell (square) on the board
function getCellPosition(cell) {
    return [parseInt(cell.getAttribute('data-y')), parseInt(cell.getAttribute('data-x'))];
}

// 5. Event Listeners

// Handle the clicking of the start button to begin the game
startButton.addEventListener('click', () => {
    console.log("Commence");
    gameStarted = true;
    messageDisplay.textContent = 'Player 1\'s turn';
});


// Handle the clicking of the new game button to reset the game state
newGameButton.addEventListener('click', () => {
    console.log("New Duel");
    resetGame();
});

// If you have other game logic, you can continue with that, for example:
newGameButton.addEventListener('click', () => {
    // Reset game logic here
    messageDisplay.textContent = 'New game! Player 1\'s turn';
    // And any other logic to reset the game board
});

// 6. Initialization

// Initialize the game board when the page loads
initializeBoard();
createBoard();
