/* 
 *   JavaScript Chess 
 *   
 *   Author: Stefan Alenius 2016-11-18 -- 
 */


/*
 *   Known issues
 *
 *   Castling
 *   En Passant
 *   Promotion
 *   Pawn jumps over pieces when making doublestep move
 *   GUI: Drag'n'Drop
 *   Faster movegeneration
 *   faster search?
 *   
 */




/*
 *   Opening Book
 */

var book=[
    { position : "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR W", move: {from: "e2", to: "e4", promote: ""} },
    { position : "rnbqkbnrpppppppp                    P           PPPP PPPRNBQKBNR B", move: {from: "e7", to: "e5", promote: ""} },
    { position : "rnbqkbnrpppp ppp            p       P           PPPP PPPRNBQKBNR B", move: {from: "g1", to: "f3", promote: ""} },
    { position : "rnbqkbnrpppp ppp            p       P        N  PPPP PPPRNBQKB R B", move: {from: "b8", to: "c6", promote: ""} },
    { position : "r bqkbnrpppp ppp  n         p       P        N  PPPP PPPRNBQKB R B", move: {from: "f1", to: "b5", promote: ""} }
];

function GetBoardString(board)
{
    return board["a8"]+board["b8"]+board["c8"]+board["d8"]+board["e8"]+board["f8"]+board["g8"]+board["h8"]+
           board["a7"]+board["b7"]+board["c7"]+board["d7"]+board["e7"]+board["f7"]+board["g7"]+board["h7"]+
           board["a6"]+board["b6"]+board["c6"]+board["d6"]+board["e6"]+board["f6"]+board["g6"]+board["h6"]+
           board["a5"]+board["b5"]+board["c5"]+board["d5"]+board["e5"]+board["f5"]+board["g5"]+board["h5"]+
           board["a4"]+board["b4"]+board["c4"]+board["d4"]+board["e4"]+board["f4"]+board["g4"]+board["h4"]+
           board["a3"]+board["b3"]+board["c3"]+board["d3"]+board["e3"]+board["f3"]+board["g3"]+board["h3"]+
           board["a2"]+board["b2"]+board["c2"]+board["d2"]+board["e2"]+board["f2"]+board["g2"]+board["h2"]+
           board["a1"]+board["b1"]+board["c1"]+board["d1"]+board["e1"]+board["f1"]+board["g1"]+board["h1"]+
           " " + board.tomove;
}

function GetBookMove(board)
{
    var boardstr=GetBoardString(board);
    var move = {from: "a1", to: "a1", promote: ""};

    for(var i=0;i<book.length;i++) {
        if(boardstr==book[i].position) {
            move = book[i].move;
            console.log(move);
        }
    }
    return move;
}





/*
 *   Initializers
 */

function GenerateSquares()
{
    var alfa = ["a", "b", "c", "d", "e", "f", "g", "h"];
    var num = ["1", "2", "3", "4", "5", "6", "7", "8"];
    var squares = [];

    for(var a=0;a<alfa.length;a++)
      for(var n=0;n<num.length;n++)
        squares.push(alfa[a]+num[n]);
    return squares;
}

function GenerateSquareIndex()
{
    var squareindex = {};
    
    var alfa = ["a", "b", "c", "d", "e", "f", "g", "h"];
    var num = ["1", "2", "3", "4", "5", "6", "7", "8"];
    var squares = [];

    for(var a=0;a<alfa.length;a++)
      for(var n=0;n<num.length;n++)
        squareindex[alfa[a]+num[n]]=a*alfa.length+n;
    return squareindex;
}

function GetSquareIndex(square,squareindex)
{
    return squareindex[square];
}

function GenerateKnightMove(from,to)
{
    var knightmove = { "from":from, "to":to, promote:"" };
    return knightmove;
}

function GenerateKnightMoves(squares)
{
    var knightmoves = {};
    var knightmove = {};
    var knightoffsets = [ -17, -15, -10, -6, 6, 10, 15, 17 ]; 

    for(var i=0;i<squares.length;i++)
    {
        knightmoves[squares[i]]=[];
        for(var o=0;o<knightoffsets.length;o++) 
        {
            if( i + knightoffsets[o] > -1 && i + knightoffsets[o] < 64 &&
                Math.abs(i%8 - (i+knightoffsets[o])%8) < 3
              ) 
            {
                knightmoves[squares[i]].push(GenerateKnightMove(squares[i],squares[i+knightoffsets[o]]));
            }
        }
    }
    return knightmoves;
}



/*
 *  General readability functions
 */
function isWhiteToMove(board)
{
    return (board.tomove=="W");
}

function isBlackToMove(board)
{
    return ( !isWhiteToMove(board) );
}



/*
 *  Move Generator
 */

/*
 *  TODO: Castling
 */
function AddKingMovesToMoveList(element,board,squares,squareindex,movelist)
{
    var offsets = [ -9, -8, -7, -1, +1, +7, +8, +9 ];
    var validmoves = [];

    for(var o=0;o<offsets.length;o++)
    {
        if(GetSquareIndex(element,squareindex)+offsets[o] > -1 &&
           GetSquareIndex(element,squareindex)+offsets[o] < 64 &&
           Math.abs((GetSquareIndex(element,squareindex))%8 - (GetSquareIndex(element,squareindex)+offsets[o])%8) < 2)
        {
            if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]]]==" " ||
               (isWhiteToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]]].toLowerCase()) ||
               (isBlackToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]]].toUpperCase()))
            {
                validmoves.push({from:element,to:squares[GetSquareIndex(element,squareindex)+offsets[o]],promote:""});
            }
        }
    }
    Array.prototype.push.apply(movelist,validmoves);
}

/*
 *   This should be possible to speed up A LOT... just not sure how right now...
 */
function AddQueenMovesToMoveList(element,board,squares,squareindex,movelist)
{
    var offsets = [ -9, -8, -7, -1, +1, +7, +8, +9 ];
    var validmoves = [];

    for(var o=0;o<offsets.length;o++)
    {
        for(var l=1;l<8;l++) 
        {
            if(GetSquareIndex(element,squareindex)+offsets[o]*l > -1 &&
               GetSquareIndex(element,squareindex)+offsets[o]*l < 64 &&
               Math.abs((GetSquareIndex(element,squareindex)+offsets[o]*(l-1))%8 - (GetSquareIndex(element,squareindex)+offsets[o]*l)%8) < 2)
            {
                if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==" " ||
                   (isWhiteToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]].toLowerCase()) ||
                   (isBlackToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]].toUpperCase()))
                {
                    validmoves.push({from:element,to:squares[GetSquareIndex(element,squareindex)+offsets[o]*l],promote:""});
                    if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]!=" ") { l=8; break; }
                } else {
                    l=8; break;
                }
            } else {
                l=8; break;
            }
        }
    }
    Array.prototype.push.apply(movelist,validmoves);
}

/*
 *   This should be possible to speed up A LOT... just not sure how right now...
 */
function AddRookMovesToMoveList(element,board,squares,squareindex,movelist)
{
    var offsets = [ -8, -1, +1, +8 ];
    var validmoves = [];

    for(var o=0;o<offsets.length;o++)
    {
        for(var l=1;l<8;l++) 
        {
            if(GetSquareIndex(element,squareindex)+offsets[o]*l > -1 &&
               GetSquareIndex(element,squareindex)+offsets[o]*l < 64 &&
               Math.abs((GetSquareIndex(element,squareindex)+offsets[o]*(l-1))%8 - (GetSquareIndex(element,squareindex)+offsets[o]*l)%8) < 2)
            {
                if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==" " ||
                   (isWhiteToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]].toLowerCase()) ||
                   (isBlackToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]].toUpperCase()))
                {
                    validmoves.push({from:element,to:squares[GetSquareIndex(element,squareindex)+offsets[o]*l],promote:""});
                    if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]!=" ") { l=8; break; }
                } else {
                    l=8; break;
                }
            } else {
                l=8; break;
            }
        }
    }
    Array.prototype.push.apply(movelist,validmoves);
}

/*
 *   This should be possible to speed up A LOT... just not sure how right now...
 */
function AddBishopMovesToMoveList(element,board,squares,squareindex,movelist)
{
    var offsets = [ -9, -7, +7, +9 ];
    var validmoves = [];

    for(var o=0;o<offsets.length;o++)
    {
        for(var l=1;l<8;l++) 
        {
            if(GetSquareIndex(element,squareindex)+offsets[o]*l > -1 &&
               GetSquareIndex(element,squareindex)+offsets[o]*l < 64 &&
               Math.abs((GetSquareIndex(element,squareindex)+offsets[o]*(l-1))%8 - (GetSquareIndex(element,squareindex)+offsets[o]*l)%8) < 2)
            {
                if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==" " ||
                   (isWhiteToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]].toLowerCase()) ||
                   (isBlackToMove(board) && board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]==board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]].toUpperCase()))
                {
                    validmoves.push({from:element,to:squares[GetSquareIndex(element,squareindex)+offsets[o]*l],promote:""});
                    if(board[squares[GetSquareIndex(element,squareindex)+offsets[o]*l]]!=" ") { l=8; break; }
                } else {
                    l=8; break;
                }
            } else {
                l=8; break;
            }
        }
    }
    Array.prototype.push.apply(movelist,validmoves);
}

function AddKnightMovesToMoveList(element,board,movelist,knightmoves)
{
    var validmoves;

    validmoves=knightmoves[element].filter(function(value){if(board[value.to]!=" " && ((isWhiteToMove(board) && board[value.to]==board[value.to].toLowerCase()) || (isBlackToMove(board) && board[value.to]==board[value.to].toUpperCase()))) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
    validmoves=knightmoves[element].filter(function(value){if(board[value.to]==" ") return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
}

/*
 *  TODO: Missing pawn captures, en passant, doublesteps ignore blocking pieces (jumps = bug)
 */
function AddWhitePawnMovesToMoveList(element,board,movelist)
{
    var validmoves;
    whitepawnmoves={
                     "a2":[{from:"a2",to:"a3",promote:""},{from:"a2",to:"a4",promote:""}],
                     "a3":[{from:"a3",to:"a4",promote:""}],
                     "a4":[{from:"a4",to:"a5",promote:""}],
                     "a5":[{from:"a5",to:"a6",promote:""}],
                     "a6":[{from:"a6",to:"a7",promote:""}],
                     "a7":[{from:"a7",to:"a8",promote:"Q"},{from:"a7",to:"a8",promote:"R"},{from:"a7",to:"a8",promote:"B"},{from:"a7",to:"a8",promote:"N"}],
                     "b2":[{from:"b2",to:"b3",promote:""},{from:"b2",to:"b4",promote:""}],
                     "b3":[{from:"b3",to:"b4",promote:""}],
                     "b4":[{from:"b4",to:"b5",promote:""}],
                     "b5":[{from:"b5",to:"b6",promote:""}],
                     "b6":[{from:"b6",to:"b7",promote:""}],
                     "b7":[{from:"b7",to:"b8",promote:"Q"},{from:"b7",to:"b8",promote:"R"},{from:"b7",to:"b8",promote:"B"},{from:"b7",to:"b8",promote:"N"}],
                     "c2":[{from:"c2",to:"c3",promote:""},{from:"c2",to:"c4",promote:""}],
                     "c3":[{from:"c3",to:"c4",promote:""}],
                     "c4":[{from:"c4",to:"c5",promote:""}],
                     "c5":[{from:"c5",to:"c6",promote:""}],
                     "c6":[{from:"c6",to:"c7",promote:""}],
                     "c7":[{from:"c7",to:"c8",promote:"Q"},{from:"c7",to:"c8",promote:"R"},{from:"c7",to:"c8",promote:"B"},{from:"c7",to:"c8",promote:"N"}],
                     "d2":[{from:"d2",to:"d3",promote:""},{from:"d2",to:"d4",promote:""}],
                     "d3":[{from:"d3",to:"d4",promote:""}],
                     "d4":[{from:"d4",to:"d5",promote:""}],
                     "d5":[{from:"d5",to:"d6",promote:""}],
                     "d6":[{from:"d6",to:"d7",promote:""}],
                     "d7":[{from:"d7",to:"d8",promote:"Q"},{from:"d7",to:"d8",promote:"R"},{from:"d7",to:"d8",promote:"B"},{from:"d7",to:"d8",promote:"N"}],
                     "e2":[{from:"e2",to:"e3",promote:""},{from:"e2",to:"e4",promote:""}],
                     "e3":[{from:"e3",to:"e4",promote:""}],
                     "e4":[{from:"e4",to:"e5",promote:""}],
                     "e5":[{from:"e5",to:"e6",promote:""}],
                     "e6":[{from:"e6",to:"e7",promote:""}],
                     "e7":[{from:"e7",to:"e8",promote:"Q"},{from:"e7",to:"e8",promote:"R"},{from:"e7",to:"e8",promote:"B"},{from:"e7",to:"e8",promote:"N"}],
                     "f2":[{from:"f2",to:"f3",promote:""},{from:"f2",to:"f4",promote:""}],
                     "f3":[{from:"f3",to:"f4",promote:""}],
                     "f4":[{from:"f4",to:"f5",promote:""}],
                     "f5":[{from:"f5",to:"f6",promote:""}],
                     "f6":[{from:"f6",to:"f7",promote:""}],
                     "f7":[{from:"f7",to:"f8",promote:"Q"},{from:"f7",to:"f8",promote:"R"},{from:"f7",to:"f8",promote:"B"},{from:"f7",to:"f8",promote:"N"}],
                     "g2":[{from:"g2",to:"g3",promote:""},{from:"g2",to:"g4",promote:""}],
                     "g3":[{from:"g3",to:"g4",promote:""}],
                     "g4":[{from:"g4",to:"g5",promote:""}],
                     "g5":[{from:"g5",to:"g6",promote:""}],
                     "g6":[{from:"g6",to:"g7",promote:""}],
                     "g7":[{from:"g7",to:"g8",promote:"Q"},{from:"g7",to:"g8",promote:"R"},{from:"g7",to:"g8",promote:"B"},{from:"g7",to:"g8",promote:"N"}],
                     "h2":[{from:"h2",to:"h3",promote:""},{from:"h2",to:"h4",promote:""}],
                     "h3":[{from:"h3",to:"h4",promote:""}],
                     "h4":[{from:"h4",to:"h5",promote:""}],
                     "h5":[{from:"h5",to:"h6",promote:""}],
                     "h6":[{from:"h6",to:"h7",promote:""}],
                     "h7":[{from:"h7",to:"h8",promote:"Q"},{from:"h7",to:"h8",promote:"R"},{from:"h7",to:"h8",promote:"B"},{from:"h7",to:"h8",promote:"N"}]
                   };
    whitepawncaptures={
                        "a2":[{from:"a2",to:"b3",promote:""}],
                        "a3":[{from:"a3",to:"b4",promote:""}],
                        "a4":[{from:"a4",to:"b5",promote:""}],
                        "a5":[{from:"a5",to:"b6",promote:""}],
                        "a6":[{from:"a6",to:"b7",promote:""}],
                        "a7":[{from:"a7",to:"b8",promote:"Q"},{from:"a7",to:"b8",promote:"R"},{from:"a7",to:"b8",promote:"B"},{from:"a7",to:"b8",promote:"N"}],
                        "b2":[{from:"b2",to:"a3",promote:""},{from:"b2",to:"c3",promote:""}],
                        "b3":[{from:"b3",to:"a4",promote:""},{from:"b3",to:"c4",promote:""}],
                        "b4":[{from:"b4",to:"a5",promote:""},{from:"b4",to:"c5",promote:""}],
                        "b5":[{from:"b5",to:"a6",promote:""},{from:"b5",to:"c6",promote:""}],
                        "b6":[{from:"b6",to:"a7",promote:""},{from:"b6",to:"c7",promote:""}],
                        "b7":[{from:"b7",to:"a8",promote:"Q"},{from:"b7",to:"a8",promote:"R"},{from:"b7",to:"a8",promote:"B"},{from:"b7",to:"a8",promote:"N"},
                              {from:"b7",to:"c8",promote:"Q"},{from:"b7",to:"c8",promote:"R"},{from:"b7",to:"c8",promote:"B"},{from:"b7",to:"c8",promote:"N"}],
                        "c2":[{from:"c2",to:"b3",promote:""},{from:"c2",to:"d3",promote:""}],
                        "c3":[{from:"c3",to:"b4",promote:""},{from:"c3",to:"d4",promote:""}],
                        "c4":[{from:"c4",to:"b5",promote:""},{from:"c4",to:"d5",promote:""}],
                        "c5":[{from:"c5",to:"b6",promote:""},{from:"c5",to:"d6",promote:""}],
                        "c6":[{from:"c6",to:"b7",promote:""},{from:"c6",to:"d7",promote:""}],
                        "c7":[{from:"c7",to:"b8",promote:"Q"},{from:"c7",to:"b8",promote:"R"},{from:"c7",to:"b8",promote:"B"},{from:"c7",to:"b8",promote:"N"},
                              {from:"c7",to:"d8",promote:"Q"},{from:"c7",to:"d8",promote:"R"},{from:"c7",to:"d8",promote:"B"},{from:"c7",to:"d8",promote:"N"}],
                        "d2":[{from:"d2",to:"c3",promote:""},{from:"d2",to:"e3",promote:""}],
                        "d3":[{from:"d3",to:"c4",promote:""},{from:"d3",to:"e4",promote:""}],
                        "d4":[{from:"d4",to:"c5",promote:""},{from:"d4",to:"e5",promote:""}],
                        "d5":[{from:"d5",to:"c6",promote:""},{from:"d5",to:"e6",promote:""}],
                        "d6":[{from:"d6",to:"c7",promote:""},{from:"d6",to:"e7",promote:""}],
                        "d7":[{from:"d7",to:"c8",promote:"Q"},{from:"d7",to:"c8",promote:"R"},{from:"d7",to:"c8",promote:"B"},{from:"d7",to:"c8",promote:"N"},
                              {from:"d7",to:"e8",promote:"Q"},{from:"d7",to:"e8",promote:"R"},{from:"d7",to:"e8",promote:"B"},{from:"d7",to:"e8",promote:"N"}],
                        "e2":[{from:"e2",to:"d3",promote:""},{from:"e2",to:"f3",promote:""}],
                        "e3":[{from:"e3",to:"d4",promote:""},{from:"e3",to:"f4",promote:""}],
                        "e4":[{from:"e4",to:"d5",promote:""},{from:"e4",to:"f5",promote:""}],
                        "e5":[{from:"e5",to:"d6",promote:""},{from:"e5",to:"f6",promote:""}],
                        "e6":[{from:"e6",to:"d7",promote:""},{from:"e6",to:"f7",promote:""}],
                        "e7":[{from:"e7",to:"d8",promote:"Q"},{from:"e7",to:"d8",promote:"R"},{from:"e7",to:"d8",promote:"B"},{from:"e7",to:"d8",promote:"N"},
                              {from:"e7",to:"f8",promote:"Q"},{from:"e7",to:"f8",promote:"R"},{from:"e7",to:"f8",promote:"B"},{from:"e7",to:"f8",promote:"N"}],
                        "f2":[{from:"f2",to:"e3",promote:""},{from:"f2",to:"g3",promote:""}],
                        "f3":[{from:"f3",to:"e4",promote:""},{from:"f3",to:"g4",promote:""}],
                        "f4":[{from:"f4",to:"e5",promote:""},{from:"f4",to:"g5",promote:""}],
                        "f5":[{from:"f5",to:"e6",promote:""},{from:"f5",to:"g6",promote:""}],
                        "f6":[{from:"f6",to:"e7",promote:""},{from:"f6",to:"g7",promote:""}],
                        "f7":[{from:"f7",to:"e8",promote:"Q"},{from:"f7",to:"e8",promote:"R"},{from:"f7",to:"e8",promote:"B"},{from:"f7",to:"e8",promote:"N"},
                              {from:"f7",to:"g8",promote:"Q"},{from:"f7",to:"g8",promote:"R"},{from:"f7",to:"g8",promote:"B"},{from:"f7",to:"g8",promote:"N"}],
                        "g2":[{from:"g2",to:"f3",promote:""},{from:"g2",to:"h3",promote:""}],
                        "g3":[{from:"g3",to:"f4",promote:""},{from:"g3",to:"h4",promote:""}],
                        "g4":[{from:"g4",to:"f5",promote:""},{from:"g4",to:"h5",promote:""}],
                        "g5":[{from:"g5",to:"f6",promote:""},{from:"g5",to:"h6",promote:""}],
                        "g6":[{from:"g6",to:"f7",promote:""},{from:"g6",to:"h7",promote:""}],
                        "g7":[{from:"g7",to:"f8",promote:"Q"},{from:"g7",to:"f8",promote:"R"},{from:"g7",to:"f8",promote:"B"},{from:"g7",to:"f8",promote:"N"},
                              {from:"g7",to:"h8",promote:"Q"},{from:"g7",to:"h8",promote:"R"},{from:"g7",to:"h8",promote:"B"},{from:"g7",to:"h8",promote:"N"}],
                        "h2":[{from:"h2",to:"g3",promote:""}],
                        "h3":[{from:"h3",to:"g4",promote:""}],
                        "h4":[{from:"h4",to:"g5",promote:""}],
                        "h5":[{from:"h5",to:"g6",promote:""}],
                        "h6":[{from:"h6",to:"g7",promote:""}],
                        "h7":[{from:"h7",to:"g8",promote:"Q"},{from:"h7",to:"g8",promote:"R"},{from:"h7",to:"g8",promote:"B"},{from:"h7",to:"g8",promote:"N"}]
                      };

    validmoves=whitepawncaptures[element].filter(function(value){if(board[value.to]!=" " && board[value.to]==board[value.to].toLowerCase()) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
    validmoves=whitepawnmoves[element].filter(function(value){if(board[value.to]==" " && value.from[) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
}

/*
 *  TODO: Missing pawn moves, en passant
 */
function AddBlackPawnMovesToMoveList(element,board,movelist)
{
    var validmoves;
    blackpawnmoves={
                     "a7":[{from:"a7",to:"a6",promote:""},{from:"a7",to:"a5",promote:""}],
                     "a6":[{from:"a6",to:"a5",promote:""}],
                     "a5":[{from:"a5",to:"a4",promote:""}],
                     "a4":[{from:"a4",to:"a3",promote:""}],
                     "a3":[{from:"a3",to:"a2",promote:""}],
                     "a2":[{from:"a2",to:"a1",promote:"q"},{from:"a2",to:"a1",promote:"r"},{from:"a2",to:"a1",promote:"b"},{from:"a2",to:"a1",promote:"n"}],
                     "b7":[{from:"b7",to:"b6",promote:""},{from:"b7",to:"b5",promote:""}],
                     "b6":[{from:"b6",to:"b5",promote:""}],
                     "b5":[{from:"b5",to:"b4",promote:""}],
                     "b4":[{from:"b4",to:"b3",promote:""}],
                     "b3":[{from:"b3",to:"b2",promote:""}],
                     "b2":[{from:"b2",to:"b1",promote:"q"},{from:"b2",to:"b1",promote:"r"},{from:"b2",to:"b1",promote:"b"},{from:"b2",to:"b1",promote:"n"}],
                     "c7":[{from:"c7",to:"c6",promote:""},{from:"c7",to:"c5",promote:""}],
                     "c6":[{from:"c6",to:"c5",promote:""}],
                     "c5":[{from:"c5",to:"c4",promote:""}],
                     "c4":[{from:"c4",to:"c3",promote:""}],
                     "c3":[{from:"c3",to:"c2",promote:""}],
                     "c2":[{from:"c2",to:"c1",promote:"q"},{from:"c2",to:"c1",promote:"r"},{from:"c2",to:"c1",promote:"b"},{from:"c2",to:"c1",promote:"n"}],
                     "d7":[{from:"d7",to:"d6",promote:""},{from:"d7",to:"d5",promote:""}],
                     "d6":[{from:"d6",to:"d5",promote:""}],
                     "d5":[{from:"d5",to:"d4",promote:""}],
                     "d4":[{from:"d4",to:"d3",promote:""}],
                     "d3":[{from:"d3",to:"d2",promote:""}],
                     "d2":[{from:"d2",to:"d1",promote:"q"},{from:"d2",to:"d1",promote:"r"},{from:"d2",to:"d1",promote:"b"},{from:"d2",to:"d1",promote:"n"}],
                     "e7":[{from:"e7",to:"e6",promote:""},{from:"e7",to:"e5",promote:""}],
                     "e6":[{from:"e6",to:"e5",promote:""}],
                     "e5":[{from:"e5",to:"e4",promote:""}],
                     "e4":[{from:"e4",to:"e3",promote:""}],
                     "e3":[{from:"e3",to:"e2",promote:""}],
                     "e2":[{from:"e2",to:"e1",promote:"q"},{from:"e2",to:"e1",promote:"r"},{from:"e2",to:"e1",promote:"b"},{from:"e2",to:"e1",promote:"n"}],
                     "f7":[{from:"f7",to:"f6",promote:""},{from:"f7",to:"f5",promote:""}],
                     "f6":[{from:"f6",to:"f5",promote:""}],
                     "f5":[{from:"f5",to:"f4",promote:""}],
                     "f4":[{from:"f4",to:"f3",promote:""}],
                     "f3":[{from:"f3",to:"f2",promote:""}],
                     "f2":[{from:"f2",to:"f1",promote:"q"},{from:"f2",to:"f1",promote:"r"},{from:"f2",to:"f1",promote:"b"},{from:"f2",to:"f1",promote:"n"}],
                     "g7":[{from:"g7",to:"g6",promote:""},{from:"g7",to:"g5",promote:""}],
                     "g6":[{from:"g6",to:"g5",promote:""}],
                     "g5":[{from:"g5",to:"g4",promote:""}],
                     "g4":[{from:"g4",to:"g3",promote:""}],
                     "g3":[{from:"g3",to:"g2",promote:""}],
                     "g2":[{from:"g2",to:"g1",promote:"q"},{from:"g2",to:"g1",promote:"r"},{from:"g2",to:"g1",promote:"b"},{from:"g2",to:"g1",promote:"n"}],
                     "h7":[{from:"h7",to:"h6",promote:""},{from:"h7",to:"h5",promote:""}],
                     "h6":[{from:"h6",to:"h5",promote:""}],
                     "h5":[{from:"h5",to:"h4",promote:""}],
                     "h4":[{from:"h4",to:"h3",promote:""}],
                     "h3":[{from:"h3",to:"h2",promote:""}],
                     "h2":[{from:"h2",to:"h1",promote:"q"},{from:"h2",to:"h1",promote:"r"},{from:"h2",to:"h1",promote:"b"},{from:"h2",to:"h1",promote:"n"}]
                   };
    blackpawncaptures={
                        "a7":[{from:"a7",to:"b6",promote:""}],
                        "a6":[{from:"a6",to:"b5",promote:""}],
                        "a5":[{from:"a5",to:"b4",promote:""}],
                        "a4":[{from:"a4",to:"b3",promote:""}],
                        "a3":[{from:"a3",to:"b2",promote:""}],
                        "a2":[{from:"a2",to:"b1",promote:"q"},{from:"a2",to:"b1",promote:"r"},{from:"a2",to:"b1",promote:"b"},{from:"a2",to:"b1",promote:"n"}],
                        "b7":[{from:"b7",to:"a6",promote:""},{from:"b7",to:"c6",promote:""}],
                        "b6":[{from:"b6",to:"a5",promote:""},{from:"b6",to:"c5",promote:""}],
                        "b5":[{from:"b5",to:"a4",promote:""},{from:"b5",to:"c4",promote:""}],
                        "b4":[{from:"b4",to:"a3",promote:""},{from:"b4",to:"c3",promote:""}],
                        "b3":[{from:"b3",to:"a2",promote:""},{from:"b3",to:"c2",promote:""}],
                        "b2":[{from:"b2",to:"a1",promote:"q"},{from:"b2",to:"a1",promote:"r"},{from:"b2",to:"a1",promote:"b"},{from:"b2",to:"a1",promote:"n"},
                              {from:"b2",to:"c1",promote:"q"},{from:"b2",to:"c1",promote:"r"},{from:"b2",to:"c1",promote:"b"},{from:"b2",to:"c1",promote:"n"}],
                        "c7":[{from:"c7",to:"b6",promote:""},{from:"c7",to:"d6",promote:""}],
                        "c6":[{from:"c6",to:"b5",promote:""},{from:"c6",to:"d5",promote:""}],
                        "c5":[{from:"c5",to:"b4",promote:""},{from:"c5",to:"d4",promote:""}],
                        "c4":[{from:"c4",to:"b3",promote:""},{from:"c4",to:"d3",promote:""}],
                        "c3":[{from:"c3",to:"b2",promote:""},{from:"c3",to:"d2",promote:""}],
                        "c2":[{from:"c2",to:"b1",promote:"q"},{from:"c2",to:"b1",promote:"r"},{from:"c2",to:"b1",promote:"b"},{from:"c2",to:"b1",promote:"n"},
                              {from:"c2",to:"d1",promote:"q"},{from:"c2",to:"d1",promote:"r"},{from:"c2",to:"d1",promote:"b"},{from:"c2",to:"d1",promote:"n"}],
                        "d7":[{from:"d7",to:"c6",promote:""},{from:"d7",to:"e6",promote:""}],
                        "d6":[{from:"d6",to:"c5",promote:""},{from:"d6",to:"e5",promote:""}],
                        "d5":[{from:"d5",to:"c4",promote:""},{from:"d5",to:"e4",promote:""}],
                        "d4":[{from:"d4",to:"c3",promote:""},{from:"d4",to:"e3",promote:""}],
                        "d3":[{from:"d3",to:"c2",promote:""},{from:"d3",to:"e2",promote:""}],
                        "d2":[{from:"d2",to:"c1",promote:"q"},{from:"d2",to:"c1",promote:"r"},{from:"d2",to:"c1",promote:"b"},{from:"d2",to:"c1",promote:"n"},
                              {from:"d2",to:"e1",promote:"q"},{from:"d2",to:"e1",promote:"r"},{from:"d2",to:"e1",promote:"b"},{from:"d2",to:"e1",promote:"n"}],
                        "e7":[{from:"e7",to:"d6",promote:""},{from:"e7",to:"f6",promote:""}],
                        "e6":[{from:"e6",to:"d5",promote:""},{from:"e6",to:"f5",promote:""}],
                        "e5":[{from:"e5",to:"d4",promote:""},{from:"e5",to:"f4",promote:""}],
                        "e4":[{from:"e4",to:"d3",promote:""},{from:"e4",to:"f3",promote:""}],
                        "e3":[{from:"e3",to:"d2",promote:""},{from:"e3",to:"f2",promote:""}],
                        "e2":[{from:"e2",to:"d1",promote:"q"},{from:"e2",to:"d1",promote:"r"},{from:"e2",to:"d1",promote:"b"},{from:"e2",to:"d1",promote:"n"},
                              {from:"e2",to:"f1",promote:"q"},{from:"e2",to:"f1",promote:"r"},{from:"e2",to:"f1",promote:"b"},{from:"e2",to:"f1",promote:"n"}],
                        "f7":[{from:"f7",to:"e6",promote:""},{from:"f7",to:"g6",promote:""}],
                        "f6":[{from:"f6",to:"e5",promote:""},{from:"f6",to:"g5",promote:""}],
                        "f5":[{from:"f5",to:"e4",promote:""},{from:"f5",to:"g4",promote:""}],
                        "f4":[{from:"f4",to:"e3",promote:""},{from:"f4",to:"g3",promote:""}],
                        "f3":[{from:"f3",to:"e2",promote:""},{from:"f3",to:"g2",promote:""}],
                        "f2":[{from:"f2",to:"e1",promote:"q"},{from:"f2",to:"e1",promote:"r"},{from:"f2",to:"e1",promote:"b"},{from:"f2",to:"e1",promote:"n"},
                              {from:"f2",to:"g1",promote:"q"},{from:"f2",to:"g1",promote:"r"},{from:"f2",to:"g1",promote:"b"},{from:"f2",to:"g1",promote:"n"}],
                        "g7":[{from:"g7",to:"f6",promote:""},{from:"g7",to:"h6",promote:""}],
                        "g6":[{from:"g6",to:"f5",promote:""},{from:"g6",to:"h5",promote:""}],
                        "g5":[{from:"g5",to:"f4",promote:""},{from:"g5",to:"h4",promote:""}],
                        "g4":[{from:"g4",to:"f3",promote:""},{from:"g4",to:"h3",promote:""}],
                        "g3":[{from:"g3",to:"f2",promote:""},{from:"g3",to:"h2",promote:""}],
                        "g2":[{from:"g2",to:"f1",promote:"q"},{from:"g2",to:"f1",promote:"r"},{from:"g2",to:"f1",promote:"b"},{from:"g2",to:"f1",promote:"n"},
                              {from:"g2",to:"h1",promote:"q"},{from:"g2",to:"h1",promote:"r"},{from:"g2",to:"h1",promote:"b"},{from:"g2",to:"h1",promote:"n"}],
                        "h7":[{from:"h7",to:"g6",promote:""}],
                        "h6":[{from:"h6",to:"g5",promote:""}],
                        "h5":[{from:"h5",to:"g4",promote:""}],
                        "h4":[{from:"h4",to:"g3",promote:""}],
                        "h3":[{from:"h3",to:"g2",promote:""}],
                        "h2":[{from:"h2",to:"g1",promote:"q"},{from:"h2",to:"g1",promote:"r"},{from:"h2",to:"g1",promote:"b"},{from:"h2",to:"g1",promote:"n"}]
                      };

    validmoves=blackpawncaptures[element].filter(function(value){if(board[value.to]!=" " && board[value.to]==board[value.to].toUpperCase()) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
    validmoves=blackpawnmoves[element].filter(function(value){if(board[value.to]==" ") return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
}

/*
 *  Main MoveGenerator Function
 *
 *  TODO: Remove illegal moves that leaves king in check, castlingm, en passant, promotion...
 */
function GenerateMoveList(board,squares,squareindex,knightmoves)
{
    var movelist = [];

    if(isWhiteToMove(board)) {
        if(board.wk.length>0) {
            board.wp.forEach(function(element,index,array) { AddWhitePawnMovesToMoveList(element,board,movelist); });
            board.wn.forEach(function(element,index,array) { AddKnightMovesToMoveList(element,board,movelist,knightmoves); });
            board.wb.forEach(function(element,index,array) { AddBishopMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.wr.forEach(function(element,index,array) { AddRookMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.wq.forEach(function(element,index,array) { AddQueenMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.wk.forEach(function(element,index,array) { AddKingMovesToMoveList(element,board,squares,squareindex,movelist); });
        }
    } else {
        if(board.bk.length>0) {
            board.bp.forEach(function(element,index,array) { AddBlackPawnMovesToMoveList(element,board,movelist); });
            board.bn.forEach(function(element,index,array) { AddKnightMovesToMoveList(element,board,movelist,knightmoves); });
            board.bb.forEach(function(element,index,array) { AddBishopMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.br.forEach(function(element,index,array) { AddRookMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.bq.forEach(function(element,index,array) { AddQueenMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.bk.forEach(function(element,index,array) { AddKingMovesToMoveList(element,board,squares,squareindex,movelist); });
        }
    }
    /*
     *  Remove illegal moves that leaves king in check
     */
    //movelist.forEach() // Make the move, get the movelist and see if any move can capture the king - easy and slow...
    // or
    //movelist.filter() // Make the move and see if king is in check, return false if king is in check - faster?
    return movelist;
}

/*
 *   Make Move
 *
 *   TODO: Castling, En Passant
 */
function MakeMove(board,move)
{
    var rv = JSON.parse(JSON.stringify(board));
    var piecetype = { "K":"wk", "Q":"wq", "R":"wr", "B":"wb", "N":"wn", "P":"wp",
                      "k":"bk", "q":"bq", "r":"br", "b":"bb", "n":"bn", "p":"bp" };

// Remove any captured piece
    if(board[move.to]!=" ") {
        rv[piecetype[board[move.to]]]=rv[piecetype[board[move.to]]].filter(function(value){if(value==move.to) { return false; } else { return true; }});
    }
// Place moved/promoted piece on final square
    if(move.promote=="") {
        rv[piecetype[board[move.from]]].push(move.to);
        rv[move.to]=board[move.from];
    } else {
        rv[piecetype[move.promote]].push(move.to);
        rv[move.to]=move.promote;
    }
// Remove moved/promoted piece from original square
    rv[piecetype[board[move.from]]]=rv[piecetype[board[move.from]]].filter(function(value){if(value==move.from) { return false; } else { return true; }});
    rv[move.from]=" ";
// Flip side to move
    if(isWhiteToMove(board)) {
        rv.tomove="B";
    } else {
        rv.tomove="W";
    }
    return rv;
}



/*
 *   SEARCH (Alfa Beta)
 *
 *   Non optimized version which will create new board after each move (thus creating many boards...)
 *   More optimized would be to use undo pattern...
 */

function AlfaBeta(board,ply,alfa,beta,squares,squareindex,knightmoves)
{
    var movelist = GenerateMoveList(board,squares,squareindex,knightmoves);
    var newboard = {};

    if(movelist.length==0) {
        return EndOfGameEvaluation(board,ply);
    } else {
        if(ply==0) {
            return Evaluation(board,movelist.length,squares,squareindex,knightmoves);
        } else {
            // Make each move, decrease ply and call AlfaBeta again. Add returned evaluation to movelist
            for(var i=0;i<movelist.length;i++) {
                newboard={};
                newboard=MakeMove(board,movelist[i]);
                alfa=Math.max(alfa,-AlfaBeta(newboard,ply-1,-beta,-alfa,squares,squareindex,knightmoves));
                if(alfa>=beta) { break; }
            }
        }
    }
    return alfa;
}

function Search(board,evaluatedmovelist,maxply,t0,squares,squareindex,knightmoves)
{
    var newboard;
    var besteval=Infinity;
    var t1;
    var elapsed=0;

    for(var i=0;i<evaluatedmovelist.length && elapsed<9000;i++) {
        newboard=MakeMove(board,evaluatedmovelist[i]);
        evaluatedmovelist[i].eval = -AlfaBeta(newboard, maxply, -besteval, Infinity, squares, squareindex, knightmoves);
        besteval=Math.max(evaluatedmovelist[i].eval,besteval);

        if (typeof performance != 'undefined') {
            t1 = performance.now();
            elapsed=t1-t0;      
        } else {
            t1 = process.hrtime(t0);
            elapsed=Math.round((t1[0]*1000) + (t1[1]/1000000));    
        }
    }
    return evaluatedmovelist;
}

function IncrementalSearch(board,maxdepth,squares,squareindex,knightmoves)
{
    var evaluatedmovelist = GenerateMoveList(board,squares,squareindex,knightmoves);
    var evalmovelist = [];
    var t0, t1;
    var elapsed = 0;

    nodes=0;
    if (typeof performance != 'undefined') {
        t0 = performance.now();
    } else {
        t0 = process.hrtime();
    }
    for(var maxply=1;maxply<maxdepth && elapsed<3000;maxply+=2) {
        evalmovelist = Search(board,evaluatedmovelist,maxply,t0,squares,squareindex,knightmoves);
        evaluatedmovelist = evalmovelist.sort(function(a,b) { return b.eval-a.eval; });
        if(maxply==1 && evaluatedmovelist[0].eval < -25000) { break; }

        if(evaluatedmovelist.length>5) {
            evalmovelist=[];
            for(var i=0;i<5;i++) {
                evalmovelist.push(evaluatedmovelist[i]);
            }
            evaluatedmovelist = evalmovelist.sort(function(a,b) { return b.eval-a.eval; });
        }

        if (typeof performance != 'undefined') {
            t1 = performance.now();
            elapsed=t1-t0;      
        } else {
            t1 = process.hrtime(t0);
            elapsed=Math.round((t1[0]*1000) + (t1[1]/1000000));    
        }
        console.log("Nodes: " + nodes + "   Time: " + (t1-t0) + " ms");
    }
    return evaluatedmovelist;
}




/*
 *   EVALUATION
 */
var nodes;

function Evaluation(board,moves,squares,squareindex,knightmoves)
{
    nodes++;
    var white=board.wk.length*12000+board.wq.length*900+board.wr.length*500+board.wb.length*320+board.wn.length*280+board.wp.length*100;
    var black=board.bk.length*12000+board.bq.length*900+board.br.length*500+board.bb.length*320+board.bn.length*280+board.bp.length*100;
    var randomfactor = Math.floor(Math.random()*5);
    if(isWhiteToMove(board)) { return white-black+moves+randomfactor; } else { return black-white+moves+randomfactor; }
}

/*
 *   TODO: Draw...
 */
function EndOfGameEvaluation(board,ply)
{
    return -25600-ply; // Draw or Loss? Is King in Check? We assume it is always a loss here
}


function isObjectInList(obj,list)
{
    for(var i=0;i<list.length;i++) {
        if(JSON.stringify(list[i])===JSON.stringify(obj)) {
            return true;
        }
    }
    return false;
}



/*
 *   GUI Functions
 *
 *   TODO: En passant, Castling, Promotion
 *
 */
function userclick(id)
{
    var squares = GenerateSquares();
    var squareindex = GenerateSquareIndex();
    var knightmoves = GenerateKnightMoves(squares);
    var piecetype = { "K":"wk", "Q":"wq", "R":"wr", "B":"wb", "N":"wn", "P":"wp",
                      "k":"bk", "q":"bq", "r":"br", "b":"bb", "n":"bn", "p":"bp" };

    var selected = sessionStorage.getItem("selected");
    if(selected==undefined || selected=="") {
      sessionStorage.setItem("selected", id);
    } else {
      var board = JSON.parse(sessionStorage.getItem("board"));
      var movelist = GenerateMoveList(board,squares,squareindex,knightmoves);
      var move = { from:selected,to:id,promote:"" };
      if(isObjectInList(move,movelist)) {
        var newboard = MakeMove(board,move);
        sessionStorage.removeItem("selected");
        sessionStorage.removeItem("board");
        sessionStorage.setItem("board", JSON.stringify(newboard));
        document.getElementById("status").innerHTML="Thinking...";
        UpdateHTMLBoard();
        setTimeout('AIMakeMove()',100);
      } else {
        sessionStorage.removeItem("selected");
      }
    }
    UpdateHTMLBoard();
}

function AIMakeMove()
{
    var piecetype = { "K":"wk", "Q":"wq", "R":"wr", "B":"wb", "N":"wn", "P":"wp",
                      "k":"bk", "q":"bq", "r":"br", "b":"bb", "n":"bn", "p":"bp" };

    var board = JSON.parse(sessionStorage.getItem("board"));

    
    var squares = GenerateSquares();
    var squareindex = GenerateSquareIndex();
    var knightmoves = GenerateKnightMoves(squares);
    var movelist = GenerateMoveList(board,squares,squareindex,knightmoves);
    var newboard = {};
    var bookmove = GetBookMove(board);

    if(bookmove.from != bookmove.to)
    {
        document.getElementById("status").innerHTML="My move: " + bookmove.from+bookmove.to + " (book, 0)";
        newboard = MakeMove(board,bookmove);
        sessionStorage.removeItem("board");
        sessionStorage.setItem("board", JSON.stringify(newboard));
    } else {
        if(movelist.length > 0)
        {
            var evaluatedmovelist = IncrementalSearch(board,6,squares,squareindex,knightmoves);
            if(eval < -25000) { 
                document.getElementById("status").innerHTML="I resign"; 
            } else {
                document.getElementById("status").innerHTML="My move: " + evaluatedmovelist[0].from+evaluatedmovelist[0].to + " (" + evaluatedmovelist[0].eval + ", " + nodes + ")";
                newboard = MakeMove(board,evaluatedmovelist[0]);
                sessionStorage.removeItem("board");
                sessionStorage.setItem("board", JSON.stringify(newboard));
            }
        }
    }
    UpdateHTMLBoard();
}


function UpdateHTMLBoard()
{
    var squares=GenerateSquares();
    var piecetype = { "K":"wk", "Q":"wq", "R":"wr", "B":"wb", "N":"wn", "P":"wp",
                      "k":"bk", "q":"bq", "r":"br", "b":"bb", "n":"bn", "p":"bp",
                      " ":""
                    };
    var board = JSON.parse(sessionStorage.getItem("board"));
    var selected = sessionStorage.getItem("selected");
    var s="";

    for(var i=0;i<squares.length;i++) {
        s="";
        if(squares[i]==selected) {
            s="s";            
        }
        if((Math.floor(i/8)+(i%8))%2==0) {
            document.getElementById(squares[i]).src="b" + piecetype[board[squares[i]]] + s + ".bmp";
        } else {
            document.getElementById(squares[i]).src="w" + piecetype[board[squares[i]]] + s + ".bmp";
        }
    }
}


function InitializeGUI()
{
    UpdateHTMLBoard();
}


/*
 *   DEBUG OUTPUT
 */

function PrintBoard(board)
{
    console.log(board["a8"] + board["b8"] + board["c8"] + board["d8"] + board["e8"] + board["f8"] + board["g8"] + board["h8"]);
    console.log(board["a7"] + board["b7"] + board["c7"] + board["d7"] + board["e7"] + board["f7"] + board["g7"] + board["h7"]);
    console.log(board["a6"] + board["b6"] + board["c6"] + board["d6"] + board["e6"] + board["f6"] + board["g6"] + board["h6"]);
    console.log(board["a5"] + board["b5"] + board["c5"] + board["d5"] + board["e5"] + board["f5"] + board["g5"] + board["h5"]);
    console.log(board["a4"] + board["b4"] + board["c4"] + board["d4"] + board["e4"] + board["f4"] + board["g4"] + board["h4"]);
    console.log(board["a3"] + board["b3"] + board["c3"] + board["d3"] + board["e3"] + board["f3"] + board["g3"] + board["h3"]);
    console.log(board["a2"] + board["b2"] + board["c2"] + board["d2"] + board["e2"] + board["f2"] + board["g2"] + board["h2"]);
    console.log(board["a1"] + board["b1"] + board["c1"] + board["d1"] + board["e1"] + board["f1"] + board["g1"] + board["h1"]);
}

function PrintMoveList(movelist)
{
    for(var i=0;i<movelist.length;i++) 
    {
        console.log(movelist[i].from + movelist[i].to + movelist[i].promote + " " + movelist[i].eval);
    }
}



/*
 *   MAIN
 */

function main()
{
    var squares = GenerateSquares();
    var squareindex = GenerateSquareIndex();
    var knightmoves = GenerateKnightMoves(squares);
    var evalmovelist = [];

    var initialboard = {
                         a1:"R",a2:"P",a3:" ",a4:" ",a5:" ",a6:" ",a7:"p",a8:"r",
                         b1:"N",b2:"P",b3:" ",b4:" ",b5:" ",b6:" ",b7:"p",b8:"n",
                         c1:"B",c2:"P",c3:" ",c4:" ",c5:" ",c6:" ",c7:"p",c8:"b",
                         d1:"Q",d2:"P",d3:" ",d4:" ",d5:" ",d6:" ",d7:"p",d8:"q",
                         e1:"K",e2:"P",e3:" ",e4:" ",e5:" ",e6:" ",e7:"p",e8:"k",
                         f1:"B",f2:"P",f3:" ",f4:" ",f5:" ",f6:" ",f7:"p",f8:"b",
                         g1:"N",g2:"P",g3:" ",g4:" ",g5:" ",g6:" ",g7:"p",g8:"n",
                         h1:"R",h2:"P",h3:" ",h4:" ",h5:" ",h6:" ",h7:"p",h8:"r",
                         wkc:true, wqc:true, bkc:true, bqc:true, passant:"",tomove:"W",
                         movenumber:1,drawcounter:0,
                         wk:["e1"],
                         wq:["d1"],
                         wr:["a1","h1"],
                         wb:["c1","f1"],
                         wn:["b1","g1"],
                         wp:["a2","b2","c2","d2","e2","f2","g2","h2"],
                         bk:["e8"],
                         bq:["d8"],
                         br:["a8","h8"],
                         bb:["c8","f8"],
                         bn:["b8","g8"],
                         bp:["a7","b7","c7","d7","e7","f7","g7","h7"]
                       }

    var board = JSON.parse(JSON.stringify(initialboard));
    if (typeof sessionStorage != 'undefined') {
        sessionStorage.clear();
        sessionStorage.setItem("board",JSON.stringify(board));
    } else {
        while(eval>-25000 && eval<25000) {
          evalmovelist = IncrementalSearch(board,4,squares,squareindex,knightmoves)
          console.log("---------- POSITION ----------");
          PrintBoard(board);
          console.log("---------- MOVELIST ----------");
          PrintMoveList(evalmovelist);
          console.log("----------- CHOSEN -----------");
          console.log(evalmovelist[0],evalmovelist[0].eval);
          console.log("------------------------------");
          board=MakeMove(board,move);
        }
    }
}

main();

