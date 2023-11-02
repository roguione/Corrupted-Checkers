# Basic Checker Game Structure

## Constants:
    - const gridContainer
    - const scoreBoxPlayer1 
    - const scoreBoxComputer
    
#### DOM Elements:
- `const board = document.getElementById('board')`: The main game board
- `const startButton = document.getElementById('startButton')`: Button to start the game
- `const message = document.getElementById('message')`: Area to display game messages
  
## Variables:
- `let currentPlayer = "P1"`: Represents the current active player
- `let boardArray = []`: Array representing the state of the game board
- `let selectedChecker = null`: Stores the currently selected checker, if any
  
## Board Functions:

#### Initialize Board:
- `function initializeBoard()`: Sets up the initial 8x8 game grid, assigning player pieces

#### Create Board:
- `function createBoard()`: Visually creates the game board on the webpage

#### Cell Functions:
- `function createCell(row, col)`: Creates an individual cell for the game board
- `function cellClick(event)`: Logic for when a cell on the board is clicked

#### Checker Functions:
- `function createChecker(player, row, col)`: Generates a checker piece for a specified player
- `function checkerClick(event)`: Logic for when a checker piece is clicked on.

## Gameplay Logic:
- `function computerPlay()`: A basic AI function for the computer to randomly select a valid move
- `function getValidMoves(checker)`: Determine the valid moves a checker piece can make from a given position
- `function moveChecker(toRow, toCol)`: Execute the movement of a checker piece on the game board
- `function declareWinner()`: Announce the winner of the game
- `function switchPlayer()`: Toggle the turn to the other player
- `function resetGame()`: Reset the game to its initial configuration
- `function updateBoard()`: Refresh the visual representation of the game board

## OG AI Logic:  "OG (Triple)OOOG AI"
- `function OGComputerStrategy()`: The original game AI logic, I am using simpler rules/algorithms and have changed to fit the title more. "Corrupted Checkers"
  - Example: `if (availableMoves.length > 0) { selectRandomMove(availableMoves); }`: OG AI chooses a random move from the list of available moves
  - Example: `prioritizeCaptureMoves(availableMoves)`: OG AI might prioritize moves that capture opponent pieces and if opponent jumps OG OOOG around his other checkers
  - - - THE CLOSEST CHECKER WILL JUMP YOU, TAKE YOUR CHECKER, AND GIVE OOOG's CHECKER BACK - - -

## Utility Functions:
- `function isValidMove(fromRow, fromCol, toRow, toCol)`: Check if a move from a starting position to an ending position is valid
- `function getCheckerPosition(checkerElement)`: Get the position of a checker piece
- `function getCellPosition(cellElement)`: Get the position of a cell on the board

## Event Listeners:
- `startButton.addEventListener('click', startGame)`: Starts the game when the button is clicked
  
## Initialization:
- Script Initialization: `initializeBoard()`.
