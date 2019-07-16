import { List as ImmutableList, Record as ImmutableRecord } from "immutable";
import ImmutablePosition from "./immutable-position";

const blockWidth = 4;
const blockHeight = 2;

const ImmutableBlock = ImmutableRecord({
    id: -1,
    topLeft: ImmutablePosition(),
    bottomRight: ImmutablePosition(),
    colour: "Black"
});

export const createBlocks = () => {
    const blockArray = [];

    for (let rowIndex = 0; rowIndex < 10; rowIndex += 1) {
        const rowIsEven = rowIndex % 2 === 0;

        for (let blockIndex = 0; blockIndex < 15; blockIndex += 1) {

            const topLeft = ImmutablePosition({
                x: (blockIndex * (blockWidth * 1.5)) + (rowIsEven ? (blockWidth / 2) : 0) + blockWidth,
                y: (rowIndex + 4) * (blockHeight * 1.5)
            });
            blockArray.push(ImmutableBlock({
                id: rowIndex * 25 + blockIndex,
                topLeft,
                bottomRight: ImmutablePosition({
                    x: topLeft.x + blockWidth,
                    y: topLeft.y + blockHeight
                }),
                colour: ['#E70000', '#FF8C00', '#FFEF00', '#00811F', '#0044FF', '#760089'][Math.round(5 * Math.random())]
            }));
        }
    }

    return ImmutableList(blockArray);
};
