// actual board 8x8
// 0 =  empty square
// 1 = player1 square "white checker"
// -1 = player2 square "black checker"
const board = [
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0]
];

function makeBoard() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
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
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
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
  grid = new Array(8).fill().map(() => new Array(8).fill("0"));

  makeBoard();

  // clean up
  board.removeEventListener('click', checkCell);
  // add again
  board.addEventListener('click', checkCell);
}

function checkCell(e) {
  console.log(e.target.dataset);
}

// test board 4x4
const brd = [
  [0, -1, 0, -1],
  [-1, 0, -1, 0],
  [0, -1, 0, -1],
  [-1, 0, -1, 0]
];

function makeBoard() {
  const board = document.getElementById('board'); // Assuming you have an element with the id 'board' to append cells to.

  const brd = [
    [0, -1, 0, -1],
    [-1, 0, -1, 0],
    [0, -1, 0, -1],
    [-1, 0, -1, 0]
  ];

  for (let i = 0; i < brd.length; i++) {
    for (let j = 0; j < brd[i].length; j++) {
      let newCell = document.createElement('div');
      newCell.setAttribute('data-x', j);
      newCell.setAttribute('data-y', i);
      newCell.classList.add('cell');

      if (brd[i][j] === -1) {
        newCell.classList.add('obstacle'); // You can add an 'obstacle' class for -1 values.
      }

      board.append(newCell);
    }
  }
}

// Call the function to create the board
makeBoard();
