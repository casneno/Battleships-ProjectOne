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



/*----- cached element references -----*/
let playerBoard = document.querySelector('#playerboard')
let aiBoard = document.querySelector('#aiboard')
let playerHud = document.querySelector('#playerhud')
let aiHud = document.querySelector('#aihud')
let shipIcon = document.querySelector('.shipIcon')


/*----- event listeners -----*/
document.querySelector('main').addEventListener('click', handlePlayer)
document.querySelector('main').addEventListener('click', randomPlacement)
//document.querySelector('gamespace').addEventListener('click', select)
//document.addEventListener('keydown', rotate)


// document.querySelector('start').addEventListener('click', startGame)



/*-------------------------- FUNCTIONS ------------------------------*/

/*--------------------------- GENERAL FUNCTIONS ----------------------*/
init();

function init() {
    //Initialize Player
    emptyBoardDisplay(playerBoard);
    emptyHudDisplay(playerHud);
    playerBoardData = emptyBoardData(rows, columns);
    playerHudData = newHudData();
    console.log(playerBoardData);
    //Initialize AI
    emptyBoardDisplay(aiBoard);
    emptyHudDisplay(aiHud);
    aiBoardData = emptyBoardData(rows, columns);
    aiHudData = newHudData();
    turn = 1;
    winner = null;
    planningPhase();
}

console.log(playerBoardData)
console.log(aiBoardData)

function planningPhase () {
    renderBoardDisplay(playerBoard, playerBoardData);
    renderBoardDisplay(aiBoard, aiBoardData);
    renderHudDisplay(playerHud, playerHudData);
    renderHudDisplay(aiHud, aiHudData);
    //randomPlacement(playerBoardData);
    //randomPlacement(aiBoardData); 
    render()
}

function render() {
    handleAi()
    renderBoardDisplay(playerBoard, playerBoardData);
    renderBoardDisplay(aiBoard, aiBoardData);
    renderHudDisplay(playerHud, playerHudData);
    renderHudDisplay(aiHud, aiHudData);
    renderMessage();
    // renderCounter();
}

/*------------------------------------------------------------MODEL FUNCTIONS-----------------------------------------------------------------*/

//Create an Empty Board Data - OK!
function emptyBoardData (rows, columns) {
    return new Array(rows).fill(null).map(() => Array(columns).fill({id: 'w'}))
}

//Create an Empty HUD Data - OK!
function newHudData() {
    return SHIPLIST;
}

/*------------------------------------------------------------VIEW FUNCTIONS-------------------------------------------------------*/

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
            ship.className = SHIPLIST[i].class;
            ship.className = 'shipIcon';
        } else {
            ship.setAttribute('id', `a${SHIPLIST[i].name}`);
            ship.className = SHIPLIST[i].class;
            ship.className = 'shipIcon';
        }
        ship.className = SHIPLIST[i].class;
        hudEl.appendChild(ship);
    }
}

//UPDATE Board Display using Data for each player - OK!
function renderBoardDisplay (boardEl, dataEl) {
    dataEl.forEach(function(colArr, colIdx){
        colArr.forEach(function(cellObj, cellIdx) {
            let cellId;
            if(boardEl === playerBoard) {
                cellId = `p${cellIdx}${colIdx}`;
            } else {
                cellId = `a${cellIdx}${colIdx}`;
            }
            if (cellObj.hit) { //check if cellObj is true
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

//UPDATE HUD Display using Data for each player
function renderHudDisplay(hudEl, dataEl){
    dataEl.forEach(function(object){
        if (object.size === 0){
            if (hudEl === playerHud){
                document.getElementById(`p${object.name}`).style.backgroundColor = 'darkred';
            } else {
                document.getElementById(`a${object.name}`).style.backgroundColor = 'darkred';
            }
        }
    })

}


/*-----------------------------------////////////////////------CONTROL FUNCTIONS-------------------------------------////////////////------*/

//HANDLE PLAYER: On click, update player board state when the board is clicked and update ship info in the ai HUD - OK!
function handlePlayer(evt) {
    if (turn === 1) {
        const tgt = evt.target;
        //Guards
        if (tgt.className !== 'cell') return;
        if (tgt.parentElement.parentElement.id !== 'aiboard') return; //Needs to check 2 parents above
        // Relate tgt ID to the Board Data 
        // console.log(tgt);
        const rowIdx = parseInt(tgt.id.split('').pop()); //returns a number. column id. check:ok
        const colIdx = parseInt(tgt.id.split('').slice(1,3)); //return a number. row id. check:ok
        const cellObj = {...aiBoardData[rowIdx][colIdx], hit:true}; //clone teh object and assign a key-pair of 'hit:true' to it. Store it in 'cellObj' variable.
        aiBoardData[rowIdx][colIdx] = cellObj; // assign the cellObj value to the desired position
        //aiBoardData = [...aiBoardData, aiBoardData[rowIdx][colIdx] = cellObj]; <-- NOT WORKING. It replaces the object but also creates an new object at the end of the string
        console.log(rowIdx, colIdx, cellObj, aiBoardData)
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
    } return;
}

//HANDLE AI: Basic AI randomized move. Update ai board state and player HUD. NO LOGIC IMPLEMENTED
function handleAi () {
    if (turn === -1) {
        let rowIdx = Math.floor(Math.random()*10);
        let colIdx = Math.floor(Math.random()*10);
        const cellObj = {...playerBoardData[rowIdx][colIdx], hit:true}; //clone teh object and assign a key-pair of 'hit:true' to it. Store it in 'cellObj' variable.
        playerBoardData[rowIdx][colIdx] = cellObj; // assign the cellObj value to the desired position
        if (cellObj.id !== 'w') {  
            let shipHit = playerHudData.find((ship) => ship.name === cellObj.id);
            shipHit.size --; //reduce the ship size in the HUD
            if(shipHit.size === 0) { //if all of the elements of the corresponding ship have been hit, thus reducind the ship size to 0 in the HudData, then change teh color in the HUD
                document.getElementById(shipHit.name).style.backgroundColor = 'darkred';
            }
        }
        winner = getWinner();
        turn *= -1;
        render();
    } return;
    //check DOM state: iterate through array; if there is a hit === true && go to random location; click; 
}

//CHECK WINNER: Check Winning Conditon and return if someone won; - OK!
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

//RANDOM SHIP PLACEMENT - OK!
function randomPlacement(boardEl){
//1) iterate through ship array and do this for each ship: 
    SHIPLIST.forEach(function(ship){
        let success = false;
        while(!success){
            //2.1) pick a random number coordinates, ranging from 0 to (row or column) and place on the board
            let rowIdx = Math.floor(Math.random()*10);
            let colIdx = Math.floor(Math.random()*10);
            //2.2) pick random orientation (1 or 0). FUTURE: make it so that it can be 3 or 4 for ship orientation
            let numRotations = Math.floor(Math.random()*2);
            //2.3) check if squares are available (use coordinates, rotation and check if it exists && {id:'w'})
            if(checkPlacement (boardEl, rowIdx, colIdx, ship, numRotations)){
                //2.4) if yay: replace data; if nay: go back to 2.1
                placeShip(boardEl, rowIdx, colIdx, ship, numRotations)
                success = true;
            };
        }
    });
    //3) appear start button 
};
            
//CHECK PLACEMENT: Check if there are free squares within range of the selected coordinates for the selected ship - OK!
function checkPlacement(boardEl, rowIdx, colIdx, ship, direction) {
    let length = ship.size
    if (direction === 0) {
        if (colIdx+length <= columns) {
            for (let i=0; i<length; i++) {
                if(boardEl[rowIdx][colIdx+i].id === 'w') { 
                  return true;
                }
            };
        } return false;
    } else if (rowIdx+length <= rows) {
            for (let i=0; i<length; i++) {
                if(boardEl[rowIdx+i][colIdx].id === 'w') {
                  return true;
                }
            }            
        } 
  return false;
}


// function checkPlacement(boardEl, rowIdx, colIdx, ship, direction) {
//     let length = ship.size
//     if (direction === 0) {
//         if (colIdx+length > columns) return false;
//         for (let i=0; i<length; i++) {
//             if(boardEl[rowIdx][colIdx+i].id !== 'w') return false;
//         }
//     } else {
//         if (rowIdx+length > rows) return false;
//         for (let i=0; i<length; i++) {
//             if(boardEl[rowIdx+i][colIdx].id !== 'w') return false;
//         }
//     }
//     return true;
// }




//PLACE SHIP: Place the ship on the board
function placeShip (boardEl, rowIdx, colIdx, ship, direction) {
    let length = ship.size
    if (direction === 0) {
        for (let i=0; i<length; i++) {
            let clone = {...boardEl[rowIdx][colIdx], id:ship.name}; //create clone replacing the cell 'id' value
            boardEl[rowIdx][colIdx] = clone; // assign the value in the board to be a clone
            colIdx++;
        }
    } else {
        for (let i=0; i<length; i++) {
            let clone = {...boardEl[rowIdx][colIdx], id:ship.name}; //create clone replacing the cell 'id' value
            boardEl[rowIdx][colIdx] = clone; // assign the value in the board to be a clone
            rowIdx++;           
        }
    }
}

function renderMessage() {

}

function startGame(evt) {

}

/*-----------------------UNUSED CODE ----------------------------------*/

// generate an array with the ship properties - OK! (UNUSED)
// function generateShipArray(ship) {
//     let size = ship.size;
//     let name = ship.name;
//     return array = Array(1).fill().map(function() {
//         return Array(size).fill().map(function() {
//             return {id:name}
//         });
//     });
// }

// ROTATE SHIP in data - OK! (UNUSED)
// function rotate(array) {
//     let rotate =[];
//     array.forEach(function (subArray) {
//     subArray.forEach(function(cell, idx) {
//         rotate[idx] = [...(rotate[idx] || []), cell]
//     });
//     });
//     return rotate;
// }