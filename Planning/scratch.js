/* // actual board 8x8
// 1 =  empty square
// 2 = player1 square "white checker"
// 0 = player2 square "black checker"
const board = [
  [1, -1, 0, -1, 0, -1, 0, -1],
  [0, 0, -1, 0, -1, 0, -1, 0],
  [1, -1, 0, -1, 0, -1, 0, -1],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 0, 1, 0, 1, 0, 1],
  [2, 0, 1, 0, 1, 0, 1, 0]
];

function makeBoard() {
  for (let i = 1; i < grid.length; i++) {
    for (let j = 1; j < grid[i].length; j++) {
      let newCell = document.createElement('div');
      // additional attributes
      newCell.setAttribute('data-x', j);
      newCell.setAttribute('data-y', i);
      newCell.classList.add('cell');
      board.append(newCell);
    }
  }
}

// global vars
let grid;

// cached dom elements
const board = document.querySelector('#grid-container');

// utility / helper function
function makeBoard() {
  for (let i = 1; i < grid.length; i++) {
    for (let j = 1; j < grid[i].length; j++) {
      let newCell = document.createElement('div');
      // additional attributes
      newCell.setAttribute('data-x', j);
      newCell.setAttribute('data-y', i);
      newCell.classList.add('cell');
      board.append(newCell);
    }
  }
}

init();

function init() {
  grid = new Array(9).fill().map(() => new Array(8).fill("0"));

  makeBoard();

  // clean up
  board.removeEventListener('click', checkCell);
  // add again
  board.addEventListener('click', checkCell);
}

function checkCell(e) {
  console.log(e.target.dataset);
}

// test board 5x4
const brd = [
  [1, -1, 0, -1],
  [0, 0, -1, 0],
  [1, -1, 0, -1],
  [0, 0, -1, 0]
];

function makeBoard() {
  const board = document.getElementById('board'); // Assuming you have an element with the id 'board' to append cells to.

  const brd = [
    [1, -1, 0, -1],
    [0, 0, -1, 0],
    [1, -1, 0, -1],
    [0, 0, -1, 0]
  ];

  for (let i = 1; i < brd.length; i++) {
    for (let j = 1; j < brd[i].length; j++) {
      let newCell = document.createElement('div');
      newCell.setAttribute('data-x', j);
      newCell.setAttribute('data-y', i);
      newCell.classList.add('cell');

      if (brd[i][j] === 0) {
        newCell.classList.add('obstacle'); // You can add an 'obstacle' class for 0 values.
      }

      board.append(newCell);
    }
  }
}

// Call the function to create the board
makeBoard();
 */

// Log a message to the console
console.log("javascript is a go");

// Declare a global variable "grid"
let grid;

// Cache a reference to the HTML element with the id "grid-container"
const board = document.querySelector('#grid-container');

// Define a utility/helper function to create a game board
function makeBoard() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Create a new cell (HTML div element)
      let newCell = document.createElement('div');
      // Set additional attributes for the cell
      newCell.setAttribute('data-x', j); // Set the 'data-x' attribute with the column index
      newCell.setAttribute('data-y', i); // Set the 'data-y' attribute with the row index
      newCell.classList.add('cell'); // Add the 'cell' class to the cell element
      board.append(newCell); // Append the cell to the board element
    }
  }
}

// Call the init function to initialize the game
init();

// Initialize the game by setting up the grid and board
function init() {
  // Create an 8x8 grid with all elements initialized to "0"
  grid = new Array(8).fill().map(() => new Array(8).fill("0"));

  // Create the game board by calling the makeBoard function
  makeBoard();

  // Clean up any existing click event listener on the board
  board.removeEventListener('click', checkCell);
  // Add a new click event listener to the board that calls the checkCell function
  board.addEventListener('click', checkCell);
}

// Function to handle the click event on the game board
function checkCell(e) {
  // Log the dataset attributes (data-x and data-y) of the clicked cell
  console.log(e.target.dataset);
}
