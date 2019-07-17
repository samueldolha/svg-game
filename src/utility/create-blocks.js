import { List as ImmutableList, Record as ImmutableRecord } from "immutable";
import * as Ball from "./ball";
import ImmutablePosition from "./immutable-position";

const blockWidth = (16 / 3) * Ball.radius;
const blockHeight = blockWidth / 2;
const blockColours = ['#E70000', '#FF8C00', '#FFEF00', '#00811F', '#0044FF', '#760089'];

const ImmutableBlock = ImmutableRecord({
    id: -1,
    topLeft: ImmutablePosition(),
    bottomRight: ImmutablePosition(),
    colour: "Black"
});

export default () => {
    const blockArray = [];

    for (let rowIndex = 0; rowIndex < 8; rowIndex += 1) {
        const rowIsEven = rowIndex % 2 === 0;

        for (let blockIndex = 0; blockIndex < 13; blockIndex += 1) {
            const marginCoefficient = 5 / 3;
            const topLeft = ImmutablePosition({
                x: (blockIndex * (blockWidth * (marginCoefficient))) + (rowIsEven ? blockHeight : 0)
                    + blockHeight * 3,
                y: (rowIndex + 4) * (blockHeight * marginCoefficient)
            });
            blockArray.push(ImmutableBlock({
                id: rowIndex * 25 + blockIndex,
                topLeft,
                bottomRight: ImmutablePosition({
                    x: topLeft.x + blockWidth,
                    y: topLeft.y + blockHeight
                }),
                colour: blockColours[Math.round(5 * Math.random())]
            }));
        }
    }

    return ImmutableList(blockArray);
};
