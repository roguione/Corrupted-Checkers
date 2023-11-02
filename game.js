console.log("javascript is up");

document.addEventListener("DOMContentLoaded", (event) => {
  // 1. Constants
  const gridContainer = document.querySelector("#grid-container");
  const startButton = document.querySelector("#start-button");
  const messageDisplay = document.querySelector("#message");
  const scoreBoxPlayer1 = document.querySelector("#player-one-score");
  const scoreBoxComputer = document.querySelector("#player-two-score");

  // 2. Variables
  let grid = [];
  let selectedChecker = null;
  let playerTurn = 1;
  let scores = { 1: 0, 2: 0 };
  let gameStarted = false;

  // 3. Board Functions

  // Initializes the 8x8 game grid with players' pieces and empty spots
  function initializeBoard() {
    console.log("Initializing board");
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

  // Renders the game board visually on the page
  function createBoard() {
    console.log("Creating board");
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

  // Generates a cell (square) for the board with its attributes and event listener
  function createCell(row, col) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-x", col);
    cell.setAttribute("data-y", row);

    // Style playable squares
    if ((row + col) % 2 === 1) {
      cell.classList.add("light-green");
    }

    // Event listener for cell clicks
    cell.addEventListener("click", cellClick);

    return cell;
  }

  // Creates a checker piece with its attributes and event listener
  function createChecker(row, col, player) {
    const checker = document.createElement("div");
    checker.classList.add("checker", `player${player}`);
    checker.setAttribute("data-player", player);

    // Event listener for checker clicks
    checker.addEventListener("click", checkerClick);

    return checker;
  }

  // Handles the logic when a checker piece is clicked
  function checkerClick(e) {
    console.log("Checker clicked");
    if (!gameStarted) return;

    // Prevent event from propagating upwards
    e.stopPropagation();

    // Deselect any previously selected checker
    if (selectedChecker) {
      selectedChecker.classList.remove("selected");
    }

    // Mark this checker as the selected one
    selectedChecker = e.target;
    selectedChecker.classList.add("selected");
  }

  // Handles the logic when a cell on the board is clicked
  function cellClick(e) {
    console.log("Cell clicked");
    if (!gameStarted || !selectedChecker) return;

    const [fromRow, fromCol] = getCheckerPosition(selectedChecker);
    const [toRow, toCol] = getCellPosition(e.currentTarget);

    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      moveChecker(fromRow, fromCol, toRow, toCol);
      if (playerTurn === 1 && toRow === 0) {
        declareWinner(playerTurn, true);
        return;
      }
      if (playerTurn === 2 && toRow === 7) {
        declareWinner(playerTurn, true);
        return;
      }
      switchPlayer();
      if (playerTurn === 2) {
        computerPlay();
      }
    }
  }

  // Basic AI: The computer randomly selects a valid move
  function computerPlay() {
    console.log("OG`s Turn");
    let validMoves = [];

    // Identify all valid moves for OG
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j] === 2) {
          const moves = getValidMoves(i, j);
          validMoves = validMoves.concat(moves);
        }
      }
    }

    // Make a random move if there are valid ones available
    if (validMoves.length > 0) {
      const randomMove =
        validMoves[Math.floor(Math.random() * validMoves.length)];
      moveChecker(randomMove[0], randomMove[1], randomMove[2], randomMove[3]);

      // If the move results in a win for OG, declare it
      if (randomMove[2] === 0 || randomMove[2] === 7) {
        declareWinner(playerTurn);
        return;
      }

      // Switch turns
      switchPlayer();
      updateBoard();
    }
  }

  // Identify valid moves a checker can make from its current position
  function getValidMoves(row, col) {
    const direction = playerTurn === 1 ? -1 : 1;
    let validMoves = [];

    // Identify potential jump moves
    if (isValidMove(row, col, row + 2 * direction, col + 2)) {
      validMoves.push([row, col, row + 2 * direction, col + 2]);
    }
    if (isValidMove(row, col, row + 2 * direction, col - 2)) {
      validMoves.push([row, col, row + 2 * direction, col - 2]);
    }

    // Add simple moves for the computer
    if (playerTurn === 2) {
      if (isValidMove(row, col, row + direction, col + 1)) {
        validMoves.push([row, col, row + direction, col + 1]);
      }
      if (isValidMove(row, col, row + direction, col - 1)) {
        validMoves.push([row, col, row + direction, col - 1]);
      }
    }

    return validMoves;
  }

  /**
   * Checks whether a move from one position to another is valid.
   * @param {number} fromRow - Starting row of the checker
   * @param {number} fromCol - Starting column of the checker
   * @param {number} toRow - Target row for the checker
   * @param {number} toCol - Target column for the checker
   * @returns {boolean} - True if the move is valid, false otherwise
   */
  function isValidMove(fromRow, fromCol, toRow, toCol) {
    console.log(
      `Checking validity of move from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`
    );

    // Determine the direction based on the player's turn
    const direction = playerTurn === 1 ? -1 : 1;
    // Get the opposing player number
    const oppositePlayer = playerTurn === 1 ? 2 : 1;

    // Ensure that the movement is diagonal
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
      return false;
    }

    // Check for a valid simple move (one step)
    if (toRow - fromRow === direction && Math.abs(toCol - fromCol) === 1) {
      return grid[toRow][toCol] === 0;
    }

    // Check for a valid jump move (two steps)
    if (toRow - fromRow === 2 * direction && Math.abs(toCol - fromCol) === 2) {
      // Calculate the position of the checker that would be jumped over
      const midRow = Math.floor((fromRow + toRow) / 2);
      const midCol = Math.floor((fromCol + toCol) / 2);

      // Boundary check to ensure we're not accessing out-of-bounds indices
      if (
        toRow >= 0 &&
        toRow < 8 &&
        toCol >= 0 &&
        toCol < 8 &&
        midRow >= 0 &&
        midRow < 8 &&
        midCol >= 0 &&
        midCol < 8
      ) {
        // Check if the move is over an opposing player and the destination is empty
        return (
          grid[midRow][midCol] === oppositePlayer && grid[toRow][toCol] === 0
        );
      }
    }

    // Default return if none of the valid move conditions are met
    return false;
  }

  // Updates the displayed scores on the page
  function updateScores() {
    scoreBoxPlayer1.textContent = "Wayfarer: " + scores[1];
    scoreBoxComputer.textContent = "OG OOOG AI: " + scores[2];
  }

  // click Moves a checker on the board
  function moveChecker(fromRow, fromCol, toRow, toCol) {
    console.log(`Mv chkr (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
    // Update the logical grid
    grid[toRow][toCol] = grid[fromRow][fromCol];
    grid[fromRow][fromCol] = 0;

    // If it's a jump, remove the checker that was jumped over
    if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
      grid[(fromRow + toRow) / 2][(fromCol + toCol) / 2] = 0;

      // Update the score for player making the jump
      scores[playerTurn]++;
      updateScores(); // Update the score display
    }

    // Clear selection styling
    if (selectedChecker) {
      selectedChecker.classList.remove("selected");
    }

    selectedChecker = null;
  }

  // Proclaims a player as the winner
  function declareWinner(player, isKing = false) {
    gridContainer.classList.add(".kinged");

    if (isKing) {
      messageDisplay.textContent = `C-BBG King! Player ${player} wins!`;
    } else if (player === 1) {
      messageDisplay.textContent = `Wayfarer Wins!`;
    } else {
      messageDisplay.textContent = `OG wins!`; // This line is for OG's win
    }
    gameStarted = false;
  }

  // Switches the turn between players
  function switchPlayer() {
    playerTurn = playerTurn === 1 ? 2 : 1;
  }

  // Resets the game state
  function resetGame() {
    gridContainer.classList.remove(".kinged");

    grid = [];
    selectedChecker = null;
    playerTurn = 1;
    scores = { 1: 0, 2: 0 };
    gameStarted = false;
    messageDisplay.textContent = "";
    gridContainer.innerHTML = "";

    // Correct score initialization after game reset
    scoreBoxPlayer1.textContent = "Wayfarer: " + scores[1];
    scoreBoxComputer.textContent = "OG OOOG AI: " + scores[2];

    initializeBoard();
    createBoard();
  }

  // Extracts checker's position from its attributes
  function getCheckerPosition(checker) {
    const parent = checker.parentElement;
    return getCellPosition(parent);
  }

  // Extracts cell's position from its attributes
  function getCellPosition(cell) {
    return [
      parseInt(cell.getAttribute("data-y")),
      parseInt(cell.getAttribute("data-x")),
    ];
  }

  // Updates the visual board after a move
  function updateBoard() {
    gridContainer.innerHTML = "";
    createBoard();
  }

  // 4. Event Listeners
  startButton.addEventListener("click", function () {
    resetGame();
    gameStarted = true;
  });

  // 5. Initial Setup
  initializeBoard();
  createBoard();
});
