/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(width, height) {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  let row = [];
  for (let i = 0; i < width; i++) {
    row.push(null);
  }

  for (let i = 0; i < height; i++) {
    board.push(row.slice());
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById('board');
  // TODO: add comment for this code

  // creates a table row element called top, sets the id to column-top which alters the css, and adds an event listener on click, that runs the function 'handleClick'. Then runs a loop to create a td element width times, and adds an id of the current count in the loop to it, and then adds them to the top element. The top element is then added to our htmlBoard. This creates our top, clickable row in the game.

  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // loops thru height times, and creates a tr element called 'row' for each loop. For each iteration of that loop, runs another loop width times, and creates a td called 'cell'. Each cell is given the id equal to its row number, and position in that row ie (0-3), etc. The cell is then appended the row. This creates essentially 6 rows, each with 7 cells. The row is appended to the htmlBoard, and then goes thru the loop again, creating our rows.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = 5; i >= 0; i--) {
    if (!(document.getElementById(`${i}-${x}`).classList.contains('taken'))) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let gamePiece = document.createElement('div');
  gamePiece.classList.add('piece');
  if (currPlayer === 1) {
    gamePiece.classList.add('player1');
  } else {
    gamePiece.classList.add('player2');
  }
  let tdCell = document.getElementById(`${y}-${x}`);
  tdCell.appendChild(gamePiece);
  tdCell.classList.add('taken');
  console.log(y, x);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  console.log(x);
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie(board)) {

    endGame('Tie Game! Try again!');
    board = [];
    resetGame();
  }

  // check for win
  if (checkForWin()) {
    setTimeout(function () {
      currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
      endGame(`Player ${currPlayer} won!`);
      board = [];
      resetGame();
    }, 300)

  }



  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

function resetGame() {
  let gameBoard = document.getElementById('board');
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
  makeBoard(WIDTH, HEIGHT);
  makeHtmlBoard();
}


function checkForTie(arr) {
  return arr.flat().every(function (val) {
    return val === 1 || val === 2;
  })
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // this loops thru the entire board every time it is clicked. Sets winning conditions for horizontal, vertical, and the diagonal axis. These are plugged into the _win function, which checks to see if every cell entered into the function is the same player. If they are, it returns true, and the game is over.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard(WIDTH, HEIGHT);
makeHtmlBoard();
