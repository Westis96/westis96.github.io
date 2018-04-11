function Piece(type, pos, col) {
  this.type = type;
  this.pos = pos;
  this.currentPos;
  this.previousPos = pos;
  this.col = col;
  this.alive = true;
  this.check = false;
  this.ghost = false;
  this.promote = false;
  this.canMoveTo = [-1];
  this.attacking = [-1];
  this.firstMove = true;
  this.history = [[this.pos, this.firstMove, this.alive]];
  this.y = floor(this.pos/numberOfSquares);
  this.x = floor(this.pos%numberOfSquares);

  this.move = function(newPos) {
    for (let i = 0; i < this.canMoveTo.length; i++) {
      if(this.checkValid(newPos) && (this.canMoveTo[i] == newPos)) { 
        this.previousPos = this.pos;
        this.pos = newPos;
        this.y = floor(this.pos/numberOfSquares);
        this.x = floor(this.pos%numberOfSquares);
        this.firstMove = false;
        if(this.type == 5 && this.y == 0) {
          this.type = 1;
        } else if(this.type == 11 && this.y == 7) {
          this.type = 7;
        }
        if(this.type == 0 && newPos == 58) {
          whitePieces[8].pos = 59;
          whitePieces[8].y = floor(whitePieces[8].pos/numberOfSquares);
          whitePieces[8].x = floor(whitePieces[8].pos%numberOfSquares);
          whitePieces[8].firstMove = false;
          chessGrid.squares[59] = 2;
          chessGrid.squares[56] = -1;
        } else if(this.type == 0 && newPos == 62) {
          whitePieces[15].pos = 61;
          whitePieces[15].y = floor(whitePieces[15].pos/numberOfSquares);
          whitePieces[15].x = floor(whitePieces[15].pos%numberOfSquares);
          whitePieces[15].firstMove = false;
          chessGrid.squares[61] = 2;
          chessGrid.squares[63] = -1;
        }
        if(this.type == 6 && newPos == 2) {
          blackPieces[0].pos = 3;
          blackPieces[0].y = floor(blackPieces[0].pos/numberOfSquares);
          blackPieces[0].x = floor(blackPieces[0].pos%numberOfSquares);
          blackPieces[0].firstMove = false;
          chessGrid.squares[3] = 8;
          chessGrid.squares[0] = -1;
        } else if(this.type == 6 && newPos == 6) {
          blackPieces[7].pos = 5;
          blackPieces[7].y = floor(blackPieces[7].pos/numberOfSquares);
          blackPieces[7].x = floor(blackPieces[7].pos%numberOfSquares);
          blackPieces[7].firstMove = false;
          chessGrid.squares[5] = 8;
          chessGrid.squares[7] = -1;
        }
        chessGrid.squares[newPos] = this.type;
        chessGrid.squares[this.previousPos] = -1;
        this.update();
        return true;
      }
    }
    return false;
  }

  this.fakeMove = function(newPos) {
    this.pos = newPos;
    this.y = floor(this.pos/numberOfSquares);
    this.x = floor(this.pos%numberOfSquares);
    if(this.col == "White") {
      for(let j = 0; j < blackPieces.length; j++) {
        if(blackPieces[j].pos == newPos && blackPieces[j].alive) {
          blackPieces[j].ghost = true;
          return true;
        }
      }
    } else { //Black
      for(let j = 0; j < whitePieces.length; j++) {
        if(whitePieces[j].pos == newPos && whitePieces[j].alive) {
          whitePieces[j].ghost = true;
          return true;
        }
      }
    }
    return false;
  }

  this.setPos = function(newPos) {
    this.pos = newPos;
  }

  this.coordsHavePos = function(y, x) {
    if(y>=0 && y<numberOfSquares && x>=0 && x<numberOfSquares) {
      return true;
    }
    return false;
  }

  this.checkCheck = function() {
    if(this.ghost || !this.alive) {
      return false;
    }
    this.check = false;
    if(this.col == "White") {
      for(let i = 0; i < this.attacking.length; i++) {
        for(let j = 0; j < blackPieces.length; j++) {
          if((blackPieces[j].type == 6) && (blackPieces[j].pos == this.attacking[i])) { 
            this.check = true;
            //console.log("Black King Checked by: " + pieceNames[this.type] + "!");
            //blackKingChecked = true;
            return true;           
          }
        }
      }
    } else { //Black
      for(let i = 0; i < this.attacking.length; i++) {
        for(let j = 0; j < whitePieces.length; j++) {
          if((whitePieces[j].type == 0) && (whitePieces[j].pos == this.attacking[i])) { 
            this.check = true;
            //console.log("White King Checked by: " + pieceNames[this.type] + "!");
            //whiteKingChecked = true;
            return true;
          }
        }
      }
    }  
    return false;  
  }

  this.updateMoves = function() {
    let coordMoves = [];
    let knightMoves = [];
    let kingMoves = [];
    let attackMoves = [];
    let coordMoves2 = [];
    this.y = floor(this.pos/numberOfSquares);
    this.x = floor(this.pos%numberOfSquares);

    //TODO Add also own pieces to this.attacking! Remove elsifelse statements.
    if(!this.alive) {
      this.canMoveTo = [];
      this.attacking = [];
      this.check = false;
      this.pos = -1;
    } else {
      switch (this.type) {
        case 0:
            //console.log("White-King");
            kingMoves = [[this.y+1, this.x], [this.y+1, this.x+1], [this.y, this.x+1], [this.y-1, this.x+1], [this.y-1, this.x], [this.y-1, this.x-1], [this.y, this.x-1], [this.y+1, this.x-1]];
            coordMoves2 = [];
            for(let i = 0; i < numberOfSquares; i++) {
              if(this.coordsHavePos(kingMoves[i][0], kingMoves[i][1])) {
                if(chessGrid.isWhitePiece(kingMoves[i][0]*numberOfSquares+kingMoves[i][1])) {
                  attackMoves.push(kingMoves[i][0]*numberOfSquares+kingMoves[i][1]);
                  continue;
                } else {
                  coordMoves2.push(kingMoves[i][0]*numberOfSquares+kingMoves[i][1]);
                  attackMoves.push(kingMoves[i][0]*numberOfSquares+kingMoves[i][1]);
                }
              }
            }
            if(this.firstMove && whitePieces[8].type == 2 && whitePieces[8].firstMove && chessGrid.squares[57] == -1 && chessGrid.squares[58] == -1 && chessGrid.squares[59] == -1) {
              coordMoves2.push(58);
            }
            if(this.firstMove && whitePieces[15].type == 2 && whitePieces[15].firstMove && chessGrid.squares[62] == -1 && chessGrid.squares[61] == -1) {
              coordMoves2.push(62);
            }
            coordMoves2 = coordMoves2.filter(x => !chessGrid.blackAtacking[x]);
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 1:
            //console.log("White-Queen");
            coordMoves = [[[this.y+1, this.x], [this.y+2, this.x], [this.y+3, this.x], [this.y+4, this.x], [this.y+5, this.x], [this.y+6, this.x], [this.y+7, this.x], [this.y+numberOfSquares, this.x]],
              [[this.y+1, this.x+1], [this.y+2, this.x+2], [this.y+3, this.x+3], [this.y+4, this.x+4], [this.y+5, this.x+5], [this.y+6, this.x+6], [this.y+7, this.x+7], [this.y+numberOfSquares, this.x+numberOfSquares]],
              [[this.y, this.x+1], [this.y, this.x+2], [this.y, this.x+3], [this.y, this.x+4], [this.y, this.x+5], [this.y, this.x+6], [this.y, this.x+7], [this.y, this.x+numberOfSquares]],
              [[this.y-1, this.x+1], [this.y-2, this.x+2], [this.y-3, this.x+3], [this.y-4, this.x+4], [this.y-5, this.x+5], [this.y-6, this.x+6], [this.y-7, this.x+7], [this.y-numberOfSquares, this.x+numberOfSquares]],
              [[this.y-1, this.x], [this.y-2, this.x], [this.y-3, this.x], [this.y-4, this.x], [this.y-5, this.x], [this.y-6, this.x], [this.y-7, this.x], [this.y-numberOfSquares, this.x]],
              [[this.y-1, this.x-1], [this.y-2, this.x-2], [this.y-3, this.x-3], [this.y-4, this.x-4], [this.y-5, this.x-5], [this.y-6, this.x-6], [this.y-7, this.x-7], [this.y-numberOfSquares, this.x-numberOfSquares]],
              [[this.y, this.x-1], [this.y, this.x-2], [this.y, this.x-3], [this.y, this.x-4], [this.y, this.x-5], [this.y, this.x-6], [this.y, this.x-7], [this.y, this.x-numberOfSquares]],
              [[this.y+1, this.x-1], [this.y+2, this.x-2], [this.y+3, this.x-3], [this.y+4, this.x-4], [this.y+5, this.x-5], [this.y+6, this.x-6], [this.y+7, this.x-7], [this.y+numberOfSquares, this.x-numberOfSquares]]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < numberOfSquares; i++) {
              Inner:
              for(let j = 0; j < numberOfSquares; j++) {
                if(this.coordsHavePos(coordMoves[i][j][0], coordMoves[i][j][1])) {
                  if(chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(!chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]) && !chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])){
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                  }
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 2:
            //console.log("White-Rook");
            coordMoves = [[[this.y+1, this.x], [this.y+2, this.x], [this.y+3, this.x], [this.y+4, this.x], [this.y+5, this.x], [this.y+6, this.x], [this.y+7, this.x], [this.y+numberOfSquares, this.x]],
              [[this.y, this.x+1], [this.y, this.x+2], [this.y, this.x+3], [this.y, this.x+4], [this.y, this.x+5], [this.y, this.x+6], [this.y, this.x+7], [this.y, this.x+numberOfSquares]],
              [[this.y-1, this.x], [this.y-2, this.x], [this.y-3, this.x], [this.y-4, this.x], [this.y-5, this.x], [this.y-6, this.x], [this.y-7, this.x], [this.y-numberOfSquares, this.x]],
              [[this.y, this.x-1], [this.y, this.x-2], [this.y, this.x-3], [this.y, this.x-4], [this.y, this.x-5], [this.y, this.x-6], [this.y, this.x-7], [this.y, this.x-numberOfSquares]]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < 4; i++) {
              Inner:
              for(let j = 0; j < numberOfSquares; j++) {
                if(this.coordsHavePos(coordMoves[i][j][0], coordMoves[i][j][1])) {
                  if(chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  } 
                  if(!chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]) && !chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])){
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                  }
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 3:
            //console.log("White-Bishop");
            coordMoves = [[[this.y+1, this.x+1], [this.y+2, this.x+2], [this.y+3, this.x+3], [this.y+4, this.x+4], [this.y+5, this.x+5], [this.y+6, this.x+6], [this.y+7, this.x+7], [this.y+numberOfSquares, this.x+numberOfSquares]],
              [[this.y-1, this.x+1], [this.y-2, this.x+2], [this.y-3, this.x+3], [this.y-4, this.x+4], [this.y-5, this.x+5], [this.y-6, this.x+6], [this.y-7, this.x+7], [this.y-numberOfSquares, this.x+numberOfSquares]],
              [[this.y-1, this.x-1], [this.y-2, this.x-2], [this.y-3, this.x-3], [this.y-4, this.x-4], [this.y-5, this.x-5], [this.y-6, this.x-6], [this.y-7, this.x-7], [this.y-numberOfSquares, this.x-numberOfSquares]],
              [[this.y+1, this.x-1], [this.y+2, this.x-2], [this.y+3, this.x-3], [this.y+4, this.x-4], [this.y+5, this.x-5], [this.y+6, this.x-6], [this.y+7, this.x-7], [this.y+numberOfSquares, this.x-numberOfSquares]]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < 4; i++) {
              Inner:
              for(let j = 0; j < numberOfSquares; j++) {
                if(this.coordsHavePos(coordMoves[i][j][0], coordMoves[i][j][1])) {
                  if(chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  } 
                  if(!chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]) && !chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])){
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                  }
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 4:
            //console.log("White-Knight");
            knightMoves = [[this.y+2, this.x+1], [this.y+1, this.x+2], [this.y-1, this.x+2], [this.y-2, this.x+1], [this.y-2, this.x-1], [this.y-1, this.x-2], [this.y+1, this.x-2], [this.y+2, this.x-1]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < knightMoves.length; i++) {
              if(this.coordsHavePos(knightMoves[i][0], knightMoves[i][1])) {
                attackMoves.push(knightMoves[i][0]*numberOfSquares+knightMoves[i][1]);
                if(!(chessGrid.isWhitePiece(knightMoves[i][0]*numberOfSquares+knightMoves[i][1]))) {
                  coordMoves2.push(knightMoves[i][0]*numberOfSquares+knightMoves[i][1]);
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 5:
            //console.log("White-Pawn");
            coordMoves2 = [];
            if(this.firstMove && !chessGrid.isPiece(this.pos-numberOfSquares) && !chessGrid.isPiece(this.pos-numberOfSquares*2)) {
              coordMoves2.push(this.pos-numberOfSquares);
              coordMoves2.push(this.pos-numberOfSquares*2);
            } else if(!chessGrid.isPiece(this.pos-numberOfSquares)) {
              coordMoves2.push(this.pos-numberOfSquares);
            }
            if(chessGrid.isBlackPiece((this.y-1)*numberOfSquares+(this.x+1))) {
              coordMoves2.push((this.y-1)*numberOfSquares+(this.x+1));
            }
            if(chessGrid.isBlackPiece((this.y-1)*numberOfSquares+(this.x-1))) {
              coordMoves2.push((this.y-1)*numberOfSquares+(this.x-1));
            } 
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = this.canMoveTo.slice();
            if(this.x+1 < numberOfSquares) {
              this.attacking.push((this.y-1)*numberOfSquares+(this.x+1));
            }
            if(this.x-1 > -1) {
              this.attacking.push((this.y-1)*numberOfSquares+(this.x-1));
            }
            this.attacking = this.attacking.filter(x => x != (this.pos - numberOfSquares)).filter(x => x != (this.pos - numberOfSquares*2));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 6:
            //console.log("Black-King");
            kingMoves = [[this.y+1, this.x], [this.y+1, this.x+1], [this.y, this.x+1], [this.y-1, this.x+1], [this.y-1, this.x], [this.y-1, this.x-1], [this.y, this.x-1], [this.y+1, this.x-1]];
            coordMoves2 = [];
            for(let i = 0; i < numberOfSquares; i++) {
              if(this.coordsHavePos(kingMoves[i][0], kingMoves[i][1])) {
                if(chessGrid.isBlackPiece(kingMoves[i][0]*numberOfSquares+kingMoves[i][1])) {
                  attackMoves.push(kingMoves[i][0]*numberOfSquares+kingMoves[i][1]);
                  continue;
                } else {
                  coordMoves2.push(kingMoves[i][0]*numberOfSquares+kingMoves[i][1]);
                  attackMoves.push(kingMoves[i][0]*numberOfSquares+kingMoves[i][1]);
                }
              }
            }
            if(this.firstMove && blackPieces[0].type == 8 && blackPieces[0].firstMove && chessGrid.squares[1] == -1 && chessGrid.squares[2] == -1 && chessGrid.squares[3] == -1) {
              coordMoves2.push(2);
            }
            if(this.firstMove && blackPieces[7].type == 8 && blackPieces[7].firstMove && chessGrid.squares[5] == -1 && chessGrid.squares[6] == -1) {
              coordMoves2.push(6);
            }
            coordMoves2 = coordMoves2.filter(pos => !chessGrid.whiteAtacking[pos]);
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 7:
            //console.log("Black-Queen");
            coordMoves = [[[this.y+1, this.x], [this.y+2, this.x], [this.y+3, this.x], [this.y+4, this.x], [this.y+5, this.x], [this.y+6, this.x], [this.y+7, this.x], [this.y+numberOfSquares, this.x]],
              [[this.y+1, this.x+1], [this.y+2, this.x+2], [this.y+3, this.x+3], [this.y+4, this.x+4], [this.y+5, this.x+5], [this.y+6, this.x+6], [this.y+7, this.x+7], [this.y+numberOfSquares, this.x+numberOfSquares]],
              [[this.y, this.x+1], [this.y, this.x+2], [this.y, this.x+3], [this.y, this.x+4], [this.y, this.x+5], [this.y, this.x+6], [this.y, this.x+7], [this.y, this.x+numberOfSquares]],
              [[this.y-1, this.x+1], [this.y-2, this.x+2], [this.y-3, this.x+3], [this.y-4, this.x+4], [this.y-5, this.x+5], [this.y-6, this.x+6], [this.y-7, this.x+7], [this.y-numberOfSquares, this.x+numberOfSquares]],
              [[this.y-1, this.x], [this.y-2, this.x], [this.y-3, this.x], [this.y-4, this.x], [this.y-5, this.x], [this.y-6, this.x], [this.y-7, this.x], [this.y-numberOfSquares, this.x]],
              [[this.y-1, this.x-1], [this.y-2, this.x-2], [this.y-3, this.x-3], [this.y-4, this.x-4], [this.y-5, this.x-5], [this.y-6, this.x-6], [this.y-7, this.x-7], [this.y-numberOfSquares, this.x-numberOfSquares]],
              [[this.y, this.x-1], [this.y, this.x-2], [this.y, this.x-3], [this.y, this.x-4], [this.y, this.x-5], [this.y, this.x-6], [this.y, this.x-7], [this.y, this.x-numberOfSquares]],
              [[this.y+1, this.x-1], [this.y+2, this.x-2], [this.y+3, this.x-3], [this.y+4, this.x-4], [this.y+5, this.x-5], [this.y+6, this.x-6], [this.y+7, this.x-7], [this.y+numberOfSquares, this.x-numberOfSquares]]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < numberOfSquares; i++) {
              Inner:
              for(let j = 0; j < numberOfSquares; j++) {
                if(this.coordsHavePos(coordMoves[i][j][0], coordMoves[i][j][1])) {
                  if(chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  } 
                  if(!chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]) && !chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                  }
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 8:
            //console.log("Black-Rook");
            coordMoves = [[[this.y+1, this.x], [this.y+2, this.x], [this.y+3, this.x], [this.y+4, this.x], [this.y+5, this.x], [this.y+6, this.x], [this.y+7, this.x], [this.y+numberOfSquares, this.x]],
              [[this.y, this.x+1], [this.y, this.x+2], [this.y, this.x+3], [this.y, this.x+4], [this.y, this.x+5], [this.y, this.x+6], [this.y, this.x+7], [this.y, this.x+numberOfSquares]],
              [[this.y-1, this.x], [this.y-2, this.x], [this.y-3, this.x], [this.y-4, this.x], [this.y-5, this.x], [this.y-6, this.x], [this.y-7, this.x], [this.y-numberOfSquares, this.x]],
              [[this.y, this.x-1], [this.y, this.x-2], [this.y, this.x-3], [this.y, this.x-4], [this.y, this.x-5], [this.y, this.x-6], [this.y, this.x-7], [this.y, this.x-numberOfSquares]]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < 4; i++) {
              Inner:
              for(let j = 0; j < numberOfSquares; j++) {
                if(this.coordsHavePos(coordMoves[i][j][0], coordMoves[i][j][1])) {
                  if(chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(chessGrid.isWhitePiece(coordMoves[i][j][0] * numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  } 
                  if(!chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]) && !chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) { 
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                  }
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 9:
            //console.log("Black-Bishop");
            coordMoves = [[[this.y+1, this.x+1], [this.y+2, this.x+2], [this.y+3, this.x+3], [this.y+4, this.x+4], [this.y+5, this.x+5], [this.y+6, this.x+6], [this.y+7, this.x+7], [this.y+numberOfSquares, this.x+numberOfSquares]],
              [[this.y-1, this.x+1], [this.y-2, this.x+2], [this.y-3, this.x+3], [this.y-4, this.x+4], [this.y-5, this.x+5], [this.y-6, this.x+6], [this.y-7, this.x+7], [this.y-numberOfSquares, this.x+numberOfSquares]],
              [[this.y-1, this.x-1], [this.y-2, this.x-2], [this.y-3, this.x-3], [this.y-4, this.x-4], [this.y-5, this.x-5], [this.y-6, this.x-6], [this.y-7, this.x-7], [this.y-numberOfSquares, this.x-numberOfSquares]],
              [[this.y+1, this.x-1], [this.y+2, this.x-2], [this.y+3, this.x-3], [this.y+4, this.x-4], [this.y+5, this.x-5], [this.y+6, this.x-6], [this.y+7, this.x-7], [this.y+numberOfSquares, this.x-numberOfSquares]]];
            coordMoves2 = [this.pos];
            for(let i = 0; i < 4; i++) {
              Inner:
              for(let j = 0; j < numberOfSquares; j++) {
                if(this.coordsHavePos(coordMoves[i][j][0], coordMoves[i][j][1])) {
                  if(chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  }
                  if(chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) {
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    break Inner;
                  } 
                  if(!chessGrid.isBlackPiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]) && !chessGrid.isWhitePiece(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1])) { 
                    coordMoves2.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                    attackMoves.push(coordMoves[i][j][0]*numberOfSquares+coordMoves[i][j][1]);
                  }
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 10:
            //console.log("Black-Knight");
            knightMoves = [[this.y+2, this.x+1], [this.y+1, this.x+2], [this.y-1, this.x+2], [this.y-2, this.x+1], [this.y-2, this.x-1], [this.y-1, this.x-2], [this.y+1, this.x-2], [this.y+2, this.x-1]];
            coordMoves2 = [];
            for(let i = 0; i < knightMoves.length; i++) {
              if(this.coordsHavePos(knightMoves[i][0], knightMoves[i][1])) {
                attackMoves.push(knightMoves[i][0]*numberOfSquares+knightMoves[i][1]);
                if(!(chessGrid.isBlackPiece(knightMoves[i][0]*numberOfSquares+knightMoves[i][1]))) {
                  coordMoves2.push(knightMoves[i][0]*numberOfSquares+knightMoves[i][1]);
                }
              }
            }
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = attackMoves.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
        case 11:
            //console.log("Black-Pawn");
            coordMoves2 = [];
            if(this.firstMove && !chessGrid.isPiece(this.pos+numberOfSquares) && !chessGrid.isPiece(this.pos+numberOfSquares*2)) {
              coordMoves2.push(this.pos+numberOfSquares);
              coordMoves2.push(this.pos+numberOfSquares*2);
            } else if(!chessGrid.isPiece(this.pos+numberOfSquares)) {
              coordMoves2.push(this.pos+numberOfSquares);
            }
            if(chessGrid.isWhitePiece((this.y+1)*numberOfSquares+(this.x+1))) {
              coordMoves2.push((this.y+1)*numberOfSquares+(this.x+1));
            }
            if(chessGrid.isWhitePiece((this.y+1)*numberOfSquares+(this.x-1))) {
              coordMoves2.push((this.y+1)*numberOfSquares+(this.x-1));
            } 
            this.canMoveTo = coordMoves2.filter(x => x != this.pos).filter(x => (x > -1 && x < numberOfSquares*numberOfSquares));
            this.attacking = this.canMoveTo.slice();
            if(this.x+1 < numberOfSquares) {
              this.attacking.push((this.y+1)*numberOfSquares+(this.x+1));
            }
            if(this.x-1 > -1) {
              this.attacking.push((this.y+1)*numberOfSquares+(this.x-1));
            }
            this.attacking = this.attacking.filter(x => x != (this.pos + numberOfSquares)).filter(x => x != (this.pos + numberOfSquares*2));
            if(this.ghost) {
              this.canMoveTo = [];
              this.attacking = [];
            }
            break;
      }
    }
  }

  this.update = function() {
    this.y = floor(this.pos/numberOfSquares);
    this.x = floor(this.pos%numberOfSquares);
    this.updateMoves();
    let valid = [];
    this.currentPos = this.pos;
    let currentMoves = this.canMoveTo.slice();
    if(this.col == "White" && this.alive) {
      if(true) { //whiteKing
        for(let i = 0; i < currentMoves.length; i++) {
          this.fakeMove(currentMoves[i]);
          for(let j = 0; j < blackPieces.length; j++) {
            blackPieces[j].updateMoves();
          }
          if(blackPieces.every(x => !(x.checkCheck()))) {
            valid.push(currentMoves[i]);
          }
          for(let j = 0; j < blackPieces.length; j++) {
            blackPieces[j].ghost = false;
          }
          for(let j = 0; j < blackPieces.length; j++) {
            blackPieces[j].updateMoves();
            blackPieces[j].checkCheck();
          }
        }
      }
      this.pos = this.currentPos;
      for(let j = 0; j < blackPieces.length; j++) {
        blackPieces[j].updateMoves();
        blackPieces[j].checkCheck();
      }
    } else if(this.col == "Black" && this.alive) { //Black
      if(true) { //blackKing
        for(let i = 0; i < currentMoves.length; i++) {
          this.fakeMove(currentMoves[i]);
          for(let j = 0; j < whitePieces.length; j++) {
            whitePieces[j].updateMoves();
          }
          if(whitePieces.every(x => !(x.checkCheck()))) {
            valid.push(currentMoves[i]);
          }
          for(let j = 0; j < whitePieces.length; j++) {
            whitePieces[j].ghost = false;
          }
          for(let j = 0; j < whitePieces.length; j++) {
            whitePieces[j].updateMoves();
            whitePieces[j].checkCheck();
          }
        }
      }
      this.pos = this.currentPos;
      for(let j = 0; j < whitePieces.length; j++) {
          whitePieces[j].updateMoves();
          whitePieces[j].checkCheck();
      }
    }
    if(this.alive && !this.ghost) {
      this.pos = this.currentPos;
      this.canMoveTo = valid;
      this.check = this.checkCheck();
    } else if(this.ghost) {
      this.pos = -1;
      this.canMoveTo = [];
      this.attacking = [];
      this.check = this.checkCheck();
    }
    if(this.check) {
      console.log("CHECK!");
    }
  }
  

  this.display = function() {
    this.y = floor(this.pos/numberOfSquares);
    this.x = floor(this.pos%numberOfSquares);
    if(this.pos >= 0) {
      image(pieceImg[this.type], (this.x*squareDims+squareDims/2+1), (this.y*squareDims+squareDims/2+1), pieceDims, pieceDims);
    }
  }

  this.checkValid = function() {
    if((pos >= 0 && pos < numberOfSquares*numberOfSquares)) {
      return true;
    }
    console.log("Not Valid position!");
    return false;
  }


}
