//Coordinates are read as: [column][row].  Ex: '20' = column 2, row 0;

/*--------------- constants ------------------*/

const SHIPLIST = [{name: 'sub1', class: 'sub', size: 2}, 
                {name: 'sub2', class: 'sub', size: 2}, 
                {name: 'sub3', class: 'sub', size: 2}, 
                {name: 'destroyer1', class: 'destroyer', size: 3}, 
                {name: 'destroyer2', class: 'destroyer', size: 3}, 
                {name: 'cruiser1', class: 'cruiser', size: 4}, 
                {name: 'carrier1', class: 'carrier', size:5}]

// boardData = [[{id: 'w'/'shipid', hit: true/false}]]

/*----- app's state (variables) -----*/
let rows;
let columns;
let turn;
let winner;
let playerBoardData;
let aiBoardData;
let playerHudData;
let aiHudData;
// let playerShipCounter;
// let aiShipCounter;



/*----- cached element references -----*/
let playerBoard = document.querySelector('#playerboard')
let aiBoard = document.querySelector('#aiboard')
let playerHud = document.querySelector('#playerhud')
let aiHud = document.querySelector('#aihud')
let message = document.querySelector('#message')
let startBtn = document.querySelector('#start')
let placementBtn = document.querySelector('#deploy')
//? message too!!!

/*----- event listeners -----*/
aiBoard.addEventListener('click', handlePlayer)
placementBtn.addEventListener('click', shufflePlayer)
startBtn.addEventListener('click', startGame)
//document.querySelector('gamespace').addEventListener('click', select)
//document.addEventListener('keydown', rotate)



/*-------------------------------------- FUNCTIONS ----------------------------------------*/

/*-------------------------------------- GENERAL FUNCTIONS -------------------------------------------*/
init();

function init() {
    //Initialize Player
    rows = 10;
    columns = 10;
    createBoardDisplay(playerBoard, rows, columns);
    createHudDisplay(playerHud);
    playerBoardData = emptyBoardData(rows, columns);
    playerHudData = newHudData();
    console.log(playerBoardData);
    //Initialize AI
    createBoardDisplay(aiBoard, rows, columns);
    createHudDisplay(aiHud);
    aiBoardData = emptyBoardData(rows, columns);
    aiHudData = newHudData();
    randomPlacement(aiBoardData); 
    turn = 1;
    winner = null;
    render();
}



function render() {
    handleAi()
    renderBoardDisplay(playerBoard, playerBoardData, playerHud, playerHudData);
    renderBoardDisplay(aiBoard, aiBoardData, aiHud, aiHudData);
    renderMessage();
    // renderCounter();
}


//create a RESET game and remove every id and class from 

/*------------------------------------------------------------MODEL FUNCTIONS-----------------------------------------------------------------*/

//Create an Empty Board Data - OK!
function emptyBoardData (rows, columns) {
    return new Array(rows).fill(null).map(() => Array(columns).fill({id: 'w'}))
}

//Create an Empty HUD Data - OK!
function newHudData() {
    let clone = JSON.parse(JSON.stringify(SHIPLIST));
    return clone;
}

//Generate Ships in the start screen
function shufflePlayer(){
    playerBoardData = emptyBoardData(rows, columns);
    randomPlacement(playerBoardData);
    renderPreview(playerBoard, playerBoardData);
    startBtn.style.visibility = 'visible';//function to display start button. IN CSS toggle it to invisible
    render();
}

/*------------------------------------------------------------VIEW FUNCTIONS-------------------------------------------------------*/

//Generate Empty Board Display - OK!
function createBoardDisplay(board, rows, columns) {
    //Generate Grid
    for(let row = 0; row < rows; row++) {
        const elRow = document.createElement('div');
        elRow.className = 'row';
        for(let column = 0; column < columns; column++) {
            const elColumn = document.createElement('div');
            elColumn.className = 'cell';
            if(board === playerBoard) {
                elColumn.setAttribute('id', `p${row}${column}`)
            } else {
                elColumn.setAttribute('id', `a${row}${column}`)
            }
            elRow.appendChild(elColumn);
        }
        board.appendChild(elRow);
    }
    
}

//Generate Empty HUD Display - OK!
function createHudDisplay (hud) {
    for (let i=0; i < SHIPLIST.length; i++) {
        const ship = document.createElement('div');
        if (hud === playerHud) {
            ship.setAttribute('id', `p${SHIPLIST[i].name}`);
            ship.className = SHIPLIST[i].class;
            ship.className = 'shipIcon';
        } else {
            ship.setAttribute('id', `a${SHIPLIST[i].name}`);
            ship.className = SHIPLIST[i].class;
            ship.className = 'shipIcon';
        }
        ship.className = SHIPLIST[i].class;
        hud.appendChild(ship);
    }
}

//UPDATE Preview display
function renderPreview (board, boardData) {
    boardData.forEach(function(rowArr, rowIdx){
        rowArr.forEach(function(cellObj, colIdx) {
            let cellId;
            if(board === playerBoard) {
                cellId = `p${rowIdx}${colIdx}`;
            } else {
                cellId = `a${rowIdx}${colIdx}`;
            }
            if (cellObj.id === 'w') { 
                document.getElementById(cellId).style.backgroundColor = 'lightblue';
                return;
            } else { 
                document.getElementById(cellId).style.backgroundColor = 'grey';
            }
        });
    });
};

//UPDATE Board and HUD Display using Data for each player - OK!
function renderBoardDisplay (board, boardData, hud, hudData) {
    //------BOARD-------
    boardData.forEach(function(rowArr, rowIdx){
        rowArr.forEach(function(cellObj, colIdx) {
            let cellId;
            if(board === playerBoard) {
                cellId = `p${rowIdx}${colIdx}`;
            } else {
                cellId = `a${rowIdx}${colIdx}`;
            }
            if (cellObj.hit) { //check if cellObj is true
                if (cellObj.id === 'w') { 
                    if(board ===playerBoard) {
                        document.getElementById(cellId).style.backgroundColor = 'steelblue';
                    } else {
                        document.getElementById(cellId).style.backgroundColor = 'lightblue';
                    }
                    return;
                } else { 
                    document.getElementById(cellId).style.backgroundColor = 'red';
                }
            };
        });
    });
    //-------HUD-------
    hudData.forEach(function(object){
        if (object.size === 0){
            if (hud === playerHud){
                document.getElementById(`p${object.name}`).style.backgroundColor = 'darkred';
            } else {
                document.getElementById(`a${object.name}`).style.backgroundColor = 'darkred';
            }
        }
    })
}

function renderMessage() {
    if (turn === 1) {

    }
}


/*-------------------------------------------------------------CONTROL FUNCTIONS----------------------------------------------------*/

function startGame(){
    placementBtn.style.visibility = 'hidden';
    render();

}

function renderControls() {
    start.innerText = winner ? 'PLAY AGAIN' : 'TO BATTLE STATIONS';
}

//HANDLE PLAYER: On click, update player board state when the board is clicked and update ship info in the ai HUD - OK!
function handlePlayer(evt) {
    if (turn === 1) {
        const tgt = evt.target;
        //Guards
        if (tgt.className !== 'cell') return;
        if (tgt.parentElement.parentElement.id !== 'aiboard') return; //Needs to check 2 parents above
        // Relate tgt ID to the Board Data 
        // console.log(tgt);
        const colIdx = parseInt(tgt.id.split('').pop()); //returns a number. column id. check:ok
        const rowIdx = parseInt(tgt.id.split('').slice(1,3)); //return a number. row id. check:ok
        const cellObj = {...aiBoardData[rowIdx][colIdx], hit:true}; //clone teh object and assign a key-pair of 'hit:true' to it. Store it in 'cellObj' variable.
        aiBoardData[rowIdx][colIdx] = cellObj; // assign the cellObj value to the desired position
        //aiBoardData = [...aiBoardData, aiBoardData[rowIdx][colIdx] = cellObj]; <-- NOT WORKING. It replaces the object but also creates an new object at the end of the string
        // UPDATE HUD: if Hit was not water
        if (cellObj.id !== 'w') {  
            let shipHit = aiHudData.find((ship) => ship.name === cellObj.id);
            shipHit.size--;
            // let shipIdx = aiHudData.indexOf(shipHit);
            // aiHudData[shipIdx].size--;
            //let cloneSize = shipHit.size --; //reduce the ship size in the HUD
            tgt.classList.add(shipHit.name);
            // if(shipHit.size === 0) { //if all of the elements of the corresponding ship have been hit, thus reducind the ship size to 0 in the HudData, then change teh color in the HUD
            //     //console.log(document.getElementById(shipHit.name), shipHit.name)
            //     document.querySelector(shipHit.name).style.backgroundColor = 'darkred';
            // }
        }
        console.log(tgt.id)
        console.log(rowIdx, colIdx, cellObj, aiBoardData)
        
        console.log(playerBoardData, aiBoardData, playerHudData, aiHudData)
        winner = getWinner();
        turn *= -1;
        render();
    } return;
}

//HANDLE AI: Basic AI randomized move. Update ai board state and player HUD. NO LOGIC IMPLEMENTED
function handleAi () {
    if (turn === -1) {
        let rowIdx = Math.floor(Math.random()*rows);
        let colIdx = Math.floor(Math.random()*columns);
        while(playerBoardData[rowIdx][colIdx].hit){
            rowIdx = Math.floor(Math.random()*rows);
            colIdx = Math.floor(Math.random()*columns);
        }
        const cellObj = {...playerBoardData[rowIdx][colIdx], hit:true}; //clone teh object and assign a key-pair of 'hit:true' to it. Store it in 'cellObj' variable.
        playerBoardData[rowIdx][colIdx] = cellObj; // assign the cellObj value to the desired position
        console.log(rowIdx, colIdx)
        if (cellObj.id !== 'w') {  
            let shipHit = playerHudData.find((ship) => ship.name === cellObj.id);
            shipHit.size --; //reduce the ship size in the HUD
            console.log(rowIdx, colIdx)
            console.log(document.getElementById(`p${rowIdx}${colIdx}`))
            document.getElementById(`p${rowIdx}${colIdx}`).classList.add(shipHit.name);
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
    if (playerRemainingShips === 0) return 'AI Wins';
    if (aiRemainingShips === 0)  return 'Player Wins';

}

//RANDOM SHIP PLACEMENT - OK!
function randomPlacement(board){
//1) iterate through ship array and do this for each ship: 
    SHIPLIST.forEach(function(ship){
        let success = false;
        while(!success){
            //2.1) pick a random number coordinates, ranging from 0 to (row or column) and place on the board
            let rowIdx = Math.floor(Math.random()*rows);
            let colIdx = Math.floor(Math.random()*columns);
            //2.2) pick random orientation (1 or 0). FUTURE: make it so that it can be 3 or 4 for ship orientation
            let numRotations = Math.floor(Math.random()*2);
            //2.3) check if squares are available (use coordinates, rotation and check if it exists && {id:'w'})
            if(checkPlacement (board, rowIdx, colIdx, ship, numRotations)){
                //2.4) if yay: replace data; if nay: go back to 2.1
                placeShip(board, rowIdx, colIdx, ship, numRotations)
                success = true;
            };
        }
    });
    //3) appear start button 
};
            
//CHECK PLACEMENT: Check if there are free squares within range of the selected coordinates for the selected ship - OK!
// function checkPlacement(board, rowIdx, colIdx, ship, direction) {
//     let length = ship.size
//     if (direction === 0) {
//         if (colIdx+length <= columns) {
//             for (let i=0; i<length; i++) {
//                 if(board[rowIdx][colIdx+i].id === 'w') { 
//                   return true;
//                 }
//             };
//         } return false;
//     } else if (rowIdx+length <= rows) {
//             for (let i=0; i<length; i++) {
//                 if(board[rowIdx+i][colIdx].id === 'w') {
//                   return true;
//                 }
//             }            
//         } 
//   return false;
// }

//CHECK PLACEMENT: Check if there are free squares within range of the selected coordinates for the selected ship - OK!
function checkPlacement(board, rowIdx, colIdx, ship, direction) {
    let length = ship.size
    if (direction === 0) {
        if (colIdx+length > columns) return false;
        for (let i=0; i<length; i++) {
            if(board[rowIdx][colIdx+i].id !== 'w') return false;
        }
    } else {
        if (rowIdx+length > rows) return false;
        for (let i=0; i<length; i++) {
            if(board[rowIdx+i][colIdx].id !== 'w') return false;
        }
    }
    return true;
}

//PLACE SHIP: Place the ship on the board
function placeShip (board, rowIdx, colIdx, ship, direction) {
    let length = ship.size
    if (direction === 0) {
        for (let i=0; i<length; i++) {
            let clone = {...board[rowIdx][colIdx], id:ship.name}; //create clone replacing the cell 'id' value
            board[rowIdx][colIdx] = clone; // assign the value in the board to be a clone
            colIdx++;
        }
    } else {
        for (let i=0; i<length; i++) {
            let clone = {...board[rowIdx][colIdx], id:ship.name}; //create clone replacing the cell 'id' value
            board[rowIdx][colIdx] = clone; // assign the value in the board to be a clone
            rowIdx++;           
        }
    }
}



/*-------------------------------------------------UNUSED CODE ---------------------------------------------------------*/


//check codes



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