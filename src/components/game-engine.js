import { List as ImmutableList } from "immutable";
import React from "react";
import * as Angle from "../utility/angle";
import * as Ball from "../utility/ball";
import createBlocks from "../utility/create-blocks";
import Block from "./block";

export default () => {
    const [blocks, setBlocks] = React.useState(createBlocks());
    const [position, setPosition] = React.useState(Ball.createStartingPosition());
    const [velocity, setVelocity] = React.useState(Ball.createVelocity(Ball.createStartingAngle()));
    const handleClick = React.useCallback(
        () => {
            setVelocity(
                velocity.magnitude === 0
                    ? Ball.createVelocity(velocity.angle)
                    : velocity.set("magnitude", 0)
            );
        },
        [velocity]
    );
    React.useEffect(
        () => {
            window.addEventListener("click", handleClick);

            return () => {
                window.removeEventListener("click", handleClick);
            };
        },
        [handleClick]
    );
    React.useEffect(
        () => {
            const frameRate = 60;
            const intervalId = setInterval(
                () => {
                    if (velocity.magnitude > 0) {
                        setPosition(
                            (oldPosition) => {
                                let ballX = oldPosition.x
                                    + (velocity.magnitude / frameRate) * Math.cos(velocity.angle);
                                let ballY = oldPosition.y
                                    - (velocity.magnitude / frameRate) * Math.sin(velocity.angle);

                                let angle = velocity.angle;

                                if ((!Ball.rightOf(ballX, 0) && Angle.onLeftHalf(angle))
                                    || (!Ball.leftOf(ballX, 100) && Angle.onRightHalf(angle))) {
                                    angle = Angle.getMirrored(angle);
                                }

                                if ((!Ball.below(ballY, 0) && Angle.onTopHalf(angle))) {
                                    angle = Angle.getFlipped(angle);
                                }

                                if (!Ball.above(ballY, 100) && Angle.onBottomHalf(angle)) {
                                    setBlocks(createBlocks());
                                    setPosition(Ball.createStartingPosition());
                                    setVelocity(Ball.createVelocity(Ball.createStartingAngle()));
                                }

                                ballX = Ball.constrainCoordinate(0, 100, ballX);
                                ballY = Ball.constrainCoordinate(0, 100, ballY);

                                const idsToDelete = [];

                                blocks.forEach(
                                    (block) => {
                                        const leftX = block.topLeft.x;
                                        const rightX = block.bottomRight.x;
                                        const topY = block.topLeft.y;
                                        const bottomY = block.bottomRight.y;

                                        const leftOverlaps = Ball.leftOf(ballX, rightX)
                                            && !Ball.leftOf(ballX, leftX);
                                        const leftRightOverlaps = Ball.leftOf(ballX, rightX)
                                            && Ball.rightOf(ballX, leftX);
                                        const rightOverlaps = !Ball.rightOf(ballX, rightX)
                                            && Ball.rightOf(ballX, leftX);
                                        const overlapsX = leftOverlaps
                                            || leftRightOverlaps
                                            || rightOverlaps;
                                        const topOverlaps = Ball.above(ballY, bottomY)
                                            && !Ball.above(ballY, topY);
                                        const topBottomOverlaps = Ball.above(ballY, bottomY)
                                            && Ball.below(ballY, topY);
                                        const bottomOverlaps = !Ball.below(ballY, bottomY)
                                            && Ball.below(ballY, topY);
                                        const overlapsY = topOverlaps
                                            || topBottomOverlaps
                                            || bottomOverlaps;

                                        if (overlapsX && overlapsY) {
                                            if ((Ball.above(ballY, bottomY)
                                                && Angle.onBottomHalf(angle))
                                                || (Ball.below(ballY, topY)
                                                    && Angle.onTopHalf(angle))) {
                                                angle = Angle.getFlipped(angle);
                                            }
                                            else if ((Ball.leftOf(ballX, rightX)
                                                && Angle.onRightHalf(angle))
                                                || (Ball.rightOf(ballX, leftX)
                                                    && Angle.onLeftHalf(angle))) {
                                                angle = Angle.getMirrored(angle);
                                            }

                                            idsToDelete.push(block.id);
                                        }
                                    }
                                );

                                if (idsToDelete.length > 0) {
                                    setBlocks((oldBlocks) => {
                                        const mutableBlocks = oldBlocks.toArray();

                                        idsToDelete.forEach((idToDelete) => {
                                            const indexToDelete = mutableBlocks.findIndex(
                                                (mutableBlock) => mutableBlock.id === idToDelete
                                            );

                                            if (indexToDelete !== -1) {
                                                mutableBlocks.splice(indexToDelete, 1);
                                            }
                                        });

                                        return ImmutableList(mutableBlocks);
                                    })
                                }

                                if (angle !== velocity.angle) {
                                    setVelocity(Ball.createVelocity(angle));
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
                <Block key={block.toString()} block={block} />
            ))}
            <circle
                cx={`${position.x}%`}
                cy={`${position.y}%`}
                r={`${Ball.radius}%`}
                style={{ fill: "White", stroke: "Black" }}
            />
        </React.Fragment>
    );
}
