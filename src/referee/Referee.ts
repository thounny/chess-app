import { PieceType, TeamType, Piece, Position, samePosition } from '../Constants';

export default class Referee {
	tileIsEmptyOrOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType) {
		return !this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position, boardState, team);
	}
	tileIsOccupied(position: Position, boardState: Piece[]): boolean {
		const piece = boardState.find((p) => samePosition(p.position, position));

		if (piece) {
			return true;
		} else {
			return false;
		}
	}

	tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
		const piece = boardState.find((p) => samePosition(p.position, position) && p.team !== team);

		if (piece) {
			return true;
		} else {
			return false;
		}
	}

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

	isValidMove(
		initialPosition: Position,
		desiredPosition: Position,
		type: PieceType,
		team: TeamType,
		boardState: Piece[]
	) {
		if (type === PieceType.PAWN) {
			const specialRow = team === TeamType.OUR ? 1 : 6;
			const pawnDirection = team === TeamType.OUR ? 1 : -1;

			//movement logic
			if (
				initialPosition.x === desiredPosition.x &&
				initialPosition.y === specialRow &&
				desiredPosition.y - initialPosition.y === 2 * pawnDirection
			) {
				if (
					!this.tileIsOccupied(desiredPosition, boardState) &&
					!this.tileIsOccupied({ x: desiredPosition.x, y: desiredPosition.y - pawnDirection }, boardState)
				) {
					return true;
				}
			} else if (
				initialPosition.x === desiredPosition.x &&
				desiredPosition.y - initialPosition.y === pawnDirection
			) {
				if (!this.tileIsOccupied(desiredPosition, boardState)) {
					return true;
				}
			} else if (
				desiredPosition.x - initialPosition.x === -1 &&
				desiredPosition.y - initialPosition.y === pawnDirection
			) {
				//attack logic
				//attack in upper or bottom left corner
				console.log('upper / bottom left');
				if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
					return true;
				}
			} else if (
				desiredPosition.x - initialPosition.x === 1 &&
				desiredPosition.y - initialPosition.y === pawnDirection
			) {
				//attack in upper or bottom right corner
				console.log('upper / bottom right');
				if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
					return true;
				}
			}
		} else if (type === PieceType.KNIGHT) {
			for (let i = -1; i < 2; i += 2) {
				for (let j = -1; j < 2; j += 2) {
					//top and bottom movement
					if (desiredPosition.y - initialPosition.y === 2 * i) {
						if (desiredPosition.x - initialPosition.x === j) {
							if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
								return true;
							}
						}
					}
					//right and left movement
					if (desiredPosition.x - initialPosition.x === 2 * i) {
						if (desiredPosition.y - initialPosition.y === j) {
							if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
								return true;
							}
						}
					}
				}
			}
		} else if (type === PieceType.BISHOP) {
			//movement and attack logic for BISHOP
			for (let i = 1; i < 8; i++) {
                
                //upright movement
                if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
					if(this.tileIsOccupied(passedPosition, boardState)) {
                        console.log("illegal move");
                        break;
                    }
					if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
						console.log("same passed and desired positions");
						return true;
					}
                }
                //bottom right movement
                if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i};
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        return true;
                    }
                }
                if (desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === -i) {
					return true;
				}
                //bottom left movement
                if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y - i};
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        console.log("illegal move");
                        break;
                    }
                }
                if (desiredPosition.x - initialPosition.x === -i && desiredPosition.y - initialPosition.y === -i) {
					return true;
				}
                //top left movement
                if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y + i};
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        console.log("illegal move");
                        break;
                    }
                }
                if (desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === i) {
					return true;
				}
			}
		}
		return false;
	}
}