//Coordinates are read as: [column][row].  Ex: '20' = column 2, row 0;

/*----- constants -----*/

const SHIPLIST = [{name: 'sub1', class: 'sub', size: 2}, 
                {name: 'sub2', class: 'sub', size: 2}, 
                {name: 'sub3', class: 'sub', size: 2}, 
                {name: 'destroyer1', class: 'destroyer', size: 3}, 
                {name: 'destroyer2', class: 'destroyer', size: 3}, 
                {name: 'cruiser1', class: 'cruiser', size: 4}, 
                {name: 'carrier1', class: 'carrier', size:5}]

// boardData = [[{id: 'w'/'shipid', hit: true/false}]]

/*----- app's state (variables) -----*/
let rows = 10;
let columns = 10;
let turn;
let winner;
let playerBoardData;
let aiBoardData;
let playerHudData;
let aiHudData;
let playerShipCounter;
let aiShipCounter;
let array;



/*----- cached element references -----*/
let playerBoard = document.querySelector('#playerboard')
let aiBoard = document.querySelector('#aiboard')
let playerHud = document.querySelector('#playerhud')
let aiHud = document.querySelector('#aihud')


/*----- event listeners -----*/
document.querySelector('main').addEventListener('click', handlePlayer)
document.querySelector('main').addEventListener('click', handlePlacement)
// document.querySelector('start').addEventListener('click', startGame)



/*----- functions -----*/
init();

function init() {
    //generate empty boards and HUDS
    emptyBoardDisplay(playerBoard);
    emptyBoardDisplay(aiBoard);
    emptyHudDisplay(playerHud);
    emptyHudDisplay(aiHud);
    playerBoardData = emptyBoardData(rows, columns);
    aiBoardData = emptyBoardData(rows, columns);
    playerHudData = newHudData();
    aiHudData = newHudData();


    turn = 1;
    winner = null;
    render();
}

console.log(playerBoardData)
console.log(playerHudData)
console.log()

function render() {
    renderBoardDisplay(playerBoard, playerBoardData);
    renderBoardDisplay(aiBoard, aiBoardData);
    renderHudDisplay(playerHud);
    renderHudDisplay(aiHud);
    renderMessage();
    // renderCounter();
}

//Create an Empty Board Data - OK!
function emptyBoardData (rows, columns) {
    return new Array(rows).fill(null).map(() => Array(columns).fill({id: 'w'}))
}

//Create an Empty HUD Data - OK!
function newHudData() {
    return SHIPLIST;
}

//Generate Empty Board Display - OK!
function emptyBoardDisplay(boardEl, columns = 10, rows = 10) {
    //Generate Grid
    for(let column = 0; column < columns; column++) {
        const elColumn = document.createElement('div');
        elColumn.className = 'column';
            for(let row = 0; row < rows; row++) {
            const elRow = document.createElement('div');
            elRow.className = 'cell';
            if(boardEl === playerBoard) {
                elRow.setAttribute('id', `p${column}${row}`)
            } else {
                elRow.setAttribute('id', `a${column}${row}`)
            }
            elColumn.appendChild(elRow);
        }
        boardEl.appendChild(elColumn);
    }
}

//Generate Empty HUD Display - OK!
function emptyHudDisplay (hudEl) {
    for (let i=0; i < SHIPLIST.length; i++) {
        const ship = document.createElement('div');
        if (hudEl === playerHud) {
            ship.setAttribute('id', `p${SHIPLIST[i].name}`);
        } else {
            ship.setAttribute('id', `a${SHIPLIST[i].name}`);
        }
        ship.className = SHIPLIST[i].class;
        hudEl.appendChild(ship);
    }
}

//UPDATE Board Display using Data for each player
function renderBoardDisplay (boardEl, dataEl) {
    dataEl.forEach(function(rowArr, colIdx){
        rowArr.forEach(function(cellObj, cellIdx) {
            let cellId;
            if(boardEl === playerBoard) {
                cellId = `p${cellIdx}${colIdx}`;
            } else {
                cellId = `a${cellIdx}${colIdx}`;
            }
            if (cellObj.hit === true) { //check if cellObj is true
                if (cellObj.id === 'w') { 
                    document.getElementById(cellId).style.backgroundColor = 'blue';
                    return;
                } else { 
                    document.getElementById(cellId).style.backgroundColor = 'red';
                }
            };
        });
    });
}

function renderHudDisplay(){

}


//Change display when board is clicked and update ship info in the HUD - OK!
function handlePlayer (evt) {
    const tgt = evt.target;
    //Guards
    if (tgt.className !== 'cell') return;
    if (tgt.parentElement.parentElement.id !== 'aiboard') return; //Needs to check 2 parents above
    // Relate tgt ID to the Board Data 
    console.log(tgt);
    const rowId = parseInt(tgt.id.split('').pop()); //returns a number. row id. check:ok
    const colId = parseInt(tgt.id.split('').slice(1,3)); //return a number. column id. check:ok
    const cellObj = aiBoardData[rowId][colId]; //assign the position of the element in the 2D array to cellObj variable
    cellObj.hit = true; // « update board data
    // UPDATE HUD: if Hit was not water
    if (cellObj.id !== 'w') {  
        let shipHit = aiHudData.find((ship) => ship.name === cellObj.id);
        shipHit.size --; //reduce the ship size in the HUD
        if(shipHit.size === 0) { //if all of the elements of the corresponding ship have been hit, thus reducind the ship size to 0 in the HudData, then change teh color in the HUD
            document.getElementById(shipHit.name).style.backgroundColor = 'darkred';
        }
    }
    winner = getWinner();
    turn *= -1;
    render();
}

function handleAi () {
    if (turn === -1) {

    }
    //check DOM state: iterate through array; if there is a hit === true && go to random location; click; 
}

// Check Winning Conditon and return if someon won;
function getWinner() {
    const playerRemainingShips = playerHudData.reduce((acc,ship) => {
        return acc + ship.size;
    }, 0);
    const aiRemainingShips = aiHudData.reduce((acc,ship) => {
        return acc + ship.size;
    }, 0);
    if (playerRemainingShips === 0) return 'AI';
    if (aiRemainingShips === 0)  return 'Player';

}


//HUD Update
// function renderCounter () {
//     aiboardShipCounter = SHIPLIST;
//     console.log(SHIPLIST);
//     aiShipCounter.forEach((ship) => {
//         aiboardBoardData.forEach((row) => {
//             row.forEach((cell) => {
//                 if (cell.hit === true && cell.id === ship.id) {
//                     ship.size --;
//                 } return;
//             });
//         });
//     });
// }

function renderMessage() {

}

function startGame(evt) {

}

function handlePlacement(evt) {
//     //Guards
//     if (tgt.className !== 'row') return;
//     if (tgt.parentElement.parentElement.id !== 'shipcounter') return;
//     //
}



    //Generate Ships
    // for (let i=0; i<2; i++) //make this 2 times
    // const shipIcons = document.createElement('div');
    // shipIcons.className = 'ship';
    


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