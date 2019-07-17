import { List as ImmutableList } from "immutable";
import React from "react";
import {
    onLeftHalf as angleOnLeftHalf,
    onRightHalf as angleOnRightHalf,
    onTopHalf as angleOnTopHalf,
    onBottomHalf as angleOnBottomHalf,
    getMirrored as getMirroredAngle,
    getFlipped as getFlippedAngle
} from "../utility/angle";
import {
    leftOf as ballLeftOf,
    rightOf as ballRightOf,
    above as ballAbove,
    below as ballBelow,
    constrainCoordinate as constrainBallCoordinate,
    createStartingPosition as createStartingBallPosition,
    createStartingAngle as createStartingBallAngle,
    createVelocity as createBallVelocity
} from "../utility/ball";
import createBlocks from "../utility/create-blocks";
import Ball from "./ball";
import Block from "./block";

export default () => {
    const [blocks, setBlocks] = React.useState(createBlocks());
    const [position, setPosition] = React.useState(createStartingBallPosition());
    const [velocity, setVelocity] = React.useState(
        createBallVelocity(createStartingBallAngle())
    );
    const handleClick = React.useCallback(
        () => {
            setVelocity(
                velocity.magnitude === 0
                    ? createBallVelocity(velocity.angle)
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

                                if ((!ballRightOf(ballX, 0) && angleOnLeftHalf(angle))
                                    || (!ballLeftOf(ballX, 100)
                                        && angleOnRightHalf(angle))) {
                                    angle = getMirroredAngle(angle);
                                }

                                if ((!ballBelow(ballY, 0) && angleOnTopHalf(angle))) {
                                    angle = getFlippedAngle(angle);
                                }

                                if (!ballAbove(ballY, 100) && angleOnBottomHalf(angle)) {
                                    setBlocks(createBlocks());
                                    setPosition(createStartingBallPosition());
                                    setVelocity(
                                        createBallVelocity(
                                            createStartingBallAngle()
                                        )
                                    );
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

                                        const leftOverlaps = ballLeftOf(ballX, rightX)
                                            && !ballLeftOf(ballX, leftX);
                                        const leftRightOverlaps = ballLeftOf(ballX, rightX)
                                            && ballRightOf(ballX, leftX);
                                        const rightOverlaps = !ballRightOf(ballX, rightX)
                                            && ballRightOf(ballX, leftX);
                                        const overlapsX = leftOverlaps
                                            || leftRightOverlaps
                                            || rightOverlaps;
                                        const topOverlaps = ballAbove(ballY, bottomY)
                                            && !ballAbove(ballY, topY);
                                        const topBottomOverlaps = ballAbove(ballY, bottomY)
                                            && ballBelow(ballY, topY);
                                        const bottomOverlaps = !ballBelow(ballY, bottomY)
                                            && ballBelow(ballY, topY);
                                        const overlapsY = topOverlaps
                                            || topBottomOverlaps
                                            || bottomOverlaps;

                                        if (overlapsX && overlapsY) {
                                            if ((ballAbove(ballY, bottomY)
                                                && angleOnBottomHalf(angle))
                                                || (ballBelow(ballY, topY)
                                                    && angleOnTopHalf(angle))) {
                                                angle = getFlippedAngle(angle);
                                            }
                                            else if ((ballLeftOf(ballX, rightX)
                                                && angleOnRightHalf(angle))
                                                || (ballRightOf(ballX, leftX)
                                                    && angleOnLeftHalf(angle))) {
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
                                    setVelocity(createBallVelocity(angle));
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
