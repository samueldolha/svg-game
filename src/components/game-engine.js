import { List as ImmutableList } from "immutable";
import React from "react";
import * as AngleUtility from "../utility/angle";
import * as BallUtility from "../utility/ball";
import createBlocks from "../utility/create-blocks";
import Ball from "./ball";
import Block from "./block";

export default () => {
    const [blocks, setBlocks] = React.useState(createBlocks());
    const [position, setPosition] = React.useState(BallUtility.createStartingPosition());
    const [velocity, setVelocity] = React.useState(
        BallUtility.createVelocity(BallUtility.createStartingAngle())
    );
    const handleClick = React.useCallback(
        () => {
            setVelocity(
                velocity.magnitude === 0
                    ? BallUtility.createVelocity(velocity.angle)
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

                                if ((!BallUtility.rightOf(ballX, 0)
                                    && AngleUtility.onLeftHalf(angle))
                                    || (!BallUtility.leftOf(ballX, 100)
                                        && AngleUtility.onRightHalf(angle))) {
                                    angle = AngleUtility.getMirrored(angle);
                                }

                                if ((!BallUtility.below(ballY, 0)
                                    && AngleUtility.onTopHalf(angle))) {
                                    angle = AngleUtility.getFlipped(angle);
                                }

                                if (!BallUtility.above(ballY, 100)
                                    && AngleUtility.onBottomHalf(angle)) {
                                    setBlocks(createBlocks());
                                    setPosition(BallUtility.createStartingPosition());
                                    setVelocity(
                                        BallUtility.createVelocity(
                                            BallUtility.createStartingAngle()
                                        )
                                    );
                                }

                                ballX = BallUtility.constrainCoordinate(0, 100, ballX);
                                ballY = BallUtility.constrainCoordinate(0, 100, ballY);

                                const idsToDelete = [];

                                blocks.forEach(
                                    (block) => {
                                        const leftX = block.topLeft.x;
                                        const rightX = block.bottomRight.x;
                                        const topY = block.topLeft.y;
                                        const bottomY = block.bottomRight.y;

                                        const leftOverlaps = BallUtility.leftOf(ballX, rightX)
                                            && !BallUtility.leftOf(ballX, leftX);
                                        const leftRightOverlaps = BallUtility.leftOf(ballX, rightX)
                                            && BallUtility.rightOf(ballX, leftX);
                                        const rightOverlaps = !BallUtility.rightOf(ballX, rightX)
                                            && BallUtility.rightOf(ballX, leftX);
                                        const overlapsX = leftOverlaps
                                            || leftRightOverlaps
                                            || rightOverlaps;
                                        const topOverlaps = BallUtility.above(ballY, bottomY)
                                            && !BallUtility.above(ballY, topY);
                                        const topBottomOverlaps = BallUtility.above(ballY, bottomY)
                                            && BallUtility.below(ballY, topY);
                                        const bottomOverlaps = !BallUtility.below(ballY, bottomY)
                                            && BallUtility.below(ballY, topY);
                                        const overlapsY = topOverlaps
                                            || topBottomOverlaps
                                            || bottomOverlaps;

                                        if (overlapsX && overlapsY) {
                                            if ((BallUtility.above(ballY, bottomY)
                                                && AngleUtility.onBottomHalf(angle))
                                                || (BallUtility.below(ballY, topY)
                                                    && AngleUtility.onTopHalf(angle))) {
                                                angle = AngleUtility.getFlipped(angle);
                                            }
                                            else if ((BallUtility.leftOf(ballX, rightX)
                                                && AngleUtility.onRightHalf(angle))
                                                || (BallUtility.rightOf(ballX, leftX)
                                                    && AngleUtility.onLeftHalf(angle))) {
                                                angle = AngleUtility.getMirrored(angle);
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
                                    setVelocity(BallUtility.createVelocity(angle));
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
            <Ball position={position} />
        </React.Fragment>
    );
}
