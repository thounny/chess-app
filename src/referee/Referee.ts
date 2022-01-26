import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard";

export default class Referee {
    titleIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find(p => p.x === x && p.y === y)

        if(piece) {
            return true;
        } else {
            return false;
        }
    }

    TitleIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team);

        if(piece) {
            return true;
        } else {
            return false;
        }
    }

    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]) {
        // console.log("Referee is checking the move...");
        // console.log(`Previous location: (${px}, ${py})`);
        // console.log(`Current location: (${x}, ${y})`);
        // console.log(`Piece type: (${type})`);
        // console.log(`Team: (${team})`);

        if(type === PieceType.PAWN) {
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            //movement logic
            if(px === x && py === specialRow && y - py === 2*pawnDirection) {
                if(!this.titleIsOccupied(x, y, boardState) && !this.titleIsOccupied(x, y - pawnDirection, boardState)) {
                    return true;
                }
            } else if(px === x && y - py === pawnDirection) {
                if(!this.titleIsOccupied(x, y, boardState)) {
                    return true;
                }
            }
            //attack logic
            else if(x - px === -1 && y - py === pawnDirection) {
                //attack in upper or bottom left corner
                console.log("upper / bottom left")
                if(this.TitleIsOccupiedByOpponent(x, y, boardState, team)) {
                    return true;
                }
            } else if(x - px === 1 && y - py === pawnDirection) {
                //attack in upper or bottom right corner
                console.log("upper / bottom right");
                if(this.TitleIsOccupiedByOpponent(x, y, boardState, team)) {
                    return true;
                }
            }
        }
        return false;
    }
}

