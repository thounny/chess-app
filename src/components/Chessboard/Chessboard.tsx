import './Chessboard.css';
import Tile from "../Tile/Tile";
import React from "react";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
    image: string
    x: number
    y: number
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
    const type = (p === 0) ? "B" : "W";
    const y = (p === 0) ? 7 : 0;

pieces.push({ image: `assets/images/${type}_Rook.png`, x: 0, y })
pieces.push({ image: `assets/images/${type}_Rook.png`, x: 7, y })

pieces.push({ image: `assets/images/${type}_Knight.png`, x: 1, y })
pieces.push({ image: `assets/images/${type}_Knight.png`, x: 6, y })

pieces.push({ image: `assets/images/${type}_Bishop.png`, x: 2, y })
pieces.push({ image: `assets/images/${type}_Bishop.png`, x: 5, y })

pieces.push({ image: `assets/images/${type}_Queen.png`, x: 3, y })
pieces.push({ image: `assets/images/${type}_King.png`, x: 4, y })
}

for(let i = 0; i < 8; i++) {
    pieces.push({image: "assets/images/B_Pawn.png", x: i, y: 6});
}

for(let i = 0; i < 8; i++) {
    pieces.push({image: "assets/images/W_Pawn.png", x: i, y: 1});
}

export default function Chessboard() {
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

            board.push(<Tile image={image} number={number} />);
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
    return <div id="chessboard">{board}</div>;
}