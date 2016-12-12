/* 
 *   JavaScript Chess 
 *   
 *   Author: Stefan Alenius 2016-11-18 -- 
 */


/*
 *   Known issues
 *
 *   Opening book (for opening trainer)
 *   Castling while in check
 *   En Passant
 *   Promotion only to queen
 *   Kings are just high valued material
 *   GUI: Drag'n'Drop
 *   Faster movegeneration
 *   faster search using undo move
 *   
 */


/*
 *   Opening Book
 */
var book = [
// 1. 
    { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", moves: ["e2e4","d2d4","c2c4","g1f3"] },
// 1. e4
    { fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", moves: ["c7c5","e7e5","e7e6","c7c6","d7d6","d7d5","g7g6","g8f6","b8c6"] },
// 1. d4
    { fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1", moves: ["g8f6","d7d5","e7e6","f7f5","g7g6","d7d6","c7c5"] },
// 1. e4 c5
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: ["g1f3"] },
// 1. d4 Nf6
    { fen: "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2", moves: ["c2c4","g1f3","c1g5"] },
// 1. e4 c5 2. Nf3
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", moves: ["b8c6","d7d6","e7e6"] },
// 1. d4 Nf6 2. c4
    { fen: "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2", moves: ["e7e6","g7g6","c7c5","d7d6","e7e5"] },
// 1. d4 d5
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", moves: ["c2c4","g1f3"] },
// 1. Nf3
    { fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1", moves: ["g8f6","d7d5","c7c5","g7g6","f7f5","d7d6"] },
// 1. e4 e5
    { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: ["g1f3"] },
// 1. e4 e5 2. Nf3
    { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", moves: ["b8c6", "d7d6"] },
// 1. d4 d5 2. c4
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2", moves: ["e7e6","c7c6","dxc4"] },
// 1. e4 e5 2. Nf3 Nc6
    { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", moves: ["f1b5","f1c4","d2d4","b1c3","c2c3"] },
// 1. d4 Nf6 2. c4 e6
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves: ["b1c3","g1f3","g2g3"] },
// 1. e4 c5 2. Nf3 d6
    { fen: "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", moves: ["d2d4","f1b5","c2c3","b1c3"] },
// 1. c4
    { fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1", moves: ["g8f6","e7e5","e7e6","c7c5","g7g6"] },
// 1. e4 e6
    { fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: ["d2d4"] },
// 1. e4 c5 2. Nf3 d6 3. d4
    { fen: "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3", moves: ["c5d4"] },
// 1. e4 e6 2. d4
    { fen: "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2", moves: ["d7d5"] },
// 1. e4 e6 2. d4 d5
    { fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3", moves: ["b1c3","b1d2","e4e5","e4d5"] },
// 1. e4 c5 2. Nf3 d6 3. d4 cxd4
    { fen: "rnbqkbnr/pp2ppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4", moves: ["f3d4"] },
// 1. d4 Nf6 2. c4 g6
    { fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves: ["b1c3","g1f3","g2g3","f2f3"] },
// 1. e4 e5 2. Nf3 Nc6 3. Bb5
    { fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", moves: ["a7a6","g8f6","f7f5","d7d6","f8c5","g8e7","c6d4","g7g6"] },
// 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4
    { fen: "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4", moves: ["g8f6"] },
// 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6
    { fen: "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5", moves: ["b1c3"] },
// 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3
    { fen: "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5", moves: ["a7a6","g7g6","b8c6","e7e6","c8d7","e7e5"] },
// 1. e4 c5 2. Nf3 e6
    { fen: "rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", moves: ["d2d4","b1c3","c2c3","d2d3"] },
// 1. Nf3 Nf6
    { fen: "rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2", moves: ["c2c4","g2g3","d2d4","b2b3"] },
// 1. d4 d5 2. c4 c6
    { fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves: ["g1f3","b1c3","c4d5","e2e3"] },
// 1. e4 c5 2. Nf3 Nc6
    { fen: "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", moves: ["d2d4","f1b5","b1c3","c2c3","d2d3"] },
// 1. d4 Nf6 2. Nf3
    { fen: "rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 2 2", moves: ["g7g6","e7e6","d7d5","c7c5","d7d6","b7b6","b7b5","c7c6"] },
// 1. d4 Nf6 2. c4 g6 3. Nc3
    { fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3", moves: ["f8g7","d7d5","d7d6","c7c5"] },
// 1. e4 c6
    { fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: ["d2d4"] },
// 1. e4 e5 2. Nf3 Nc6 3. Bb5 a6
    { fen: "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", moves: ["b5a4","b5c6"] },
// 1. e4 c5 2. Nf3 e6 3. d4 cxd4
    { fen: "rnbqkbnr/pp1p1ppp/4p3/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4", moves: ["f3d4"] },
// 1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4
    { fen: "rnbqkbnr/pp1p1ppp/4p3/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4", moves: ["a7a6","b8c6","g8f6"] },
// 1. e4 c5 2. Nf3 e6 3. d4
    { fen: "rnbqkbnr/pp1p1ppp/4p3/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3", moves: ["c5d4"] },
// 1. d4 Nf6 2. c4 e6 3. Nf3
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3", moves: ["d7d5","b7b6","f8b4","c7c5"] },
// 1. d4 Nf6 2. c4 e6 3. Nc3
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3", moves: ["f8b4"] },
// 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6	
    { fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", moves: ["c1e3","c1g5","f1e2","f1c4","f2f4","h2h3","f2f3","g2g3"] },
// 1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4
//    { fen: "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4", moves: ["g8f6","d7d6","b7b5","g8e7","f7f5","f8c5"] },
    { fen: "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4", moves: ["g8f6","d7d6","g8e7","f7f5"] },
// 1. Nf3 Nf6 2. c4	
    { fen: "rnbqkb1r/pppppppp/5n2/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 0 2", moves: ["e7e6","g7g6","c7c5"] },
// 1. e4 c6 2. d4	
    { fen: "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2", moves: ["d7d5"] },
// 1. d4 Nf6 2. c4 e6 3. Nc3 Bb4
    { fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", moves: ["e2e3","d1c2","g1f3","f2f3"] },
// 1. Nf3 d5	
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2", moves: ["d2d4","g2g3","c2c4"] },
// 1. e4 c6 2. d4 d5
    { fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3", moves: ["b1c3","e4e5","e4d5","b1d2","f2f3"] },
// 1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6	
    { fen: "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 5", moves: ["e1g1","d2d3","d1e2","d2d4","b1c3"] },
// 1. d4 d5 2. c4 c6 3. Nf3
    { fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3", moves: ["g8f6","e7e6"] },
// 1. d4 d5 2. c4 c6 3. Nf3 Nf6	
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4", moves: ["b1c3","e2e3"] },
	
    { fen: "rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", moves: [""] },
    { fen: "r1bqkbnr/pp1ppppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3", moves: [""] },
    { fen: "r1bqkbnr/pp1ppppp/2n5/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "r1bqkbnr/pp1ppppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves: [""] },
    { fen: "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp1pppp/5n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pppppp1p/5np1/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq - 1 3", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/5n2/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 1 2", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2", moves: [""] },
    { fen: "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3", moves: [""] },
    { fen: "rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3", moves: [""] },
// 1. e4 c5 2. Nc3
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2", moves: ["b8c6","e7e6","d7d6","a7a6","g7g6"] },
    { fen: "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3", moves: [""] },
// 1. e4 c5 2. c3
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 2", moves: ["d7d5","g8f6","e7e6","d7d6","g7g6","b8c6","e7e5"] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 1 4", moves: [""] },
    { fen: "rnbqk1nr/ppppppbp/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3", moves: [""] },
    { fen: "rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5", moves: [""] },
    { fen: "r1bqkb1r/pp1ppppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5", moves: [""] },
    { fen: "r1bqkb1r/pp1ppppp/2n2n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3", moves: [""] },
    { fen: "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2", moves: [""] },
    { fen: "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", moves: [""] },
    { fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3", moves: [""] },
    { fen: "rnbqkbnr/pppp1ppp/4p3/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5", moves: [""] },
    { fen: "rnbqkb1r/pppppp1p/5np1/8/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", moves: [""] },
    { fen: "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4", moves: [""] },
    { fen: "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/3p4/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3", moves: [""] },
    { fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b KQkq - 3 4", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/5n2/8/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2", moves: [""] },
    { fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/5n2/8/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 2 2", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", moves: [""] },
    { fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves: [""] },
    { fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6", moves: [""] },
    { fen: "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/pppp1ppp/4p3/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/3p4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 3", moves: [""] },
    { fen: "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5", moves: [""] },
    { fen: "rnbqkbnr/pppppp1p/6p1/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 2 2", moves: [""] },
    { fen: "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3", moves: [""] },
    { fen: "rnbqk1nr/ppp2ppp/4p3/3pP3/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5", moves: [""] },
    { fen: "rnbqk2r/ppppppbp/5np1/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 1 4", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", moves: [""] },
    { fen: "r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 3 6", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/8/P1pP4/2N2N2/1P2PPPP/R1BQKB1R b KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5NP1/PP2PP1P/RNBQKB1R b KQkq - 0 4", moves: [""] },
    { fen: "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3", moves: [""] },
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 0 2", moves: [""] },
    { fen: "rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5", moves: [""] },
    { fen: "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 1 2", moves: [""] },
    { fen: "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1", moves: [""] },
    { fen: "rnbqkb1r/pppppp1p/5np1/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R b KQkq - 1 3", moves: [""] },
    { fen: "r1b1kbnr/ppqp1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 3 6", moves: [""] },
    { fen: "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4", moves: [""] },
    { fen: "rn1qkbnr/pp2pppp/2p5/5b2/3P4/6N1/PPP2PPP/R1BQKBNR b KQkq - 2 5", moves: [""] },
    { fen: "rn1qkbnr/pp2pppp/2p3b1/8/3P4/6N1/PPP2PPP/R1BQKBNR w KQkq - 3 6", moves: [""] },
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/3B4/PPP2PPP/RNBQK2R b KQkq - 1 5", moves: [""] },
    { fen: "r1bqkb1r/pp1p1ppp/2n2n2/4p3/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", moves: [""] },
    { fen: "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4", moves: [""] },
    { fen: "r1bqkb1r/pp1p1ppp/2n2n2/1N2p3/4P3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 6", moves: [""] },
    { fen: "rnbqk2r/ppppppbp/5np1/8/2PP4/5NP1/PP2PP1P/RNBQKB1R b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/6p1/3n4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/5np1/3P4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", moves: [""] },
    { fen: "r1bqkb1r/pp3ppp/2np1n2/1N2p3/4P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 7", moves: [""] },
    { fen: "r1bqkb1r/pp3ppp/2nppn2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R w KQkq - 0 7", moves: [""] },
    { fen: "rn1qkb1r/p1pp1ppp/bp2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R w KQkq - 1 5", moves: [""] },
    { fen: "rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2", moves: [""] },
    { fen: "rn1qkb1r/pp2pppp/2p2n2/5b2/P1pP4/2N2N2/1P2PPPP/R1BQKB1R w KQkq - 1 6", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp1ppppp/2p5/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/8/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 0 2", moves: [""] },
    { fen: "r1bqkb1r/pp3ppp/2nppn2/6B1/3NP3/2N5/PPPQ1PPP/R3KB1R b KQkq - 1 7", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N1P3/PP3PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 1 3", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/3p1n2/4p3/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/3p1n2/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/3p4/8/4n3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/1p2pppp/p1p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/pppp1ppp/4pn2/8/2P5/5NP1/PP1PPP1P/RNBQKB1R b KQkq - 0 3", moves: [""] },
    { fen: "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 3", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4", moves: [""] },
    { fen: "rnbqkb1r/1p2pppp/p2p1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq - 1 6", moves: [""] },
    { fen: "r1bqkb1r/1p3ppp/p1np1n2/1N2p1B1/4P3/2N5/PPP2PPP/R2QKB1R w KQkq - 0 8", moves: [""] },
    { fen: "r1bqkb1r/pp3ppp/2np1n2/1N2p1B1/4P3/2N5/PPP2PPP/R2QKB1R b KQkq - 1 7", moves: [""] },
    { fen: "rnbqkb1r/pp1ppppp/5n2/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq - 1 3", moves: [""] },
    { fen: "r1bqkb1r/1p3ppp/p1np1n2/4p1B1/4P3/N1N5/PPP2PPP/R2QKB1R b KQkq - 1 8", moves: [""] },
    { fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/8/3nP3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3", moves: [""] },
    { fen: "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pp1ppppp/5n2/2p1P3/8/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkb1r/pp1ppppp/8/2pnP3/8/2P5/PP1P1PPP/RNBQKBNR w KQkq - 1 4", moves: [""] },
    { fen: "rnbqk2r/ppppppbp/5np1/8/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 2 4", moves: [""] },
    { fen: "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7", moves: [""] },
    { fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 2 4", moves: [""] },
    { fen: "rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 5", moves: [""] },
    { fen: "r1bqkb1r/5ppp/p1np1n2/1p2p1B1/4P3/N1N5/PPP2PPP/R2QKB1R w KQkq - 0 9", moves: [""] },
    { fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 1 6", moves: [""] },
    { fen: "rnbqkbnr/pppp1ppp/8/4p3/2P5/6P1/PP1PPP1P/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 1 6", moves: [""] },
    { fen: "r1bqkbnr/pp1ppp1p/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", moves: [""] },
    { fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq - 3 4", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "rnbqk1nr/ppp1ppbp/3p2p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pp3ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 5", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/6p1/3n4/3PP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 5", moves: [""] },
    { fen: "r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq - 2 4", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR b KQkq - 0 6", moves: [""] },
    { fen: "rnbqkb1r/ppp1pp1p/6p1/8/3PP3/2n5/PP3PPP/R1BQKBNR w KQkq - 0 6", moves: [""] },
    { fen: "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/2p5/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/ppp1pppp/3p4/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2", moves: [""] },
    { fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6", moves: [""] },
    { fen: "rnbqk2r/ppp1ppbp/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR w KQkq - 1 7", moves: [""] },
    { fen: "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 1 4", moves: [""] },
    { fen: "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rn1qkbnr/pp2pppp/2p3b1/8/3P3P/6N1/PPP2PP1/R1BQKBNR b KQkq - 0 6", moves: [""] },
    { fen: "rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/6N1/PPP2PP1/R1BQKBNR w KQkq - 0 7", moves: [""] },
    { fen: "rnbqkb1r/pppppppp/8/3nP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", moves: [""] },
    { fen: "r1bqkb1r/pp2pppp/2np1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq - 4 6", moves: [""] },
    { fen: "rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/P1N5/1PP2PPP/R1BQKBNR b KQkq - 0 5", moves: [""] },
    { fen: "rnbqkb1r/pp1p1ppp/4pn2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5", moves: [""] },
    { fen: "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 0 5", moves: [""] },
    { fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", moves: [""] },
    { fen: "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3pP3/3P4/8/PPPN1PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pppn1ppp/4p3/3pP3/3P4/8/PPPN1PPP/R1BQKBNR w KQkq - 1 5", moves: [""] },
    { fen: "rnbqkb1r/1p3ppp/p2ppn2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R w KQkq - 0 7", moves: [""] },
    { fen: "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/ppp2ppp/4pn2/3pP3/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkbnr/pp2pppp/8/3p4/2PP4/8/PP3PPP/RNBQKBNR b KQkq - 0 4", moves: [""] },
    { fen: "rnbqkb1r/pppn1ppp/4p3/3pP3/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 1 5", moves: [""] },
    { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 3", moves: [""] },
    { fen: "rnbqkb1r/pp1p1ppp/4pn2/2p5/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4", moves: [""] },
// 1. c4 g6
    { fen: "rnbqkbnr/pppppp1p/6p1/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/5n2/3p4/2PP4/8/PP3PPP/RNBQKBNR w KQkq - 1 5", moves: [""] },
    { fen: "rnbqk2r/ppppppbp/5np1/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 2 4", moves: [""] },
// 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3
    { fen: "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7", moves: [""] },
    { fen: "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3", moves: [""] },
    { fen: "rnbqkb1r/pp1p1ppp/4pn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5", moves: [""] },
    { fen: "rnbqkb1r/pp2pppp/5n2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR b KQkq - 2 5", moves: [""] },
    { fen: "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4", moves: [""] },
    { fen: "rn1qkbnr/pp1bpppp/3p4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4", moves: [""] },
// 1. e4 c5 2. d4
    { fen: "rnbqkbnr/pp1ppppp/8/2p5/3PP3/8/PPP2PPP/RNBQKBNR b KQkq -", moves: ["c5d4"] }

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

/*
function GetBookMove(board)
{
    var move = {from: "a1", to: "a1", promote: ""};
    var temp = GetEmptyPosition();
    for(var i=0;i<book.length;i++) {
        temp=GetBoardFromFEN(book[i].fen);
        if(JSON.stringify(board.pos)==JSON.stringify(temp.pos) && board.tomove==temp.tomove) {
            move = book[i].moves[Math.floor(Math.random()*book[i].moves.length)];
        }
    }
    return move;    
}
*/

// TODO: GetBookMove can not handle promotion.
function GetBookMove(board)
{
    var squareindex=GenerateSquareIndex();
    var move = {from: "a1", to: "a1", promote: ""};
    var temp = GetEmptyPosition();
    var movestr = "";

    for(var i=0;i<book.length;i++) {
        temp=GetBoardFromFEN(book[i].fen);
        if(JSON.stringify(board.pos)==JSON.stringify(temp.pos) && board.tomove==temp.tomove) {   
            movestr = book[i].moves[Math.floor(Math.random()*book[i].moves.length)];
            move = { from: GetSquareIndex(movestr.substring(0,2),squareindex), to: GetSquareIndex(movestr.substring(2,4),squareindex), promote: ""};
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
    validmoves=whitepawnmoves[element].filter(function(value){if(board.pos[value.to]==" " && (value.to-value.from==8 || board.pos[value.from+8]==" ")) return true; else return false; });
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
    validmoves=blackpawnmoves[element].filter(function(value){if(board.pos[value.to]==" " && (value.from-value.to==8 || board.pos[value.from-8]==" ")) return true; else return false; });
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
        if(board.wk.length>0 && board.drawcounter<100) {
            board.wp.forEach(function(element,index,array) { AddWhitePawnMovesToMoveList(element,board,movelist); });
            board.wn.forEach(function(element,index,array) { AddKnightMovesToMoveList(element,board,movelist,knightmoves); });
            board.wb.forEach(function(element,index,array) { AddBishopMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.wr.forEach(function(element,index,array) { AddRookMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.wq.forEach(function(element,index,array) { AddQueenMovesToMoveList(element,board,squares,squareindex,movelist); });
            board.wk.forEach(function(element,index,array) { AddKingMovesToMoveList(element,board,squares,squareindex,movelist); });
        }
    } else {
        if(board.bk.length>0 && board.drawcounter<100) {
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

    rv.drawcounter=board.drawcounter+1;
    if(board.pos[move.from]=='P' || board.pos[move.from]=='p') rv.drawcounter=0;
// Remove any captured piece
    if(board.pos[move.to]!=" ") {
        rv[piecetype[board.pos[move.to]]]=rv[piecetype[board.pos[move.to]]].filter(function(value){if(value==move.to) { return false; } else { return true; }});
        rv.drawcounter=0;
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
        rv.pos[59]="r";
        rv.br=rv.br.filter(function(value){if(value==56) { return false; } else { return true; }});
        rv.pos[56]=" ";   
    }
    if(move.from==60 && move.to==62 && board.pos[60]=="k") {
        rv.br.push(61);
        rv.pos[61]="r";
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

function MakeMoveWithUndo(board,move)
{
    var piecetype = GetPieceTypes();
    var piecefrom = board.pos[move.from];
    var piecetypefrom = piecetype[piecefrom];
    var pieceto = board.pos[move.to]
    var piecetypeto = piecetype[pieceto];
    var temp;
    var undo = { pos : [] };
    var i=0;

// Gather Undo Information
    undo.drawcounter=board.drawcounter;
    undo.pos[move.to]=board.pos[move.to];
    undo.pos[move.from]=board.pos[move.from];
    undo[piecetypefrom]=[];
    for(i=0;i<board[piecetypefrom].length;i++) undo[piecetypefrom].push(board[piecetypefrom][i]);
    undo.tomove=board.tomove;

// Update DrawCounter
    board.drawcounter++;
    if(board.pos[move.from]=='P' || board.pos[move.from]=='p') board.drawcounter=0;

// Remove any captured piece
    if(board.pos[move.to]!=" ") {
        undo[piecetypeto]=[];
        for(i=0;i<board[piecetypeto].length;i++) undo[piecetypeto].push(board[piecetypeto][i]);

        temp=board[piecetypeto].filter(function(value){if(value==move.to) { return false; } else { return true; }});
        board[piecetypeto]=temp;
        board.drawcounter=0;
    }

// Place moved/promoted piece on final square
    if(move.promote=="") {
        undo[piecetypefrom]=[];
        for(i=0;i<board[piecetypefrom].length;i++) undo[piecetypefrom].push(board[piecetypefrom][i]);

        board[piecetypefrom].push(move.to);
        board.pos[move.to]=board.pos[move.from];
    } else {
        undo[piecetype[move.promote]]=[];
        for(i=0;i<board[piecetype[move.promote]].length;i++) undo[piecetype[move.promote]].push(board[piecetype[move.promote]]);

        board[piecetype[move.promote]].push(move.to);
        board.pos[move.to]=move.promote;
    }

// Remove moved/promoted piece from original square
    temp=board[piecetypefrom].filter(function(value){if(value==move.from) { return false; } else { return true; }});
    board[piecetypefrom]=temp;
    board.pos[move.from]=" ";

// Castling
    if(move.from==4 && move.to==2 && board.pos[4]=="K") {
        undo.wr=[];
        for(i=0;i<board.wr.length;i++) undo.wr.push(board.wr[i]);
        undo.pos[0]=board.pos[0];
        undo.pos[3]=board.pos[3];

        board.wr.push(3);
        board.pos[3]="R";
        temp=board.wr.filter(function(value){if(value==0) { return false; } else { return true; }});
        board.wr=temp;
        board.pos[0]=" ";   
    }
    if(move.from==4 && move.to==6 && board.pos[4]=="K") {
        undo.wr=[];
        for(i=0;i<board.wr.length;i++) undo.wr.push(board.wr[i]);
        undo.pos[5]=board.pos[5];
        undo.pos[7]=board.pos[7];

        board.wr.push(5);
        board.pos[5]="R";
        temp=board.wr.filter(function(value){if(value==7) { return false; } else { return true; }});
        board.wr=temp;
        board.pos[7]=" ";   
    }
    if(move.from==60 && move.to==58 && board.pos[60]=="k") {
        undo.br=[];
        for(i=0;i<board.br.length;i++) undo.br.push(board.br[i]);
        undo.pos[56]=board.pos[56];
        undo.pos[59]=board.pos[59];

        board.br.push(59);
        board.pos[59]="r";
        temp=board.br.filter(function(value){if(value==56) { return false; } else { return true; }});
        board.br=temp;
        board.pos[56]=" ";   
    }
    if(move.from==60 && move.to==62 && board.pos[60]=="k") {
        undo.br=[];
        for(i=0;i<board.br.length;i++) undo.br.push(board.br[i]);
        undo.pos[61]=board.pos[61];
        undo.pos[63]=board.pos[63];

        board.br.push(61);
        board.pos[61]="r";
        temp=board.br.filter(function(value){if(value==63) { return false; } else { return true; }});
        board.br=temp;
        board.pos[63]=" ";   
    }

    if(move.from==0 || move.from==4) { undo.wqc=board.wqc; board.wqc=false; }
    if(move.from==4 || move.from==7) { undo.wkc=board.wkc; board.wkc=false; }
    if(move.from==56 || move.from==60) { undo.bqc=board.bqc; board.bqc=false; }
    if(move.from==60 || move.from==63) { undo.bkc=board.bkc; board.bkc=false; }

// Flip side to move
    if(isWhiteToMove(board)) {
        board.tomove="B";
    } else {
        board.tomove="W";
    }
    //return board;
    return undo;
}

function UndoMove(board,undo)
{
    var key="";
    for(key in undo.pos) board.pos[key]=undo.pos[key];
    for(key in undo) if(key!="pos") board[key]=undo[key];
    return board;
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
    var undo = "";

    if(movelist.length==0 || board.drawcounter>99) {
        return EndOfGameEvaluation(board,ply);
    } else {
        if(ply==0) {
            return Evaluation(board,movelist.length,squares,squareindex,knightmoves);
        } else {
            for(var i=0;i<movelist.length;i++) {
                // When using JSON.stringify and JSON.parse to make undo, it is better to skip undo...
                // 40k in 7,5s - 15k in 3,2s
                //newboard=MakeMove(board,movelist[i]);
                //alfa=Math.max(alfa,-AlfaBeta(newboard,ply-1,-beta,-alfa,squares,squareindex,knightmoves));

                // 40k in 7,2s - 15k in 3,0s
                undo=MakeMoveWithUndo(board,movelist[i]);
                alfa=Math.max(alfa,-AlfaBeta(board,ply-1,-beta,-alfa,squares,squareindex,knightmoves));
                board=UndoMove(board,undo);

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
/*
        if (typeof performance != 'undefined') {
            t1 = performance.now();
            elapsed=t1-t0;      
        } else {
            t1 = process.hrtime(t0);
            elapsed=Math.round((t1[0]*1000) + (t1[1]/1000000));    
        }
*/
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
    for(var maxply=1;maxply<maxdepth && evaluatedmovelist.length>1 && elapsed<300000;maxply+=2) {
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
    if(board.drawcounter>99) return 0;
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
      var move2 = { from:GetSquareIndex(selected,squareindex),to:GetSquareIndex(id,squareindex),promote:"Q" };
      if(isObjectInList(move,movelist) || isObjectInList(move2,movelist)) {
        if(isObjectInList(move,movelist)) {
            var newboard = MakeMove(board,move);
        } else {
            var newboard = MakeMove(board,move2);
        }
        sessionStorage.removeItem("selected");
        sessionStorage.removeItem("board");
        sessionStorage.setItem("board", JSON.stringify(newboard));
        document.getElementById("status").innerHTML="Thinking...";
        if(isWhiteToMove(newboard)) {
            document.getElementById("players").innerHTML="White: AI - Black: Human";
        } else {
            document.getElementById("players").innerHTML="White: Human - Black: AI";
        }
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

    if(isWhiteToMove(board)) {
        document.getElementById("players").innerHTML="White: AI - Black: Human";
    } else {
        document.getElementById("players").innerHTML="White: Human - Black: AI";
    }
    document.getElementById("status").innerHTML="Thinking...";
    if(bookmove.from != bookmove.to)
    {
        document.getElementById("status").innerHTML="My move: " + squares[bookmove.from] + squares[bookmove.to] + " (bookmove)";
        newboard = MakeMove(board,bookmove);
        sessionStorage.removeItem("board");
        sessionStorage.setItem("board", JSON.stringify(newboard));
    } else {
        if(movelist.length > 0)
        {
            var evaluatedmovelist = IncrementalSearch(board,4,squares,squareindex,knightmoves);
            if(evaluatedmovelist[0].eval < -25000) { 
                document.getElementById("status").innerHTML="<H1>You win!</H1>";
            } else {
                newboard = MakeMove(board,evaluatedmovelist[0]);
                document.getElementById("status").innerHTML="My move: " + squares[evaluatedmovelist[0].from]+squares[evaluatedmovelist[0].to] + " (Eval=" + evaluatedmovelist[0].eval + ", Nodes=" + nodes + ", DrawCounter=" + newboard.drawcounter + ")";
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
    document.getElementById("status").innerHTML="White to move (click on players above to make AI move)";
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

