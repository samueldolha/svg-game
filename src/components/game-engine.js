import { List as ImmutableList, Record as ImmutableRecord } from "immutable";
import React from "react";

const ImmutablePosition = ImmutableRecord({ x: 0, y: 0 });

const ImmutableBlock = ImmutableRecord({
    id: -1,
    topLeft: ImmutablePosition(),
    bottomRight: ImmutablePosition(),
    colour: "Black"
});

const ballRadius = 0.75;
const blockWidth = 4;
const blockHeight = 2;

const angleOnLeftHalf = (angle) => angle > (1 / 2) * Math.PI && angle < (3 / 2) * Math.PI;
const angleOnRightHalf = (angle) => angle < (1 / 2) * Math.PI || angle > (3 / 2) * Math.PI;
const angleOnTopHalf = (angle) => angle < Math.PI;
const angleOnBottomHalf = (angle) => angle > Math.PI;
const getMirroredAngle = (angle) => (angle <= Math.PI ? Math.PI : 3 * Math.PI) - angle;
const getFlippedAngle = (angle) => (2 * Math.PI) - angle;

const constrainBallCoordinate = (minimum, maximum, coordinate) => Math.max(
    minimum + ballRadius,
    Math.min(maximum - ballRadius, coordinate)
);

export default () => {
    const [blocks, setBlocks] = React.useState(
        () => {
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
        }
    );

    const [position, setPosition] = React.useState(ImmutablePosition({ x: 50, y: 50 }));
    const [velocity, setVelocity] = React.useState(
        ImmutableRecord({ angle: 0, magnitude: 0 })({
            angle: ((2 / 3) * Math.PI * Math.random()) + ((1 / 6) * Math.PI),
            magnitude: 30
        })
    );

    React.useEffect(
        () => {
            const frameRate = 60;
            const intervalId = setInterval(
                () => {
                    if (velocity.magnitude > 0) {
                        setPosition(
                            (oldPosition) => {
                                const ballLeftOf = (ballX, x) => (ballX + ballRadius) < x;
                                const ballRightOf = (ballX, x) => (ballX - ballRadius) > x;
                                const ballAbove = (ballY, y) => (ballY + ballRadius) < y;
                                const ballBelow = (ballY, y) => (ballY - ballRadius) > y;

                                let ballX = oldPosition.x + (velocity.magnitude / frameRate) * Math.cos(velocity.angle);
                                let ballY = oldPosition.y - (velocity.magnitude / frameRate) * Math.sin(velocity.angle);

                                let angle = velocity.angle;

                                if ((!ballRightOf(ballX, 0) && angleOnLeftHalf(angle))
                                    || (!ballLeftOf(ballX, 100) && angleOnRightHalf(angle))) {
                                    angle = getMirroredAngle(angle);
                                }

                                if ((!ballBelow(ballY, 0) && angleOnTopHalf(angle))
                                    || (!ballAbove(ballY, 100) && angleOnBottomHalf(angle))) {
                                    angle = getFlippedAngle(angle);
                                }

                                ballX = constrainBallCoordinate(0, 100, ballX);
                                ballY = constrainBallCoordinate(0, 100, ballY);

                                const idsToDelete = [];

                                blocks.forEach(
                                    (block) => {
                                        const leftX = block.topLeft.x;
                                        const rightX = block.bottomRight.x;
                                        const topY = block.topLeft.y;
                                        const bottomY = block.bottomRight.y;

                                        const overlapsX = (ballLeftOf(ballX, rightX) && !ballLeftOf(ballX, leftX))
                                            || (ballLeftOf(ballX, rightX) && ballRightOf(ballX, leftX))
                                            || (!ballRightOf(ballX, rightX) && ballRightOf(ballX, leftX));
                                        const overlapsY = (ballAbove(ballY, bottomY) && !ballAbove(ballY, topY))
                                            || (ballAbove(ballY, bottomY) && ballBelow(ballY, topY))
                                            || (!ballBelow(ballY, bottomY) && ballBelow(ballY, topY));

                                        if (overlapsX && overlapsY) {
                                            if ((ballAbove(ballY, bottomY) && angleOnBottomHalf(angle))
                                                || (ballBelow(ballY, topY) && angleOnTopHalf(angle))) {
                                                angle = getFlippedAngle(angle);
                                            }
                                            else if ((ballLeftOf(ballX, rightX) && angleOnRightHalf(angle))
                                                || (ballRightOf(ballX, leftX) && angleOnLeftHalf(angle))) {
                                                angle = getMirroredAngle(angle);
                                            }

                                            idsToDelete.push(block.id);
                                        }
                                    }
                                );

                                if (idsToDelete.length > 0) {
                                    setBlocks((oldBlocks) => {
                                        const mutableBlocks = oldBlocks.toArray();

                                        idsToDelete.forEach((idToDelete) => {
                                            const indexToDelete = mutableBlocks.findIndex((mutableBlock) => mutableBlock.id === idToDelete);

                                            if (indexToDelete !== -1) {
                                                mutableBlocks.splice(indexToDelete, 1);
                                            }
                                        });

                                        return ImmutableList(mutableBlocks);
                                    })
                                }

                                if (angle !== velocity.angle) {
                                    setVelocity(velocity.set("angle", angle));
                                }

                                return oldPosition.withMutations(
                                    (mutablePosition) => mutablePosition
                                        .set("x", ballX)
                                        .set("y", ballY)
                                );
                            }
                        );
                    }
                },
                1000 / frameRate
            );

            return () => {
                clearInterval(intervalId);
            }
        },
        [blocks, blocks.length, velocity, velocity.angle, velocity.magnitude]
    );

    return (
        <React.Fragment>
            {blocks.map((block) => (
                <rect
                    key={`${block.topLeft.x},${block.topLeft.y}`}
                    x={`${block.topLeft.x}%`}
                    y={`${block.topLeft.y}%`}
                    width={`${block.bottomRight.x - block.topLeft.x}%`}
                    height={`${block.bottomRight.y - block.topLeft.y}%`}
                    rx="0.3%"
                    style={{ fill: block.colour, stroke: "Black" }}
                />
            ))}
            <circle cx={`${position.x}%`} cy={`${position.y}%`} r={`${ballRadius}%`} style={{ fill: "White", stroke: "Black" }} />
        </React.Fragment>
    );
}
