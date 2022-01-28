import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from '../../referee/Referee';
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Piece, PieceType, TeamType, initialBoardState, Position } from '../../Constants';

export default function Chessboard() {
	const [ activePiece, setActivePiece ] = useState<HTMLElement | null>(null);
	const [ grabPosition, setGrabPosition ] = useState<Position>({ x: -1, y: -1 });
	const [ pieces, setPieces ] = useState<Piece[]>(initialBoardState);
	const chessboardRef = useRef<HTMLDivElement>(null);
	const referee = new Referee();

	function grabPiece(e: React.MouseEvent) {
		const element = e.target as HTMLElement;
		const chessboard = chessboardRef.current;
		if (element.classList.contains('chess-piece') && chessboard) {
			// inverse y axis == switch to Math.ceil
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
			setGrabPosition({ x: grabX, y: grabY });
			const x = e.clientX - GRID_SIZE / 2;
			const y = e.clientY - GRID_SIZE / 2;
			element.style.position = 'absolute';
			element.style.left = `${x}px`; 
			element.style.top = `${y}px`;

			setActivePiece(element);
		}
	}

	function movePiece(e: React.MouseEvent) {
		const chessboard = chessboardRef.current;
		if (activePiece && chessboard) {
			const minX = chessboard.offsetLeft - 25;
			const minY = chessboard.offsetTop - 25;
			const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
			const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
			const x = e.clientX - 50;
			const y = e.clientY - 50;
			activePiece.style.position = 'absolute';
			// activePiece.style.left = `${x}px`;
			// activePiece.style.top = `${y}px`;

			//if x is smaller than minimum amount
			if (x < minX) {
				activePiece.style.left = `${minX}px`;
				//if x is bigger than minimum amount
			} else if (x > maxX) {
				activePiece.style.left = `${maxX}px`;
				//if x is in the constraints
			} else {
				activePiece.style.left = `${x}px`;
			}

			//if y is smaller than minimum amount
			if (y < minY) {
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

		if (activePiece && chessboard) {
			// subtract grid position from 800 to switch start position to bottom left
			const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
			// inverse y axis == switch to Math.ceil
			const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
			const currentPiece = pieces.find((p) => p.position.x === grabPosition.x && p.position.y === grabPosition.y);
            
			if (currentPiece) {
				const validMove = referee.isValidMove(grabPosition.x, grabPosition.y, x, y, currentPiece.type, currentPiece.team, pieces);

				const isEnPassantMove = referee.isEnPassantMove(
					grabPosition.x,
					grabPosition.y,
					x,
					y,
					currentPiece.type,
					currentPiece.team,
					pieces
				);

				const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

				if (isEnPassantMove) {
					const updatedPieces = pieces.reduce(
						(results, piece) => {
							if (piece.position.x === grabPosition.x && piece.position.y === grabPosition.y) {
								piece.enPassant = false;
								piece.position.x = x;
								piece.position.y = y;
								results.push(piece);
							} else if (!(piece.position.x === x && piece.position.y === y - pawnDirection)) {
								if (piece.type === PieceType.PAWN) {
									piece.enPassant = false;
								}
							}

							return results;
						},
						[] as Piece[]
					);

					setPieces(updatedPieces);
				} else if (validMove) {
					// updates the piece position
					// if a piece is attacked, remove piece
					const updatedPieces = pieces.reduce(
						(results, piece) => {
							if (piece.position.x === grabPosition.x && piece.position.y === grabPosition.y) {
								if (Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN) {
									//special move
									// console.log("En Passant true")
									piece.enPassant = true;
								} else {
									piece.enPassant = false;
								}
								piece.position.x = x;
								piece.position.y = y;
								results.push(piece);
							} else if (!(piece.position.x === x && piece.position.y === y)) {
								if (piece.type === PieceType.PAWN) {
									piece.enPassant = false;
								}
								results.push(piece);
							}
							return results;
						},
						[] as Piece[]
					);

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

	for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
		for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
			const number = j + i + 2;
            const piece = pieces.find(p => p.position.x === i && p.position.y === j);
            let image = piece ? piece.image : undefined;

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
	return (
		<div
			onMouseMove={(e) => movePiece(e)}
			onMouseDown={(e) => grabPiece(e)}
			onMouseUp={(e) => dropPiece(e)}
			id="chessboard"
			ref={chessboardRef}
		>
			{board}
		</div>
	);
}