import { List as ImmutableList } from "immutable";
import React from "react";
import {
    angleOnLeftHalf,
    angleOnRightHalf,
    angleOnTopHalf,
    angleOnBottomHalf,
    createMirroredAngle,
    createFlippedAngle
} from "../utility/angle";
import {
    ballLeftOf,
    ballRightOf,
    ballAbove,
    ballBelow,
    ballOverlapsX,
    ballOverlapsY,
    constrainBallCoordinate,
    createStartingBallPosition,
    createStartingBallAngle,
    createBallVelocity
} from "../utility/ball";
import createBlocks from "../utility/create-blocks";
import { frameRate } from "../utility/game";
import {
    paddleY,
    paddleWidth,
    createReflectingAngle,
    constrainPaddleCoordinate
} from "../utility/paddle";
import Ball from "./ball";
import Block from "./block";
import Paddle from "./paddle";

export default ({ mouseX, leftHorizontalBound, rightHorizontalBound }) => {
    const [blocks, setBlocks] = React.useState(createBlocks());
    const [ballPosition, setBallPosition] = React.useState(createStartingBallPosition());
    const [ballVelocity, setBallVelocity] = React.useState(
        createBallVelocity(createStartingBallAngle())
    );
    const [paddleX, setPaddleX] = React.useState(50);
    const handlePause = React.useCallback(
        () => {
            setBallVelocity(
                ballVelocity.magnitude === 0
                    ? createBallVelocity(ballVelocity.angle)
                    : ballVelocity.set("magnitude", 0)
            );
        },
        [ballVelocity]
    );
    React.useEffect(
        () => {
            window.addEventListener("click", handlePause);

            return () => {
                window.removeEventListener("click", handlePause);
            };
        },
        [handlePause]
    );
    const handleKeyDown = React.useCallback(
        (keyboardEvent) => {
            if (keyboardEvent.key === "ArrowLeft") {
                if (ballVelocity.magnitude > 0) {
                    setPaddleX(constrainPaddleCoordinate(0, 100, paddleX - 4));
                }
            } else if (keyboardEvent.key === "ArrowRight") {
                if (ballVelocity.magnitude > 0) {
                    setPaddleX(constrainPaddleCoordinate(0, 100, paddleX + 4));
                }
            } else if (keyboardEvent.key === " ") {
                if (!keyboardEvent.repeat) {
                    handlePause();
                }
            }
        },
        [ballVelocity.magnitude, handlePause, paddleX]
    )
    React.useEffect(
        () => {
            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        },
        [handleKeyDown]
    );
    React.useEffect(
        () => {
            const intervalId = window.setInterval(
                () => {
                    if (ballVelocity.magnitude > 0) {
                        setBallPosition(
                            (oldBallPosition) => {
                                let ballX = oldBallPosition.x
                                    + (ballVelocity.magnitude / frameRate)
                                    * Math.cos(ballVelocity.angle);
                                let ballY = oldBallPosition.y
                                    - (ballVelocity.magnitude / frameRate)
                                    * Math.sin(ballVelocity.angle);

                                let angle = ballVelocity.angle;

                                if ((!ballRightOf(ballX, 0) && angleOnLeftHalf(angle))
                                    || (!ballLeftOf(ballX, 100) && angleOnRightHalf(angle))) {
                                    angle = createMirroredAngle(angle);
                                }

                                if ((!ballBelow(ballY, 0) && angleOnTopHalf(angle))) {
                                    angle = createFlippedAngle(angle);
                                }

                                if (!ballAbove(ballY, 100) && angleOnBottomHalf(angle)) {
                                    setBlocks(createBlocks());
                                    setBallPosition(createStartingBallPosition());
                                    setBallVelocity(createBallVelocity(createStartingBallAngle()));
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

                                        if (ballOverlapsX(ballX, leftX, rightX)
                                            && ballOverlapsY(ballY, topY, bottomY)) {
                                            if ((ballAbove(ballY, bottomY)
                                                && angleOnBottomHalf(angle))
                                                || (ballBelow(ballY, topY)
                                                    && angleOnTopHalf(angle))) {
                                                angle = createFlippedAngle(angle);
                                            }
                                            else if ((ballLeftOf(ballX, rightX)
                                                && angleOnRightHalf(angle))
                                                || (ballRightOf(ballX, leftX)
                                                    && angleOnLeftHalf(angle))) {
                                                angle = createMirroredAngle(angle);
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

                                if (ballOverlapsX(ballX, paddleX, paddleX + paddleWidth)
                                    && !ballAbove(ballY, paddleY)
                                    && angleOnBottomHalf(angle)) {
                                    angle = createReflectingAngle(paddleX, ballX);
                                    console.log(angle * 180 / Math.PI);
                                }

                                if (angle !== ballVelocity.angle) {
                                    setBallVelocity(createBallVelocity(angle));
                                }

                                return oldBallPosition.withMutations(
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
        [blocks, blocks.length, ballVelocity, ballVelocity.angle, ballVelocity.magnitude, paddleX, mouseX, leftHorizontalBound, rightHorizontalBound]
    );

    return (
        <React.Fragment>
            {blocks.map((block) => (
                <Block key={block.toString()} block={block} />
            ))}
            <Paddle x={paddleX} />
            <Ball position={ballPosition} />
        </React.Fragment>
    );
}
