import { Piece, Position, samePosition, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const bishopMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
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