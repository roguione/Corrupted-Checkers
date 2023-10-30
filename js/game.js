console.log('javascript is a go');

// global vars
let grid;

// DOM elements
const board = document.querySelector('#grid -container');

// util/ help function
function makeBoard(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j <grid[i].length; j++){
            let newCell = document.createElement('div');
        // additional elements
        newCell.setAttribute('data-x', j);
        newCell.setAttribute('data-y', i);
        newCell.classList.add('cell');
        board.appendChild(newCell);
        }
    }
}

init();

function init(){
    grid = new Array(8).fill().map(() => new Array(8).fill('0');

    makeBoard();

    // cleanup
    board.removeEventListener('click', checkCell);
    // addnew
    board.addEventListener('click', checkCell);
}

function checkCell(e) {
    console.log(e.target.dataset);
}



