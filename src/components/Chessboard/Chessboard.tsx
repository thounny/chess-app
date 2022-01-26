import './Chessboard.css';
import Tile from "../Tile/Tile";
import React, { useRef, useState } from "react";
import Referee from "../../referee/Referee";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

export interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
}

export enum TeamType {
    OPPONENT,
    OUR
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

const initialBoardState: Piece[] = [];

    for (let p = 0; p < 2; p++) {
        const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
        const type = (teamType === TeamType.OPPONENT) ? "B" : "W";
        const y = (teamType === TeamType.OPPONENT) ? 7 : 0;
    
        initialBoardState.push({ image: `assets/images/${type}_Rook.png`, x: 0, y, type: PieceType.ROOK, team: teamType})
        initialBoardState.push({ image: `assets/images/${type}_Rook.png`, x: 7, y, type: PieceType.ROOK, team: teamType })
    
        initialBoardState.push({ image: `assets/images/${type}_Knight.png`, x: 1, y, type: PieceType.KNIGHT, team: teamType })
        initialBoardState.push({ image: `assets/images/${type}_Knight.png`, x: 6, y, type: PieceType.KNIGHT, team: teamType })
    
        initialBoardState.push({ image: `assets/images/${type}_Bishop.png`, x: 2, y, type: PieceType.BISHOP, team: teamType })
        initialBoardState.push({ image: `assets/images/${type}_Bishop.png`, x: 5, y, type: PieceType.BISHOP, team: teamType })
    
        initialBoardState.push({ image: `assets/images/${type}_Queen.png`, x: 3, y, type: PieceType.QUEEN, team: teamType })
        initialBoardState.push({ image: `assets/images/${type}_King.png`, x: 4, y, type: PieceType.KING, team: teamType })
    }
    
    for(let i = 0; i < 8; i++) {
        initialBoardState.push({image: "assets/images/B_Pawn.png", x: i, y: 6, type: PieceType.PAWN, team: TeamType.OPPONENT});
    }
    
    for(let i = 0; i < 8; i++) {
        initialBoardState.push({image: "assets/images/W_Pawn.png", x: i, y: 1, type: PieceType.PAWN, team: TeamType.OUR});
    }

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if(element.classList.contains("chess-piece") && chessboard) {
        // inverse y axis == switch to Math.ceil
        setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
        setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));        
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        setActivePiece(element);
    }
}

function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard) {
        const minX = chessboard.offsetLeft - 25;
        const minY = chessboard.offsetTop - 25;
        const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
        const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        activePiece.style.position = "absolute";
        // activePiece.style.left = `${x}px`;
        // activePiece.style.top = `${y}px`;

        //if x is smaller than minimum amount
        if(x < minX) {
            activePiece.style.left = `${minX}px`;
        //if x is bigger than minimum amount
        } else if (x > maxX) {
            activePiece.style.left = `${maxX}px`;
        //if x is in the constraints
        } else {
            activePiece.style.left = `${x}px`;
        }

        //if y is smaller than minimum amount
        if(y < minY) {
            activePiece.style.top = `${minY}px`;
        //if y is bigger than minimum amount
        } else if (y > maxY) {
            activePiece.style.top = `${maxY}px`;
        //if y is in the constraints
        } else {
            activePiece.style.top = `${y}px`;
        }
    }
}

function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;

    if(activePiece && chessboard) {
        // subtract grid position from 800 to switch start position to bottom left
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
        // inverse y axis == switch to Math.ceil
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

        const currentPiece = pieces.find((p) => p.x === gridX && p.y === gridY);
        const attackedPiece = pieces.find((p) => p.x === x && p.y === y);

        if(currentPiece) {
            const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);

            const isEnPassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);

            const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

            if(isEnPassantMove) {
                const updatedPieces = pieces.reduce((results, piece) => {
                    if(piece.x === gridX && piece.y === gridY) {
                        piece.enPassant = false;
                        piece.x = x;
                        piece.y = y;
                        results.push(piece);
                    } else if(!(piece.x === x && piece.y === y - pawnDirection)) {
                        if(piece.type === PieceType.PAWN) {
                            piece.enPassant = false;
                        }
                    }

                    return results;
                }, [] as Piece[])

                setPieces(updatedPieces);
            } else if(validMove) {
            // updates the piece position
            // if a piece is attacked, remove piece
            const updatedPieces = pieces.reduce((results, piece) => {

                if(piece.x === gridX && piece.y === gridY) {
                    if(Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN) {
                        //special move
                        // console.log("En Passant true")
                        piece.enPassant = true;
                    } else {
                        piece.enPassant = false;
                    }
                    piece.x = x;
                    piece.y = y;
                    results.push(piece);
                } else if(!(piece.x === x && piece.y === y)) {
                    if(piece.type === PieceType.PAWN) {
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);

            setPieces(updatedPieces);
        } else {
            // resets the piece position
            activePiece.style.position = 'relative';
            activePiece.style.removeProperty('top');
            activePiece.style.removeProperty('left');
        }
        }
        setActivePiece(null);
    }
}

    let board = [];

    for(let j = verticalAxis.length - 1; j >= 0; j--) {
        for(let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = undefined;

            pieces.forEach(p => {
                if(p.x === i && p.y === j) {
                    image = p.image;
                }
            });

    /*even numbers = dark tile
    odd numbers = light tile
    */

            board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
        }
    }

    //         if(number % 2 === 0) {
    //             board.push(<Tile/>);
    //                 // [{horizontalAxis[i]}{verticalAxis[j]}]
    //         } else {
    //             board.push(<Tile/>);
    //                 // [{horizontalAxis[i]}{verticalAxis[j]}]
    //         }
    //     }
    // }
    return( 
        <div
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={e => grabPiece(e)}
            onMouseUp={(e) => dropPiece(e)}
            id="chessboard"
            ref={chessboardRef}
            >
            {board}
        </div>
    );
}