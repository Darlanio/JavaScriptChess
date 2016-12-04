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
 *   Kings are just high valued material
 *   GUI: Drag'n'Drop
 *   Faster movegeneration
 *   faster search?
 *   
 */




/*
 *   Opening Book
 */

var book=[
    { position : "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR W", move: {from: 12, to: 28, promote: ""} },
    { position : "rnbqkbnrpppppppp                    P           PPPP PPPRNBQKBNR B", move: {from: 52, to: 36, promote: ""} },
    { position : "rnbqkbnrpppp ppp            p       P           PPPP PPPRNBQKBNR W", move: {from: 6, to: 21, promote: ""} },
    { position : "rnbqkbnrpppp ppp            p       P        N  PPPP PPPRNBQKB R B", move: {from: 57, to: 42, promote: ""} },
    { position : "r bqkbnrpppp ppp  n         p       P        N  PPPP PPPRNBQKB R W", move: {from: 5, to: 33, promote: ""} }
];

function GetBoardString(board)
{
    return board.pos[56]+board.pos[57]+board.pos[58]+board.pos[59]+board.pos[60]+board.pos[61]+board.pos[62]+board.pos[63]+
           board.pos[48]+board.pos[49]+board.pos[50]+board.pos[51]+board.pos[52]+board.pos[53]+board.pos[54]+board.pos[55]+
           board.pos[40]+board.pos[41]+board.pos[42]+board.pos[43]+board.pos[44]+board.pos[45]+board.pos[46]+board.pos[47]+
           board.pos[32]+board.pos[33]+board.pos[34]+board.pos[35]+board.pos[36]+board.pos[37]+board.pos[38]+board.pos[39]+
           board.pos[24]+board.pos[25]+board.pos[26]+board.pos[27]+board.pos[28]+board.pos[29]+board.pos[30]+board.pos[31]+
           board.pos[16]+board.pos[17]+board.pos[18]+board.pos[19]+board.pos[20]+board.pos[21]+board.pos[22]+board.pos[23]+
           board.pos[8]+board.pos[9]+board.pos[10]+board.pos[11]+board.pos[12]+board.pos[13]+board.pos[14]+board.pos[15]+
           board.pos[0]+board.pos[1]+board.pos[2]+board.pos[3]+board.pos[4]+board.pos[5]+board.pos[6]+board.pos[7]+
           " " + board.tomove;
}

function GetBookMove(board)
{
    var boardstr=GetBoardString(board);
    var move = {from: "a1", to: "a1", promote: ""};

    for(var i=0;i<book.length;i++) {
        if(boardstr==book[i].position) {
            move = book[i].move;
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

    for(var n=0;n<num.length;n++)
      for(var a=0;a<alfa.length;a++)
        squares.push(alfa[a]+num[n]);
    return squares;
}

function GenerateSquareIndex()
{
    var squareindex = {};
    
    var alfa = ["a", "b", "c", "d", "e", "f", "g", "h"];
    var num = ["1", "2", "3", "4", "5", "6", "7", "8"];
    var squares = [];

    for(var n=0;n<num.length;n++)
      for(var a=0;a<alfa.length;a++)
        squareindex[alfa[a]+num[n]]=a+n*num.length;
    return squareindex;
}

function GetSquareIndex(square,squareindex)
{
    return squareindex[square];
}

function GetPieceTypes()
{ 
    return {"K":"wk", "Q":"wq", "R":"wr", "B":"wb", "N":"wn", "P":"wp", "k":"bk", "q":"bq", "r":"br", "b":"bb", "n":"bn", "p":"bp", " ":"" };
}

function GenerateKnightMove(from,to)
{
    return { "from":from, "to":to, promote:"" };
}

function GenerateKnightMoves()
{
    var knightmoves = {};
    var knightmove = {};
    var knightoffsets = [ -17, -15, -10, -6, 6, 10, 15, 17 ]; 

    for(var i=0;i<64;i++)
    {
        knightmoves[i]=[];
        for(var o=0;o<knightoffsets.length;o++) 
        {
            if( i + knightoffsets[o] > -1 && i + knightoffsets[o] < 64 &&
                Math.abs(i%8 - (i+knightoffsets[o])%8) < 3
              ) 
            {
                knightmoves[i].push({ "from":i, "to":i+knightoffsets[o], promote:"" }); // GenerateKnightMove(i,i+knightoffsets[o]));
            }
        }
    }
    return knightmoves;
}

function GetEmptyPosition()
{
    return {
        pos:[" ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " "],
        wkc:false, wqc:false, bkc:false, bqc:false, 
        passant:-1,tomove:"W",
        movenumber:1,drawcounter:0,
        wk:[],
        wq:[],
        wr:[],
        wb:[],
        wn:[],
        wp:[],
        bk:[],
        bq:[],
        br:[],
        bb:[],
        bn:[],
        bp:[]
    };
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
        if(element+offsets[o] > -1 &&
           element+offsets[o] < 64 &&
           Math.abs(element%8 - (element+offsets[o])%8) < 2)
        {
            if(board.pos[element+offsets[o]]==" " ||
               (isWhiteToMove(board) && board.pos[element+offsets[o]]==board.pos[element+offsets[o]].toLowerCase()) ||
               (isBlackToMove(board) && board.pos[element+offsets[o]]==board.pos[element+offsets[o]].toUpperCase()))
            {
                validmoves.push({from:element,to:element+offsets[o],promote:""});
            }
        }
    }
    if(board.tomove=="W") {
        if(board.wqc==true && board.pos[1]==" " && board.pos[2]==" " && board.pos[3]==" ") { validmoves.push({from:4,to:2,promote:""}); }
        if(board.wkc==true && board.pos[5]==" " && board.pos[6]==" ") { validmoves.push({from:4,to:6,promote:""}); }
    } else {
        if(board.bqc==true && board.pos[57]==" " && board.pos[58]==" " && board.pos[59]==" ") { validmoves.push({from:60,to:58,promote:""}); }
        if(board.bkc==true && board.pos[61]==" " && board.pos[62]==" ") { validmoves.push({from:60,to:62,promote:""}); }
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
            if(element+offsets[o]*l > -1 &&
               element+offsets[o]*l < 64 &&
               Math.abs((element+offsets[o]*(l-1))%8 - (element+offsets[o]*l)%8) < 2)
            {
                if(board.pos[element+offsets[o]*l]==" " ||
                   (isWhiteToMove(board) && board.pos[element+offsets[o]*l]==board.pos[element+offsets[o]*l].toLowerCase()) ||
                   (isBlackToMove(board) && board.pos[element+offsets[o]*l]==board.pos[element+offsets[o]*l].toUpperCase()))
                {
                    validmoves.push({from:element,to:element+offsets[o]*l,promote:""});
                    if(board.pos[element+offsets[o]*l]!=" ") { l=8; break; }
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
            if(element+offsets[o]*l > -1 &&
               element+offsets[o]*l < 64 &&
               Math.abs((element+offsets[o]*(l-1))%8 - (element+offsets[o]*l)%8) < 2)
            {
                if(board.pos[element+offsets[o]*l]==" " ||
                   (isWhiteToMove(board) && board.pos[element+offsets[o]*l]==board.pos[element+offsets[o]*l].toLowerCase()) ||
                   (isBlackToMove(board) && board.pos[element+offsets[o]*l]==board.pos[element+offsets[o]*l].toUpperCase()))
                {
                    validmoves.push({from:element,to:element+offsets[o]*l,promote:""});
                    if(board.pos[element+offsets[o]*l]!=" ") { l=8; break; }
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
            if(element+offsets[o]*l > -1 &&
               element+offsets[o]*l < 64 &&
               Math.abs((element+offsets[o]*(l-1))%8 - (element+offsets[o]*l)%8) < 2)
            {
                if(board.pos[element+offsets[o]*l]==" " ||
                   (isWhiteToMove(board) && board.pos[element+offsets[o]*l]==board.pos[element+offsets[o]*l].toLowerCase()) ||
                   (isBlackToMove(board) && board.pos[element+offsets[o]*l]==board.pos[element+offsets[o]*l].toUpperCase()))
                {
                    validmoves.push({from:element,to:element+offsets[o]*l,promote:""});
                    if(board.pos[element+offsets[o]*l]!=" ") { l=8; break; }
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

    validmoves=knightmoves[element].filter(function(value){if(board.pos[value.to]!=" " && ((isWhiteToMove(board) && board.pos[value.to]==board.pos[value.to].toLowerCase()) || (isBlackToMove(board) && board.pos[value.to]==board.pos[value.to].toUpperCase()))) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
    validmoves=knightmoves[element].filter(function(value){if(board.pos[value.to]==" ") return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
}

/*
 *  TODO: Missing pawn captures, en passant, doublesteps ignore blocking pieces (jumps = bug)
 */
function AddWhitePawnMovesToMoveList(element,board,movelist)
{
    var validmoves;
    var whitepawnmoves={
                     8:[{from:8,to:16,promote:""},{from:8,to:24,promote:""}],
                     16:[{from:16,to:24,promote:""}],
                     24:[{from:24,to:32,promote:""}],
                     32:[{from:32,to:40,promote:""}],
                     40:[{from:40,to:48,promote:""}],
                     48:[{from:48,to:56,promote:"Q"},{from:48,to:56,promote:"R"},{from:48,to:56,promote:"B"},{from:48,to:56,promote:"N"}],
                     9:[{from:9,to:17,promote:""},{from:9,to:25,promote:""}],
                     17:[{from:17,to:25,promote:""}],
                     25:[{from:25,to:33,promote:""}],
                     33:[{from:33,to:41,promote:""}],
                     41:[{from:41,to:49,promote:""}],
                     49:[{from:49,to:57,promote:"Q"},{from:49,to:57,promote:"R"},{from:49,to:57,promote:"B"},{from:49,to:57,promote:"N"}],
                     10:[{from:10,to:18,promote:""},{from:10,to:26,promote:""}],
                     18:[{from:18,to:26,promote:""}],
                     26:[{from:26,to:34,promote:""}],
                     34:[{from:34,to:42,promote:""}],
                     42:[{from:42,to:50,promote:""}],
                     50:[{from:50,to:58,promote:"Q"},{from:50,to:58,promote:"R"},{from:50,to:58,promote:"B"},{from:50,to:58,promote:"N"}],
                     11:[{from:11,to:19,promote:""},{from:11,to:27,promote:""}],
                     19:[{from:19,to:27,promote:""}],
                     27:[{from:27,to:35,promote:""}],
                     35:[{from:35,to:43,promote:""}],
                     43:[{from:43,to:51,promote:""}],
                     51:[{from:51,to:59,promote:"Q"},{from:51,to:59,promote:"R"},{from:51,to:59,promote:"B"},{from:51,to:59,promote:"N"}],
                     12:[{from:12,to:20,promote:""},{from:12,to:28,promote:""}],
                     20:[{from:20,to:28,promote:""}],
                     28:[{from:28,to:36,promote:""}],
                     36:[{from:36,to:44,promote:""}],
                     44:[{from:44,to:52,promote:""}],
                     52:[{from:52,to:60,promote:"Q"},{from:52,to:60,promote:"R"},{from:52,to:60,promote:"B"},{from:52,to:60,promote:"N"}],
                     13:[{from:13,to:21,promote:""},{from:13,to:29,promote:""}],
                     21:[{from:21,to:29,promote:""}],
                     29:[{from:29,to:37,promote:""}],
                     37:[{from:37,to:45,promote:""}],
                     45:[{from:45,to:53,promote:""}],
                     53:[{from:53,to:61,promote:"Q"},{from:53,to:61,promote:"R"},{from:53,to:61,promote:"B"},{from:53,to:61,promote:"N"}],
                     14:[{from:14,to:22,promote:""},{from:14,to:30,promote:""}],
                     22:[{from:22,to:30,promote:""}],
                     30:[{from:30,to:38,promote:""}],
                     38:[{from:38,to:46,promote:""}],
                     46:[{from:46,to:54,promote:""}],
                     54:[{from:54,to:62,promote:"Q"},{from:54,to:62,promote:"R"},{from:54,to:62,promote:"B"},{from:54,to:62,promote:"N"}],
                     15:[{from:15,to:23,promote:""},{from:15,to:31,promote:""}],
                     23:[{from:23,to:31,promote:""}],
                     31:[{from:31,to:39,promote:""}],
                     39:[{from:39,to:47,promote:""}],
                     47:[{from:47,to:55,promote:""}],
                     55:[{from:55,to:63,promote:"Q"},{from:55,to:63,promote:"R"},{from:55,to:63,promote:"B"},{from:55,to:63,promote:"N"}]
                   };
    var whitepawncaptures={
                        8:[{from:8,to:17,promote:""}],
                        16:[{from:16,to:25,promote:""}],
                        24:[{from:24,to:33,promote:""}],
                        32:[{from:32,to:41,promote:""}],
                        40:[{from:40,to:49,promote:""}],
                        48:[{from:48,to:57,promote:"Q"},{from:48,to:57,promote:"R"},{from:48,to:57,promote:"B"},{from:48,to:57,promote:"N"}],
                        9:[{from:9,to:16,promote:""},{from:9,to:18,promote:""}],
                        17:[{from:17,to:24,promote:""},{from:17,to:26,promote:""}],
                        25:[{from:25,to:32,promote:""},{from:25,to:34,promote:""}],
                        33:[{from:33,to:40,promote:""},{from:33,to:42,promote:""}],
                        41:[{from:41,to:48,promote:""},{from:41,to:50,promote:""}],
                        49:[{from:49,to:56,promote:"Q"},{from:49,to:56,promote:"R"},{from:49,to:56,promote:"B"},{from:49,to:56,promote:"N"},
                              {from:49,to:58,promote:"Q"},{from:49,to:58,promote:"R"},{from:49,to:58,promote:"B"},{from:49,to:58,promote:"N"}],
                        10:[{from:10,to:17,promote:""},{from:10,to:19,promote:""}],
                        18:[{from:18,to:25,promote:""},{from:18,to:27,promote:""}],
                        26:[{from:26,to:33,promote:""},{from:26,to:35,promote:""}],
                        34:[{from:34,to:41,promote:""},{from:34,to:43,promote:""}],
                        42:[{from:42,to:49,promote:""},{from:42,to:51,promote:""}],
                        50:[{from:50,to:57,promote:"Q"},{from:50,to:57,promote:"R"},{from:50,to:57,promote:"B"},{from:50,to:57,promote:"N"},
                              {from:50,to:59,promote:"Q"},{from:50,to:59,promote:"R"},{from:50,to:59,promote:"B"},{from:50,to:59,promote:"N"}],
                        11:[{from:11,to:18,promote:""},{from:11,to:20,promote:""}],
                        19:[{from:19,to:26,promote:""},{from:19,to:28,promote:""}],
                        27:[{from:27,to:34,promote:""},{from:27,to:36,promote:""}],
                        35:[{from:35,to:42,promote:""},{from:35,to:44,promote:""}],
                        43:[{from:43,to:50,promote:""},{from:43,to:52,promote:""}],
                        51:[{from:51,to:58,promote:"Q"},{from:51,to:58,promote:"R"},{from:51,to:58,promote:"B"},{from:51,to:58,promote:"N"},
                              {from:51,to:60,promote:"Q"},{from:51,to:60,promote:"R"},{from:51,to:60,promote:"B"},{from:51,to:60,promote:"N"}],
                        12:[{from:12,to:19,promote:""},{from:12,to:21,promote:""}],
                        20:[{from:20,to:27,promote:""},{from:20,to:29,promote:""}],
                        28:[{from:28,to:35,promote:""},{from:28,to:37,promote:""}],
                        36:[{from:36,to:43,promote:""},{from:36,to:45,promote:""}],
                        44:[{from:44,to:51,promote:""},{from:44,to:53,promote:""}],
                        52:[{from:52,to:59,promote:"Q"},{from:52,to:59,promote:"R"},{from:52,to:59,promote:"B"},{from:52,to:59,promote:"N"},
                              {from:52,to:61,promote:"Q"},{from:52,to:61,promote:"R"},{from:52,to:61,promote:"B"},{from:52,to:61,promote:"N"}],
                        13:[{from:13,to:20,promote:""},{from:13,to:22,promote:""}],
                        21:[{from:21,to:28,promote:""},{from:21,to:30,promote:""}],
                        29:[{from:29,to:36,promote:""},{from:29,to:38,promote:""}],
                        37:[{from:37,to:44,promote:""},{from:37,to:46,promote:""}],
                        45:[{from:45,to:52,promote:""},{from:45,to:54,promote:""}],
                        53:[{from:53,to:60,promote:"Q"},{from:53,to:60,promote:"R"},{from:53,to:60,promote:"B"},{from:53,to:60,promote:"N"},
                              {from:53,to:62,promote:"Q"},{from:53,to:62,promote:"R"},{from:53,to:62,promote:"B"},{from:53,to:62,promote:"N"}],
                        14:[{from:14,to:21,promote:""},{from:14,to:23,promote:""}],
                        22:[{from:22,to:29,promote:""},{from:22,to:31,promote:""}],
                        30:[{from:30,to:37,promote:""},{from:30,to:39,promote:""}],
                        38:[{from:38,to:45,promote:""},{from:38,to:47,promote:""}],
                        46:[{from:46,to:53,promote:""},{from:46,to:55,promote:""}],
                        54:[{from:54,to:61,promote:"Q"},{from:54,to:61,promote:"R"},{from:54,to:61,promote:"B"},{from:54,to:61,promote:"N"},
                              {from:54,to:63,promote:"Q"},{from:54,to:63,promote:"R"},{from:54,to:63,promote:"B"},{from:54,to:63,promote:"N"}],
                        15:[{from:15,to:22,promote:""}],
                        23:[{from:23,to:30,promote:""}],
                        31:[{from:31,to:38,promote:""}],
                        39:[{from:39,to:46,promote:""}],
                        47:[{from:47,to:54,promote:""}],
                        55:[{from:55,to:62,promote:"Q"},{from:55,to:62,promote:"R"},{from:55,to:62,promote:"B"},{from:55,to:62,promote:"N"}]
                      };
    validmoves=whitepawncaptures[element].filter(function(value){if(board.pos[value.to]!=" " && board.pos[value.to]==board.pos[value.to].toLowerCase()) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
    validmoves=whitepawnmoves[element].filter(function(value){if(board.pos[value.to]==" ") return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
}

/*
 *  TODO: Missing pawn moves, en passant
 */
function AddBlackPawnMovesToMoveList(element,board,movelist)
{
    var validmoves;
    blackpawnmoves={
                     48:[{from:48,to:40,promote:""},{from:48,to:32,promote:""}],
                     40:[{from:40,to:32,promote:""}],
                     32:[{from:32,to:24,promote:""}],
                     24:[{from:24,to:16,promote:""}],
                     16:[{from:16,to:8,promote:""}],
                     8:[{from:8,to:0,promote:"q"},{from:8,to:0,promote:"r"},{from:8,to:0,promote:"b"},{from:8,to:0,promote:"n"}],
                     49:[{from:49,to:41,promote:""},{from:49,to:33,promote:""}],
                     41:[{from:41,to:33,promote:""}],
                     33:[{from:33,to:25,promote:""}],
                     25:[{from:25,to:17,promote:""}],
                     17:[{from:17,to:9,promote:""}],
                     9:[{from:9,to:1,promote:"q"},{from:9,to:1,promote:"r"},{from:9,to:1,promote:"b"},{from:9,to:1,promote:"n"}],
                     50:[{from:50,to:42,promote:""},{from:50,to:34,promote:""}],
                     42:[{from:42,to:34,promote:""}],
                     34:[{from:34,to:26,promote:""}],
                     26:[{from:26,to:18,promote:""}],
                     18:[{from:18,to:10,promote:""}],
                     10:[{from:10,to:2,promote:"q"},{from:10,to:2,promote:"r"},{from:10,to:2,promote:"b"},{from:10,to:2,promote:"n"}],
                     51:[{from:51,to:43,promote:""},{from:51,to:35,promote:""}],
                     43:[{from:43,to:35,promote:""}],
                     35:[{from:35,to:27,promote:""}],
                     27:[{from:27,to:19,promote:""}],
                     19:[{from:19,to:11,promote:""}],
                     11:[{from:11,to:3,promote:"q"},{from:11,to:3,promote:"r"},{from:11,to:3,promote:"b"},{from:11,to:3,promote:"n"}],
                     52:[{from:52,to:44,promote:""},{from:52,to:36,promote:""}],
                     44:[{from:44,to:36,promote:""}],
                     36:[{from:36,to:28,promote:""}],
                     28:[{from:28,to:20,promote:""}],
                     20:[{from:20,to:12,promote:""}],
                     12:[{from:12,to:4,promote:"q"},{from:12,to:4,promote:"r"},{from:12,to:4,promote:"b"},{from:12,to:4,promote:"n"}],
                     53:[{from:53,to:45,promote:""},{from:53,to:37,promote:""}],
                     45:[{from:45,to:37,promote:""}],
                     37:[{from:37,to:29,promote:""}],
                     29:[{from:29,to:21,promote:""}],
                     21:[{from:21,to:13,promote:""}],
                     13:[{from:13,to:5,promote:"q"},{from:13,to:5,promote:"r"},{from:13,to:5,promote:"b"},{from:13,to:5,promote:"n"}],
                     54:[{from:54,to:46,promote:""},{from:54,to:38,promote:""}],
                     46:[{from:46,to:38,promote:""}],
                     38:[{from:38,to:30,promote:""}],
                     30:[{from:30,to:22,promote:""}],
                     22:[{from:22,to:14,promote:""}],
                     14:[{from:14,to:6,promote:"q"},{from:14,to:6,promote:"r"},{from:14,to:6,promote:"b"},{from:14,to:6,promote:"n"}],
                     55:[{from:55,to:47,promote:""},{from:55,to:39,promote:""}],
                     47:[{from:47,to:39,promote:""}],
                     39:[{from:39,to:31,promote:""}],
                     31:[{from:31,to:23,promote:""}],
                     23:[{from:23,to:15,promote:""}],
                     15:[{from:15,to:7,promote:"q"},{from:15,to:7,promote:"r"},{from:15,to:7,promote:"b"},{from:15,to:7,promote:"n"}]
                   };
    blackpawncaptures={
                        48:[{from:48,to:41,promote:""}],
                        40:[{from:40,to:33,promote:""}],
                        32:[{from:32,to:25,promote:""}],
                        24:[{from:24,to:17,promote:""}],
                        16:[{from:16,to:9,promote:""}],
                        8:[{from:8,to:1,promote:"q"},{from:8,to:1,promote:"r"},{from:8,to:1,promote:"b"},{from:8,to:1,promote:"n"}],
                        49:[{from:49,to:40,promote:""},{from:49,to:42,promote:""}],
                        41:[{from:41,to:32,promote:""},{from:41,to:34,promote:""}],
                        33:[{from:33,to:24,promote:""},{from:33,to:26,promote:""}],
                        25:[{from:25,to:16,promote:""},{from:25,to:18,promote:""}],
                        17:[{from:17,to:8,promote:""},{from:17,to:10,promote:""}],
                        9:[{from:9,to:0,promote:"q"},{from:9,to:0,promote:"r"},{from:9,to:0,promote:"b"},{from:9,to:0,promote:"n"},
                              {from:9,to:2,promote:"q"},{from:9,to:2,promote:"r"},{from:9,to:2,promote:"b"},{from:9,to:2,promote:"n"}],
                        50:[{from:50,to:41,promote:""},{from:50,to:43,promote:""}],
                        42:[{from:42,to:33,promote:""},{from:42,to:35,promote:""}],
                        34:[{from:34,to:25,promote:""},{from:34,to:27,promote:""}],
                        26:[{from:26,to:17,promote:""},{from:26,to:19,promote:""}],
                        18:[{from:18,to:9,promote:""},{from:18,to:11,promote:""}],
                        10:[{from:10,to:1,promote:"q"},{from:10,to:1,promote:"r"},{from:10,to:1,promote:"b"},{from:10,to:1,promote:"n"},
                              {from:10,to:3,promote:"q"},{from:10,to:3,promote:"r"},{from:10,to:3,promote:"b"},{from:10,to:3,promote:"n"}],
                        51:[{from:51,to:42,promote:""},{from:51,to:44,promote:""}],
                        43:[{from:43,to:34,promote:""},{from:43,to:36,promote:""}],
                        35:[{from:35,to:26,promote:""},{from:35,to:28,promote:""}],
                        27:[{from:27,to:18,promote:""},{from:27,to:20,promote:""}],
                        19:[{from:19,to:10,promote:""},{from:19,to:12,promote:""}],
                        11:[{from:11,to:2,promote:"q"},{from:11,to:2,promote:"r"},{from:11,to:2,promote:"b"},{from:11,to:2,promote:"n"},
                              {from:11,to:4,promote:"q"},{from:11,to:4,promote:"r"},{from:11,to:4,promote:"b"},{from:11,to:4,promote:"n"}],
                        52:[{from:52,to:43,promote:""},{from:52,to:45,promote:""}],
                        44:[{from:44,to:35,promote:""},{from:44,to:37,promote:""}],
                        36:[{from:36,to:27,promote:""},{from:36,to:29,promote:""}],
                        28:[{from:28,to:19,promote:""},{from:28,to:21,promote:""}],
                        20:[{from:20,to:11,promote:""},{from:20,to:13,promote:""}],
                        12:[{from:12,to:3,promote:"q"},{from:12,to:3,promote:"r"},{from:12,to:3,promote:"b"},{from:12,to:3,promote:"n"},
                              {from:12,to:5,promote:"q"},{from:12,to:5,promote:"r"},{from:12,to:5,promote:"b"},{from:12,to:5,promote:"n"}],
                        53:[{from:53,to:44,promote:""},{from:53,to:46,promote:""}],
                        45:[{from:45,to:36,promote:""},{from:45,to:38,promote:""}],
                        37:[{from:37,to:28,promote:""},{from:37,to:30,promote:""}],
                        29:[{from:29,to:20,promote:""},{from:29,to:22,promote:""}],
                        21:[{from:21,to:12,promote:""},{from:21,to:14,promote:""}],
                        13:[{from:13,to:4,promote:"q"},{from:13,to:4,promote:"r"},{from:13,to:4,promote:"b"},{from:13,to:4,promote:"n"},
                              {from:13,to:6,promote:"q"},{from:13,to:6,promote:"r"},{from:13,to:6,promote:"b"},{from:13,to:6,promote:"n"}],
                        54:[{from:54,to:45,promote:""},{from:54,to:47,promote:""}],
                        46:[{from:46,to:37,promote:""},{from:46,to:39,promote:""}],
                        38:[{from:38,to:29,promote:""},{from:38,to:31,promote:""}],
                        30:[{from:30,to:21,promote:""},{from:30,to:23,promote:""}],
                        22:[{from:22,to:13,promote:""},{from:22,to:15,promote:""}],
                        14:[{from:14,to:5,promote:"q"},{from:14,to:5,promote:"r"},{from:14,to:5,promote:"b"},{from:14,to:5,promote:"n"},
                              {from:14,to:7,promote:"q"},{from:14,to:7,promote:"r"},{from:14,to:7,promote:"b"},{from:14,to:7,promote:"n"}],
                        55:[{from:55,to:46,promote:""}],
                        47:[{from:47,to:38,promote:""}],
                        39:[{from:39,to:30,promote:""}],
                        31:[{from:31,to:22,promote:""}],
                        23:[{from:23,to:14,promote:""}],
                        15:[{from:15,to:6,promote:"q"},{from:15,to:6,promote:"r"},{from:15,to:6,promote:"b"},{from:15,to:6,promote:"n"}]
                      };

    validmoves=blackpawncaptures[element].filter(function(value){if(board.pos[value.to]!=" " && board.pos[value.to]==board.pos[value.to].toUpperCase()) return true; else return false; });
    if(validmoves!=undefined) Array.prototype.push.apply(movelist,validmoves);
    validmoves=blackpawnmoves[element].filter(function(value){if(board.pos[value.to]==" ") return true; else return false; });
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
 *   TODO: En Passant
 */
function MakeMove(board,move)
{
    var rv = CopyBoard(board);
    var piecetype = GetPieceTypes();

// Remove any captured piece
    if(board.pos[move.to]!=" ") {
        rv[piecetype[board.pos[move.to]]]=rv[piecetype[board.pos[move.to]]].filter(function(value){if(value==move.to) { return false; } else { return true; }});
    }
// Place moved/promoted piece on final square
    if(move.promote=="") {
        rv[piecetype[board.pos[move.from]]].push(move.to);
        rv.pos[move.to]=board.pos[move.from];
    } else {
        rv[piecetype[move.promote]].push(move.to);
        rv.pos[move.to]=move.promote;
    }
// Remove moved/promoted piece from original square
    rv[piecetype[board.pos[move.from]]]=rv[piecetype[board.pos[move.from]]].filter(function(value){if(value==move.from) { return false; } else { return true; }});
    rv.pos[move.from]=" ";

    if(move.from==4 && move.to==2 && board.pos[4]=="K") {
        rv.wr.push(3);
        rv.pos[3]="R";
        rv.wr=rv.wr.filter(function(value){if(value==0) { return false; } else { return true; }});
        rv.pos[0]=" ";   
    }
    if(move.from==4 && move.to==6 && board.pos[4]=="K") {
        rv.wr.push(5);
        rv.pos[5]="R";
        rv.wr=rv.wr.filter(function(value){if(value==7) { return false; } else { return true; }});
        rv.pos[7]=" ";   
    }
    if(move.from==60 && move.to==58 && board.pos[60]=="k") {
        rv.br.push(59);
        rv.pos[59]="R";
        rv.br=rv.br.filter(function(value){if(value==56) { return false; } else { return true; }});
        rv.pos[56]=" ";   
    }
    if(move.from==60 && move.to==62 && board.pos[60]=="k") {
        rv.br.push(61);
        rv.pos[61]="R";
        rv.br=rv.br.filter(function(value){if(value==63) { return false; } else { return true; }});
        rv.pos[63]=" ";   
    }

    if(move.from==0 || move.from==4) { rv.wqc=false; }
    if(move.from==4 || move.from==7) { rv.wkc=false; }
    if(move.from==56 || move.from==60) { rv.bqc=false; }
    if(move.from==60 || move.from==63) { rv.bkc=false; }

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
            for(var i=0;i<movelist.length;i++) {
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

    for(var i=0;i<evaluatedmovelist.length && elapsed<3000;i++) {
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
    for(var maxply=1;maxply<maxdepth && evaluatedmovelist.length>1 && elapsed<3000;maxply+=2) {
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
      var move = { from:GetSquareIndex(selected,squareindex),to:GetSquareIndex(id,squareindex),promote:"" };
      if(isObjectInList(move,movelist)) {
        var newboard = MakeMove(board,move);
        sessionStorage.removeItem("selected");
        sessionStorage.removeItem("board");
        sessionStorage.setItem("board", JSON.stringify(newboard));
        document.getElementById("status").innerHTML="Thinking...";
        UpdateHTMLBoard();
        setTimeout('AIMakeMove()',1000);
      } else {
        sessionStorage.removeItem("selected");
      }
    }
    UpdateHTMLBoard();
}

function AIMakeMove()
{
    var piecetype = GetPieceTypes();
    var board = JSON.parse(sessionStorage.getItem("board"));
    var squares = GenerateSquares();
    var squareindex = GenerateSquareIndex();
    var knightmoves = GenerateKnightMoves(squares);
    var movelist = GenerateMoveList(board,squares,squareindex,knightmoves);
    var newboard = {};
    var bookmove = GetBookMove(board);

    if(bookmove.from != bookmove.to)
    {
        document.getElementById("status").innerHTML="My move: " + squares[bookmove.from] + squares[bookmove.to] + " (book, 0)";
        newboard = MakeMove(board,bookmove);
        sessionStorage.removeItem("board");
        sessionStorage.setItem("board", JSON.stringify(newboard));
    } else {
        if(movelist.length > 0)
        {
            var evaluatedmovelist = IncrementalSearch(board,6,squares,squareindex,knightmoves);
            if(evaluatedmovelist[0].eval < -25000) { 
                document.getElementById("status").innerHTML="I resign"; 
            } else {
                document.getElementById("status").innerHTML="My move: " + squares[evaluatedmovelist[0].from]+squares[evaluatedmovelist[0].to] + " (" + evaluatedmovelist[0].eval + ", " + nodes + ")";
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
    var piecetype = GetPieceTypes();
    var board = JSON.parse(sessionStorage.getItem("board"));
    var selected = sessionStorage.getItem("selected");
    var s="";

    for(var i=0;i<squares.length;i++) {
        s="";
        if(squares[i]==selected) {
            s="s";            
        }
        if((Math.floor(i/8)+(i%8))%2==0) {
            document.getElementById(squares[i]).src="b" + piecetype[board.pos[i]] + s + ".bmp";
        } else {
            document.getElementById(squares[i]).src="w" + piecetype[board.pos[i]] + s + ".bmp";
        }
    }
}

// This method from http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
// Thanks to author and stackoverflow user: David Morales
// Thanks to stackoverflow user Teetrinker to link me to this solution.
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
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
    console.log(board.pos[56] + board.pos[57] + board.pos[58] + board.pos[59] + board.pos[60] + board.pos[61] + board.pos[62] + board.pos[63]);
    console.log(board.pos[48] + board.pos[49] + board.pos[50] + board.pos[51] + board.pos[52] + board.pos[53] + board.pos[54] + board.pos[55]);
    console.log(board.pos[40] + board.pos[41] + board.pos[42] + board.pos[43] + board.pos[44] + board.pos[45] + board.pos[46] + board.pos[47]);
    console.log(board.pos[32] + board.pos[33] + board.pos[34] + board.pos[35] + board.pos[36] + board.pos[37] + board.pos[38] + board.pos[39]);
    console.log(board.pos[24] + board.pos[25] + board.pos[26] + board.pos[27] + board.pos[28] + board.pos[29] + board.pos[30] + board.pos[31]);
    console.log(board.pos[16] + board.pos[17] + board.pos[18] + board.pos[19] + board.pos[20] + board.pos[21] + board.pos[22] + board.pos[23]);
    console.log(board.pos[8] + board.pos[9] + board.pos[10] + board.pos[11] + board.pos[12] + board.pos[13] + board.pos[14] + board.pos[15]);
    console.log(board.pos[0] + board.pos[1] + board.pos[2] + board.pos[3] + board.pos[4] + board.pos[5] + board.pos[6] + board.pos[7]);
}

function PrintMoveList(movelist)
{
    for(var i=0;i<movelist.length;i++) 
    {
        console.log(squares[movelist[i].from] + squares[movelist[i].to] + movelist[i].promote + " " + movelist[i].eval);
    }
}

// Explaination of FEN: https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
// Example FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
function GetBoardFromFEN(fen)
{
    var rv=GetEmptyPosition();
    for(var i=0,y=7,x=0;i<fen.length && y>=0;i++) {
        switch(fen[i]) {
            case "K":
                rv.wk.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "Q":
                rv.wq.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "R":
                rv.wr.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "B":
                rv.wb.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "N":
                rv.wn.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "P":
                rv.wp.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "k":
                rv.bk.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "q":
                rv.bq.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "r":
                rv.br.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "b":
                rv.bb.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "n":
                rv.bn.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "p":
                rv.bp.push(y*8+x);
                rv.pos[y*8+x]=fen[i];
                break;
            case "/":
                    y--;
                    x=-1;
                break;;
            case "8":
            case "7":
            case "6":
            case "5":
            case "4":
            case "3":
            case "2":
            case "1":
                x=parseFloat(x)+parseFloat(fen[i])-1;
                break;
            default:
                y=-1;
                break;
        }
        x++;
console.log(x);
    }
    x=-1;
    y=-1;
    while(i<fen.length) {
        switch(fen[i]) {
            case " ": break;
            case "w": rv.tomove="W"; break;
            case "b": rv.tomove="B"; break;
            case "K": rv.wkc=true; break;
            case "Q": rv.wqc=true; break;
            case "k": rv.bkc=true; break;
            case "q": rv.bqc=true; break;
            case "a": x=0; break;
            case "b": x=1; break;
            case "c": x=2; break;
            case "d": x=3; break;
            case "e": x=4; break;
            case "f": x=5; break;
            case "g": x=6; break;
            case "h": x=7; break;
            case "6": y=5; break;
            case "3": y=2; break;
        }
        i++;
    }
    if(x>-1 && y>-1) passant=y*8+x;
    return rv;
}


function CopyBoard(board)
{
    var rv=GetEmptyPosition();
    var i=0;
    for(i=0; i<64;i++) { rv.pos[i]=board.pos[i]; }
    rv.wkc=board.wkc;
    rv.wqc=board.wqc;
    rv.bkc=board.bkc;
    rv.bqc=board.bqc;
    rv.passant=board.passant;
    rv.tomove=board.tomove;
    rv.movenumber=board.movenumber;
    rv.drawcounter=board.drawcounter;
    for(i=0;i<board.wk.length;i++) { rv.wk.push(board.wk[i]); }
    for(i=0;i<board.wq.length;i++) { rv.wq.push(board.wq[i]); }
    for(i=0;i<board.wr.length;i++) { rv.wr.push(board.wr[i]); }
    for(i=0;i<board.wb.length;i++) { rv.wb.push(board.wb[i]); }
    for(i=0;i<board.wn.length;i++) { rv.wn.push(board.wn[i]); }
    for(i=0;i<board.wp.length;i++) { rv.wp.push(board.wp[i]); }
    for(i=0;i<board.bk.length;i++) { rv.bk.push(board.bk[i]); }
    for(i=0;i<board.bq.length;i++) { rv.bq.push(board.bq[i]); }
    for(i=0;i<board.br.length;i++) { rv.br.push(board.br[i]); }
    for(i=0;i<board.bb.length;i++) { rv.bb.push(board.bb[i]); }
    for(i=0;i<board.bn.length;i++) { rv.bn.push(board.bn[i]); }
    for(i=0;i<board.bp.length;i++) { rv.bp.push(board.bp[i]); }
    return rv;
}

/*
 *   MAIN
 */

function main()
{
    var squares = GenerateSquares();
    var squareindex = GenerateSquareIndex();
    var knightmoves = GenerateKnightMoves();
    var evalmovelist = [];

    var initialboard = 
    {
        pos:["R", "N", "B", "Q", "K", "B", "N", "R",
             "P", "P", "P", "P", "P", "P", "P", "P",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             " ", " ", " ", " ", " ", " ", " ", " ",
             "p", "p", "p", "p", "p", "p", "p", "p",
             "r", "n", "b", "q", "k", "b", "n", "r"
            ],
        wkc:true, wqc:true, bkc:true, bqc:true, 
        passant:-1,tomove:"W",
        movenumber:1,drawcounter:0,
        wk:[4],
        wq:[3],
        wr:[0,7],
        wb:[2,5],
        wn:[1,6],
        wp:[8,9,10,11,12,13,14,15],
        bk:[60],
        bq:[59],
        br:[56,63],
        bb:[58,61],
        bn:[57,62],
        bp:[48,49,50,51,52,53,54,55]
    };
    var parameter = "";
//    var board = JSON.parse(JSON.stringify(initialboard));
    var board = CopyBoard(initialboard);
    if (typeof sessionStorage != 'undefined') {
        parameter=getURLParameter("fen");
        if(parameter!="" && parameter!=undefined) {
            board=GetBoardFromFEN(parameter);
        }
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

