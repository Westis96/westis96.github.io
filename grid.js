function Grid(type, numberOfSquares, numberOfPieces) {
  this.type = type;
  this.numberOfSquares = numberOfSquares;
  this.numberOfPieces = numberOfPieces;
  this.selectedSquares = [];
  this.previousSquare = -1;
  this.nonePiece = new Piece(-1, -1, "None");
  this.selectedPiece = this.nonePiece;
  this.squares = [8, 10, 9, 7, 6, 9, 10, 8, 
    11, 11, 11, 11, 11, 11, 11, 11, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    5, 5, 5, 5, 5, 5, 5, 5, 
    2, 4, 3, 1, 0, 3, 4, 2];
  this.noWhiteAtacking = [false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false,  
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false];
  this.whiteAtacking = this.noWhiteAtacking.slice();
  this.noBlackAtacking = [false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false,  
    false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false];
  this.blackAtacking = this.noBlackAtacking.slice();
  this.history = [];

  this.update = function(){
    blackKingChecked = false;
    whiteKingChecked = false;
    for (let i = 0; i < blackPieces.length; i++) {
      if(blackPieces[i].alive == true) {
        blackPieces[i].update();
      }
    }
    for (let i = 0; i < whitePieces.length; i++) {
      if(whitePieces[i].alive == true) {
        whitePieces[i].update();
      }
    }
    this.whiteAtacking = this.noWhiteAtacking.slice();
    this.blackAtacking = this.noBlackAtacking.slice();
    let attack = [-1];
    let availableMoves = [-1];
    for (let i = 0; i < blackPieces.length; i++) {
      if(blackPieces[i].alive == true && !blackPieces[i].ghost) {
        attack = attack.concat(blackPieces[i].attacking); 
      }
    }
    attack = attack.filter(x => (x > -1 && x < 64));
    for (let i = 0; i < attack.length; i++) {
      ind = attack[i];
      this.blackAtacking[ind] = true;
    }
    for (let i = 0; i < blackPieces.length; i++) {
      if(blackPieces[i].alive == true) {
        blackPieces[i].update();
        availableMoves = availableMoves.concat(blackPieces[i].canMoveTo); 
        availableMoves = availableMoves.filter(x => x != blackPieces[i].pos);
      }
    }
    availableMoves = availableMoves.filter(x => (x > -1 && x < 64));
    for (let i = 0; i < whitePieces.length; i++) {
      if(whitePieces[i].alive == true && whitePieces[i].checkCheck()) {
        blackKingChecked = true;
      }
    }
    if(availableMoves.length < 1) {
      if(blackKingChecked) {
        console.log("CHECKMATE! White Won");
        blackCheckMated = true;
      } else {
        console.log("STALEMATE!");
      }
    } else if(blackKingChecked) {
      console.log("CHECK!");
    }
    attack = [-1];
    availableMoves = [-1];
    for (let i = 0; i < whitePieces.length; i++) {
      if(whitePieces[i].alive == true && !whitePieces[i].ghost) {
        attack = attack.concat(whitePieces[i].attacking); //&& pawns 
      }
    }
    attack = attack.filter(x => (x > -1 && x < 64));
    for (let i = 0; i < attack.length; i++) {
      ind = attack[i];
      this.whiteAtacking[ind] = true;
    }
    for (let i = 0; i < whitePieces.length; i++) {
      if(whitePieces[i].alive == true) {
        whitePieces[i].update();
        availableMoves = availableMoves.concat(whitePieces[i].canMoveTo); 
        availableMoves = availableMoves.filter(x => x != whitePieces[i].pos);
      }
    }
    availableMoves = availableMoves.filter(x => (x > -1 && x < 64));
    for (let i = 0; i < blackPieces.length; i++) {
      if(blackPieces[i].alive == true && blackPieces[i].checkCheck()) {
        whiteKingChecked = true;
      }
    }
    if(availableMoves.length < 1) {
      if(whiteKingChecked) {
        console.log("CHECKMATE! Black Won");
        whiteCheckMated = true;
      } else {
        console.log("STALEMATE!");
      }
    } else if(whiteKingChecked) {
      console.log("CHECK!");
    }
  }

  this.goBack = function(when) {
    this.selectedPiece = this.nonePiece;
    this.selectedSquares = [];
    if(when%2 == 0) {
      whiteHasMove = true;
    } else {
      whiteHasMove = false;
    }
    for (let i = 0; i < blackPieces.length; i++) {
      blackPieces[i].setPos(blackPieces[i].history[when][0]);
      blackPieces[i].firstMove = blackPieces[i].history[when][1];
      blackPieces[i].alive = blackPieces[i].history[when][2];
      blackPieces[i].history = blackPieces[i].history.slice(0,when+1);
    }
    for (let i = 0; i < whitePieces.length; i++) {
      whitePieces[i].setPos(whitePieces[i].history[when][0]);
      whitePieces[i].firstMove = whitePieces[i].history[when][1];
      whitePieces[i].alive = whitePieces[i].history[when][2];
      whitePieces[i].history = whitePieces[i].history.slice(0,when+1);
    }
    for (let i = 0; i < blackPieces.length; i++) {
      blackPieces[i].update(); 
    }
    for (let i = 0; i < whitePieces.length; i++) {
      whitePieces[i].update(); 
    }
    this.update();
  }

  this.display = function() {
    let i;
    let j;
    let evenRow;
    let pos;
    for(j=0; j < numberOfSquares; j++) {
      for(i=0; i < numberOfSquares; i++) {
        evenRow = j%2;
        pos = j*numberOfSquares + i;
        if((evenRow && (pos)%2) || (!evenRow && (i+1)%2)) {
          if (this.selected(pos)) {
            fill(lightSquareColorSelected);
          } else {
            fill(lightSquareColor);
          }
        }
        else {  
          if (this.selected(pos)) {
            fill(darkSquareColorSelected);
          } else {
            fill(darkSquareColor);
          }      
        }
        rect(i*squareDims, j*squareDims , squareDims-1, squareDims-1);
      }
    }
  }

  this.isWhitePiece = function(pos) {
    for (let i = 0; i < whitePieces.length; i++) {
      if(whitePieces[i].alive == true) {
        if(whitePieces[i].pos == pos) {
          return true;
        }
      }
    }
    return false;
  }

  this.isBlackPiece = function(pos) {
    for (let i = 0; i < blackPieces.length; i++) {
      if(blackPieces[i].alive == true) {
        if(blackPieces[i].pos == pos) {
          return true;
        }
      }
    }
    return false;
  }

  this.isPiece = function(pos) {
    if(this.isWhitePiece(pos) || this.isBlackPiece(pos)) {
      return true;
    } else {
      return false;
    } 
  }

  this.selected = function(pos) {
    for (let i = 0; i < this.selectedSquares.length; i++) {
      if (this.selectedSquares[i] == pos) {
        return true;
      }
    }
    return false;
  }

  this.select = function(selection) {
    if(this.isPiece(selection)) { //Select as piece.
      if(this.isWhitePiece(selection)) {
        for (let i = 0; i < whitePieces.length; i++) {
          whitePieces[i].update();
          if(selection == whitePieces[i].pos && whitePieces[i].alive) {
            this.selectedPiece = whitePieces[i];
            this.selectedSquares = [selection];
            this.selectedSquares = this.selectedSquares.concat(this.selectedPiece.canMoveTo);
          }
        }
      } else { //Black
        for (let i = 0; i < blackPieces.length; i++) {
          blackPieces[i].update();
          if(selection == blackPieces[i].pos && blackPieces[i].alive) {
            this.selectedPiece = blackPieces[i];
            this.selectedSquares = [selection];
            this.selectedSquares = this.selectedSquares.concat(this.selectedPiece.canMoveTo);
          }
        }
      }
    } else { //If you want to override from console.
      this.selectedSquares.push(selection);
    }
    console.log("Selected square:" + selection);
  }
  

  
}
