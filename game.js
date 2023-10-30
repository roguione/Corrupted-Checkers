console.log("javascript is a go");

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
