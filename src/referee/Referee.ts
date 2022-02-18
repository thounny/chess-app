import { PieceType, TeamType, Piece, Position, samePosition } from '../Constants';
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from './rules/GeneralRules';
import { pawnMove, knightMove, bishopMove, queenMove, rookMove } from "./rules";
import { kingMove } from './rules/KingRules';

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

//TODO LIST
// pawn promotion
// castling rook and king
// prevent king from danger
// add check for king
// add ending of game [CHECKMATE]
// stalemate of game [you don fucked up boi]
// and some nice UI and maybe webamp player for epic fortnite dance music nah mean

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
				bishopMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.ROOK:
				rookMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.QUEEN:
				queenMove(initialPosition, desiredPosition, team, boardState);
				break;
			case PieceType.KING:
				kingMove(initialPosition, desiredPosition, team, boardState);
				// LAST CASE SO NO BREAK NO NO
		}
		return false;
	}
}