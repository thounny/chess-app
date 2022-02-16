import { PieceType, TeamType, Piece, Position, samePosition } from '../Constants';
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from './rules/GeneralRules';
import { knightMove } from './rules/KnightRules';
import { pawnMove } from "./rules/PawnRules";

export default class Referee {
	isEnPassantMove(
		initialPosition: Position,
		desiredPosition: Position,
		type: PieceType,
		team: TeamType,
		boardState: Piece[]
	) {
		const pawnDirection = team === TeamType.OUR ? 1 : -1;

		//white = +1
		//black = -1
		if (type === PieceType.PAWN) {
			if (
				(desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) &&
				desiredPosition.y - initialPosition.y === pawnDirection
			) {
				const piece = boardState.find(
					(p) =>
						p.position.x === desiredPosition.x &&
						p.position.y === desiredPosition.y - pawnDirection &&
						p.enPassant
				);
				if (piece) {
					return true;
				}
			}
		}
		return false;
	}

	bishopMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
		//movement and attack logic for BISHOP
		for (let i = 1; i < 8; i++) {
			//upright movement
			if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
				let passedPosition: Position = { x: initialPosition.x + i, y: initialPosition.y + i };
				//check if the tile is the desired tile
				if (samePosition(passedPosition, desiredPosition)) {
					//dealing with desired tile
					if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
						return true;
					}
				} else {
					//dealing with passing tile
					if (tileIsOccupied(passedPosition, boardState)) {
						break;
					}
				}
			}
			//bottom right movement
			if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
				let passedPosition: Position = { x: initialPosition.x + i, y: initialPosition.y - i };
				//check if title is desired tile
				if (samePosition(passedPosition, desiredPosition)) {
					//dealing with desired tile
					if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
						return true;
					}
				} else {
					if (tileIsOccupied(passedPosition, boardState)) {
						break;
					}
				}
			}
			//bottom left movement
			if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
				let passedPosition: Position = { x: initialPosition.x - i, y: initialPosition.y - i };
				//check if title is desired tile
				if (samePosition(passedPosition, desiredPosition)) {
					//dealing with desired tile
					if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
						return true;
					}
				} else {
					if (tileIsOccupied(passedPosition, boardState)) {
						break;
					}
				}
			}

			//top left movement
			if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
				let passedPosition: Position = { x: initialPosition.x - i, y: initialPosition.y + i };
				//check if title is desired tile
				if (samePosition(passedPosition, desiredPosition)) {
					//dealing with desired tile
					if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
						return true;
					}
				} else {
					if (tileIsOccupied(passedPosition, boardState)) {
						break;
					}
				}
			}
		}
		return false;
	}

	rookMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
		if (initialPosition.x === desiredPosition.x) {
			for (let i = 1; i < 8; i++) {
				let multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;

				let passedPosition: Position = { x: initialPosition.x, y: desiredPosition.y + i * multiplier };
				if (samePosition(passedPosition, desiredPosition)) {
					if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
						return true;
					}
				} else {
					if (tileIsOccupied(passedPosition, boardState)) {
						break;
					}
				}
			}
		}
		if (initialPosition.y === desiredPosition.y) {
			for (let i = 1; i < 8; i++) {
				let multiplier = desiredPosition.x < initialPosition.x ? -1 : 1;

				let passedPosition: Position = { x: initialPosition.x + i * multiplier, y: initialPosition.y };
				if (samePosition(passedPosition, desiredPosition)) {
					if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
						return true;
					}
				} else {
					if (tileIsOccupied(passedPosition, boardState)) {
						break;
					}
				}
			}
		}
		return false;
	}

	queenMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
		for (let i = 1; i < 8; i++) {
			// all movements
			let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
			// let multiplierX = (false) ? "true" : (true) ? "true" : "false";
			let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0; 

			let passedPosition: Position = {
				x: initialPosition.x + i * multiplierX,
				y: desiredPosition.y + i * multiplierY
			};

			//initialPosition.x + (i * -1) [LEFT]
			//initialPosition.x + (i * 1) [RIGHT]
			//initialPosition.x + (i * 0) [MIDDLE]

			if (samePosition(passedPosition, desiredPosition)) {
				if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
					return true;
				}
			} else {
				if (tileIsOccupied(passedPosition, boardState)) {
					break;
				}
			}
		}		
		return false;
	}

	kingMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
		for (let i = 1; i < 2; i++) {
			// all movements
			let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
			// let multiplierX = (false) ? "true" : (true) ? "true" : "false";
			let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0; 

			let passedPosition: Position = {
				x: initialPosition.x + i * multiplierX,
				y: desiredPosition.y + i * multiplierY
			};

			//initialPosition.x + (i * -1) [LEFT]
			//initialPosition.x + (i * 1) [RIGHT]
			//initialPosition.x + (i * 0) [MIDDLE]

			if (samePosition(passedPosition, desiredPosition)) {
				if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
					return true;
				}
			} else {
				if (tileIsOccupied(passedPosition, boardState)) {
					break;
				}
			}
		}		
		return false;
	}



//TODO LIST
// pawn promotion
// castling rook and king
// prevent king from danger
// add check for king
// add ending of game [CHECKMATE]
// stalemate of game [you don fucked up boi]
// and some nice ui and maybe webamp player for epic fortnite dance music nah mean



	isValidMove(
		initialPosition: Position,
		desiredPosition: Position,
		type: PieceType,
		team: TeamType,
		boardState: Piece[]
	) {
		switch (type) {
			case PieceType.PAWN:
				pawnMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.KNIGHT:
				knightMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.BISHOP:
				this.bishopMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.ROOK:
				this.rookMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.QUEEN:
				this.queenMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.KING:
				this.kingMove(initialPosition, desiredPosition, team, boardState);
				// LAST CASE SO NO BREAK NO NO
		}
	}
}