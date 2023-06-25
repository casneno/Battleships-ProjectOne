/*----- constants -----*/


const SHIPLIST = [{sub: {num: 3, size: 2}, destroyer: {num: 2, size: 3}, cruiser: {num: 1, size: 4}, carier: {num:1, size:5}}]


/*----- app's state (variables) -----*/
let turn;
let winner;
let playerBoard = document.querySelector('#playerboard')
let computerBoard = document.querySelector('#computerboard')
let playerBoardData;
let computerBoardData;
let array;



/*----- cached element references -----*/



/*----- event listeners -----*/
document.querySelector('main').addEventListener('click', handleMove)
document.querySelector('main').addEventListener('click', handlePlacement)
document.querySelector('start').addEventListener('click', startGame)



/*----- functions -----*/
init();

function init() {
    playerBoardData = [
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],]
    computerBoardData = [
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},], 
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],
        [{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},{id: 'w'},],]
    turn = 1;
    winner = null;
    render();
}

function startGame(evt) {
    
}

function handlePlacement(evt) {
//     //Guards
//     if (tgt.className !== 'row') return;
//     if (tgt.parentElement.parentElement.id !== 'shipcounter') return;
//     //
}

function handleMove (evt) {
    const tgt = evt.target;
    //Guards
    if (tgt.className !== 'cell') return;
    if (tgt.parentElement.parentElement.id !== 'computerboard') return; //Needs to check 2 parents above
    //Relate tgt ID to the Board Data 
    console.log(tgt);
    const rowId = parseInt(tgt.id.split('').pop());
    const colId = parseInt(tgt.id.split('').shift());
    const cellEl = computerBoardData[rowId][colId];
    cellEl.status = true;
    console.log(computerBoardData[colId][rowId]);
    console.log(computerBoardData)
    if (cellEl.id === 'w') {
        tgt.style.backgroundColor = 'blue';
    } else {
        tgt.style.backgroundColor = 'red';
        cellEl.id = 'X'
    }

}



function render() {
    renderBoard(playerBoard);
    renderBoard(computerBoard);
    renderMessage();
    renderCounter();
}


//Generate Board
function renderBoard (boardEl, columns = 10, rows = 10) {
    //turn = 1 ? boardEl = 'playerBoard' : boardEl = 'computerBoard'
    //Generate Grid
    for(let column = 0; column < columns; column++) {
        const elColumn = document.createElement('div');
        elColumn.className = 'column';
            for(let row = 0; row < rows; row++) {
            const elRow = document.createElement('div');
            elRow.className = 'cell';
            elRow.setAttribute('id', `${column}${row}`)
            elColumn.appendChild(elRow);
      }
    boardEl.appendChild(elColumn);
    }
}
    //Generate Ships
    // for (let i=0; i<2; i++) //make this 2 times
    // const shipIcons = document.createElement('div');
    // shipIcons.className = 'ship';
    







function renderMessage() {

}

function renderCounter() {//ships counter on each player and turn counter


}

function shipPlacement () {

}


/*let drag = false;
document.addEventListener(
    'mousedown', () => drag = false);
  
document.addEventListener(
    'mousemove', () => drag = true);
  
document.addEventListener(
    'mouseup', () => console.log(
        drag ? 'drag' : 'click'));*/