
/*----------------------------------------------** BATTLESHIPS **-----------------------------------------------------------------*/

/*------------------------------------ CONSTANTS -----------------------------------------------*/

const SHIPLIST = [{name: 'sub1', class: 'sub', size: 2}, 
                {name: 'sub2', class: 'sub', size: 2}, 
                {name: 'sub3', class: 'sub', size: 2}, 
                {name: 'destroyer1', class: 'destroyer', size: 3}, 
                {name: 'destroyer2', class: 'destroyer', size: 3}, 
                {name: 'cruiser1', class: 'cruiser', size: 4}, 
                {name: 'carrier1', class: 'carrier', size:5}];
                
/*-------------------------- VARIABLES (APP'S STATE) -----------------------------------------*/
let rows;
let columns;
let turn;
let winner;
let playerBoardData;
let aiBoardData;
let playerHudData;
let aiHudData;
let gameStart;

/*----------------------------- CACHED ELEMENTS ---------------------------------------------*/
let playerBoard = document.querySelector('#playerboard')
let aiBoard = document.querySelector('#aiboard')
let playerHud = document.querySelector('#playerhud')
let aiHud = document.querySelector('#aihud')
let message = document.querySelector('#message')
let startBtn = document.querySelector('#start')
let placementBtn = document.querySelector('#deploy')
let admitDefeatBtn = document.querySelector('#restart')

/*---------------------------- EVENT LISTENERS ----------------------------------------------*/
aiBoard.addEventListener('click', handlePlayer)
placementBtn.addEventListener('click', deployFleet)
startBtn.addEventListener('click', startGame)
admitDefeatBtn.addEventListener('click', admitDefeat)

/*-------------------------------------- FUNCTIONS -----------------------------------------*/

/*-------------------------------------- GENERAL FUNCTIONS ---------------------------------*/
init();

function init() {
    rows = 10;
    columns = 10;
    createBoardDisplay(playerBoard, rows, columns, playerHud);
    createBoardDisplay(aiBoard, rows, columns, aiHud);
    reset()
}

function reset() {
    playerBoardData = emptyBoardData(rows, columns);
    playerHudData = newHudData();
    aiBoardData = emptyBoardData(rows, columns);
    aiHudData = newHudData();
    randomPlacement(aiBoardData); 
    winner = null;
    turn = 1;
    startGame = false;
    render();
}

function render() {
    renderMessage();
    renderBoardDisplay(playerBoard, playerBoardData, playerHud, playerHudData);
    renderBoardDisplay(aiBoard, aiBoardData, aiHud, aiHudData);
    handleAi()
}

/*-------------------------------------MODEL FUNCTIONS--------------------------------------*/

//Create an Empty Board Data - OK!
function emptyBoardData (rows, columns) {
    return new Array(rows).fill(null).map(() => Array(columns).fill({id: 'w'}))
}

//Create an Empty HUD Data - OK!
function newHudData() {
    let clone = JSON.parse(JSON.stringify(SHIPLIST));
    return clone;
}

/*----------------------------------VIEW FUNCTIONS-----------------------------------------*/

//Generate empty board and HUD elemnts for display - OK!
function createBoardDisplay(board, rows, columns, hud) {
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

//UPDATE toggles ship placement view - OK!
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

//UPDATE the board and HUD display using data for each player - OK!
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
                    document.getElementById(cellId).style.backgroundColor = 'crimson';
                }
            };
            if (cellObj.destroyed) {
                document.getElementById(cellId).style.backgroundColor = 'darkred';
            }
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

//UPDATE the displayed message
function renderMessage() {
    if (turn === 1) {
        message.innerHTML = "»<br>»<br>»<br>»";
    } else if (turn === -1) {
        message.innerHTML = "«<br>«<br>«<br>«";
    } else {
        winner === -1 ? message.innerText="AI Win!" : message.innerText="You Win!"
        message.style.fontSize = "7vmin";
    }
}

//CHECK WINNER: Check Winning Conditon and return if someone won; - OK!
function getWinner() {
    const playerRemainingShips = playerHudData.reduce((acc,ship) => {
        return acc + ship.size;
    }, 0);
    const aiRemainingShips = aiHudData.reduce((acc,ship) => {
        return acc + ship.size;
    }, 0);
    if (playerRemainingShips === 0) {
        turn = 0;
        return -1;
    }
    if (aiRemainingShips === 0) {
        turn = 0;
        return 1;
    }
    
}

/*--------------------------------CONTROL FUNCTIONS---------------------------------------*/

//HANDLE PLAYER: On click, update ai's board and HUD state
function handlePlayer(evt) {
    if (!startGame) return;
    if (turn === 1) {
        const tgt = evt.target;
        //Guards
        if (tgt.className !== 'cell') return;
        if (tgt.parentElement.parentElement.id !== 'aiboard') return; 
        const colIdx = parseInt(tgt.id.split('').pop()); 
        const rowIdx = parseInt(tgt.id.split('').slice(1,3)); 
        const cellObj = {...aiBoardData[rowIdx][colIdx], hit:true}; 
        aiBoardData[rowIdx][colIdx] = cellObj; 
        if (cellObj.id !== 'w') {  
            let shipHit = aiHudData.find((ship) => ship.name === cellObj.id);
            shipHit.size--;
            if(shipHit.size === 0) { 
                aiBoardData.forEach(function (rowArr, rowIdx) {
                    rowArr.forEach(function (cellObj, colIdx) {
                        if (cellObj.id === shipHit.name) { 
                            cellObj = {...aiBoardData[rowIdx][colIdx], destroyed:true}; 
                            aiBoardData[rowIdx][colIdx] = cellObj;
                        }
                    })
                })
            }
            tgt.classList.add(shipHit.name);
        }
        winner = getWinner();
        turn *= -1;
        render();
    } return;
}

//HANDLE AI: Basic AI randomized move. Update player board and HUD state
function handleAi () {
    if (turn === -1) {
        let rowIdx = Math.floor(Math.random()*rows);
        let colIdx = Math.floor(Math.random()*columns);
        while(playerBoardData[rowIdx][colIdx].hit){
            rowIdx = Math.floor(Math.random()*rows);
            colIdx = Math.floor(Math.random()*columns);
        }
        const cellObj = {...playerBoardData[rowIdx][colIdx], hit:true}; 
        playerBoardData[rowIdx][colIdx] = cellObj; 
        console.log(rowIdx, colIdx)
        if (cellObj.id !== 'w') {  
            let shipHit = playerHudData.find((ship) => ship.name === cellObj.id);
            shipHit.size --; 
            if(shipHit.size === 0) { 
                playerBoardData.forEach(function (rowArr, rowIdx) {
                    rowArr.forEach(function (cellObj, colIdx) {
                        if (cellObj.id === shipHit.name) {
                            cellObj = {...playerBoardData[rowIdx][colIdx], destroyed:true}; 
                            playerBoardData[rowIdx][colIdx] = cellObj;
                        }
                    })
                })
            }
            document.getElementById(`p${rowIdx}${colIdx}`).classList.add(shipHit.name);
        }
        winner = getWinner();
        turn *= -1;
        render();
    } return;
}

//RANDOM SHIP PLACEMENT: pick a random square, check availability and execute placement
function randomPlacement(board){
    SHIPLIST.forEach(function(ship){
        let success = false;
        while(!success){
            let rowIdx = Math.floor(Math.random()*rows);
            let colIdx = Math.floor(Math.random()*columns);
            let numRotations = Math.floor(Math.random()*2);
            if(checkPlacement (board, rowIdx, colIdx, ship, numRotations)){
                placeShip(board, rowIdx, colIdx, ship, numRotations)
                success = true;
            };
        }
    });
};

//CHECK PLACEMENT: Check if ship can be placed
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
            let clone = {...board[rowIdx][colIdx], id:ship.name}; 
            board[rowIdx][colIdx] = clone; 
            colIdx++;
        }
    } else {
        for (let i=0; i<length; i++) {
            let clone = {...board[rowIdx][colIdx], id:ship.name}; 
            board[rowIdx][colIdx] = clone; 
            rowIdx++;           
        }
    }
}

//Deploy Button: Generate Ships in the start screen - OK!
function deployFleet(){
    playerBoardData = emptyBoardData(rows, columns);
    randomPlacement(playerBoardData);
    renderPreview(playerBoard, playerBoardData);
    startBtn.style.visibility = 'visible';
    render();
}

//Start Button: enables game to start
function startGame(){
    startGame = true;
    startBtn.style.visibility = 'hidden';
    placementBtn.style.visibility = 'hidden';
    admitDefeatBtn.style.visibility = 'visible';
    render();
}

//Admit Defeat/Restart: enables player to restart
function admitDefeat () {
    let divs = document.querySelectorAll('div');
    divs.forEach(function(div) {
        div.remove();
    });
    placementBtn.style.visibility = 'visible';
    admitDefeatBtn.style.visibility = 'hidden';
    init()
}


/*-------------------------------------------UNUSED CODE / UNDER DEVELOPMENT -----------------------------------------------*/


// Generate an array with the ship properties - OK! (UNUSED)
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


// SMART AI (UNDER DEVELOPMENT)
// function handleAi () {
//     if (turn === -1) {
//         playerBoardData.forEach(function (rowArr, rowIdx) {
//             rowArr.forEach(function (cellObj, colIdx) {
//               if (cellObj.hit && cellObj.id !== 'w') {
//                   if (!cellObj.destroyed) {
//                     if(!playerBoardData[rowIdx][colIdx+1].hit && colIdx+1 < columns) {
//                       executeAiMove(rowIdx, colIdx+1);
//                       console.log("Planned move to the right")
//                       return;
//                     } else if (!playerBoardData[rowIdx+1][colIdx].hit && rowIdx+1 < rows) {
//                         executeAiMove(rowIdx+1, colIdx);
//                         console.log("Planned move down")
//                         return;
//                     };
//                   };
//               };
//             });
//         });
//         console.log("randomized")
//         let rowIdx = Math.floor(Math.random()*rows);
//         let colIdx = Math.floor(Math.random()*columns);
//           while(playerBoardData[rowIdx][colIdx].hit){
//               rowIdx = Math.floor(Math.random()*rows);
//               colIdx = Math.floor(Math.random()*columns);
//           }
//         executeAiMove(rowIdx, colIdx);
//         return;
//     }
// }
// function executeAiMove(rowIdx, colIdx) {
//     console.log("entered execute function")
//     console.log(rowIdx, colIdx)
//     const cellObj = {...playerBoardData[rowIdx][colIdx], hit:true}; //clone teh object and assign a key-pair of 'hit:true' to it. Store it in 'cellObj' variable.
//     playerBoardData[rowIdx][colIdx] = cellObj; // assign the cellObj value to the desired position
//     if (cellObj.id !== 'w') {  
//         let shipHit = playerHudData.find((ship) => ship.name === cellObj.id);
//         shipHit.size --; //reduce the ship size in the HUD
//         if(shipHit.size === 0) { //if ship is destroyed, find it in the array and assign new key pair of 'destroyed:true'
//             playerBoardData.forEach(function (rowArr, rowIdx) {
//                 rowArr.forEach(function (cellObj, colIdx) {
//                     if (cellObj.id === shipHit.name) {
//                         cellObj = {...playerBoardData[rowIdx][colIdx], destroyed:true}; //clone teh object and assign a key-pair of 'destroyed:true' to it. Store it in 'cellObj' variable.
//                         playerBoardData[rowIdx][colIdx] = cellObj;
//                     }
//                 })
//             })
//         }
//         // console.log(rowIdx, colIdx)
//         // console.log(document.getElementById(`p${rowIdx}${colIdx}`))
//         document.getElementById(`p${rowIdx}${colIdx}`).classList.add(shipHit.name);
//     }
//     winner = getWinner();
//     turn *= -1;
//     render();
// }
