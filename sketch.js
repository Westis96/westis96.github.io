
let playingGame = false;
let youWin = false;
let winText;
let dims = 800;
let numberOfSquares = 8;
let numberOfPieces = 6;
let squareDims = dims/numberOfSquares;
let pieceDims = squareDims*0.8;
let pieceImg = [];
let chessGrid;
let whitePieces = [];
let blackPieces = [];
let whiteHasMove = true;
let whiteHasMoved = false;
let whiteKingChecked = false;
let blackKingChecked = false;
let whiteCheckMated = false;
let blackCheckMated = false;
let arr = [];
const lightSquareColor = [255, 227, 178];
const darkSquareColor = [153, 96, 55];
const lightSquareColorSelected = [135, 114, 85, 40];
const darkSquareColorSelected = [77, 48, 28, 40];
const pieceNames = ["White-King","White-Queen","White-Rook","White-Bishop","White-Knight","White-Pawn", "Black-King","Black-Queen","Black-Rook","Black-Bishop","Black-Knight","Black-Pawn"];



function setup() {
  if(window.innerWidth > window.innerHeight) {
    dims = window.innerHeight;
  } else {
    dims = window.innerWidth;
  }

  squareDims = dims/numberOfSquares;
  pieceDims = squareDims*0.8;
  createCanvas(dims, dims);
  imageMode(CENTER);
  background(10, 10, 10);
  chessGrid = new Grid("Chess", numberOfSquares, numberOfPieces);
  for (let i = 0; i<16; i++) {
    blackPieces[i] = new Piece(chessGrid.squares[i], i, "Black");
  }
  for (let i = 0; i<16; i++) {
    whitePieces[i] = new Piece(chessGrid.squares[48+i], 48+i, "White");
  }
  arr = chessGrid.squares.splice();
  chessGrid.history[0] = arr;
}

function draw() {
  chessGrid.display();
  for (let i = 0; i < whitePieces.length; i++) {
    whitePieces[i].display();
  }
  for (let i = 0; i < blackPieces.length; i++) {
    blackPieces[i].display();
  }
  
}

function preload() {
  for (let i = 0; i<numberOfPieces; i++) {
    pieceImg[i] = loadImage('assets/w_' + i + '.png');
  }
  for (let i = 0; i<numberOfPieces; i++) {
    pieceImg[numberOfPieces+i] = loadImage('assets/b_' + i + '.png');
  }
}

function windowResized() {
  if(window.innerWidth > window.innerHeight) {
    dims = window.innerHeight;
  } else {
    dims = window.innerWidth;
  }
  squareDims = dims/numberOfSquares;
  pieceDims = squareDims*0.8;
  resizeCanvas(dims, dims);
}

function mousePressed() {
  console.log("mousePressed!");
  for(let j=0; j < numberOfSquares; j++) {
    for(let i=0; i < numberOfSquares; i++) {
      if((mouseX > i*squareDims && mouseX < i*squareDims+squareDims) && mouseY > j*squareDims && mouseY < j*squareDims+squareDims){
        if(whiteHasMove) {
          chessGrid.update();
          if(chessGrid.isWhitePiece(j*numberOfSquares + i)) {
            chessGrid.select(j*numberOfSquares + i);
          } else if(chessGrid.selectedPiece.col == "White" && chessGrid.selectedPiece.pos != (j*numberOfSquares + i) && chessGrid.selectedPiece.move(j*numberOfSquares + i)) {
            for (let b = 0; b < blackPieces.length; b++) {
              if(blackPieces[b].pos == (j*numberOfSquares + i)) {
                blackPieces[b].pos = -1;
                blackPieces[b].alive = false;
                blackPieces[b].canMoveTo = [-1];
              }
              blackPieces[b].history.push([blackPieces[b].pos, blackPieces[b].firstMove, blackPieces[b].alive]);
              blackPieces[b].update();
            }
            for (let w = 0; w < whitePieces.length; w++) {
              whitePieces[w].update();
              whitePieces[w].history.push([whitePieces[w].pos, whitePieces[w].firstMove, whitePieces[w].alive]);
            }
            whiteHasMove = false;
            chessGrid.update();
            let oldArr = chessGrid.squares.slice();
            chessGrid.history.push(oldArr);
          }        
        } else { //BlackHasMove
          chessGrid.update();
          if(chessGrid.isBlackPiece(j*numberOfSquares + i)) {
            chessGrid.select(j*numberOfSquares + i);
          } else if(chessGrid.selectedPiece.col == "Black" && chessGrid.selectedPiece.pos != (j*numberOfSquares + i) && chessGrid.selectedPiece.move(j*numberOfSquares + i)) {
            for (let w = 0; w < whitePieces.length; w++) {
              if(whitePieces[w].pos == (j*numberOfSquares + i)) {
                whitePieces[w].pos = -1;
                whitePieces[w].alive = false;
                whitePieces[w].canMoveTo = [-1];
              }
              whitePieces[w].history.push([whitePieces[w].pos, whitePieces[w].firstMove, whitePieces[w].alive]);
              whitePieces[w].update();
            }
            for (let b = 0; b < blackPieces.length; b++) {
              blackPieces[b].update();
              blackPieces[b].history.push([blackPieces[b].pos, blackPieces[b].firstMove, blackPieces[b].alive]);
            }
            whiteHasMove = true;
            chessGrid.update();
            let oldArr = chessGrid.squares.slice();
            chessGrid.history.push(oldArr);
          }
        }
      }      
    }
  } 
}

