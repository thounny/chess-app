import React, { useRef, useState } from "react";
import './Chessboard.css';
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";
import { verticalAxis, horizontalAxis, Piece, PieceType, TeamType, initialBoardState } from "../../Constants";

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

        const currentPiece = pieces.find((p) => p.position.x === gridX && p.position.y === gridY);
        const attackedPiece = pieces.find((p) => p.position.x === x && p.position.y === y);

        if(currentPiece) {
            const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);

            const isEnPassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);

            const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

            if(isEnPassantMove) {
                const updatedPieces = pieces.reduce((results, piece) => {
                    if(piece.position.x === gridX && piece.position.y === gridY) {
                        piece.enPassant = false;
                        piece.position.x = x;
                        piece.position.y = y;
                        results.push(piece);
                    } else if(!(piece.position.x === x && piece.position.y === y - pawnDirection)) {
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

                if(piece.position.x === gridX && piece.position.y === gridY) {
                    if(Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN) {
                        //special move
                        // console.log("En Passant true")
                        piece.enPassant = true;
                    } else {
                        piece.enPassant = false;
                    }
                    piece.position.x = x;
                    piece.position.y = y;
                    results.push(piece);
                } else if(!(piece.position.x === x && piece.position.y === y)) {
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
                if(p.position.x === i && p.position.y === j) {
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