import ImmutablePosition from "../utility/immutable-position";
import ImmutableVelocity from "./immutable-velocity";

export const ballRadius = 0.75;

export const ballLeftOf = (ballX, x) => (ballX + ballRadius) < x;

export const ballRightOf = (ballX, x) => (ballX - ballRadius) > x;

export const ballAbove = (ballY, y) => (ballY + ballRadius) < y;

export const ballBelow = (ballY, y) => (ballY - ballRadius) > y;

const leftOverlaps = (ballX, leftX, rightX) => ballLeftOf(ballX, rightX)
    && !ballLeftOf(ballX, leftX);
const leftRightOverlaps = (ballX, leftX, rightX) => ballLeftOf(ballX, rightX)
    && ballRightOf(ballX, leftX);
const rightOverlaps = (ballX, leftX, rightX) => !ballRightOf(ballX, rightX)
    && ballRightOf(ballX, leftX);

export const ballOverlapsX = (ballX, leftX, rightX) => leftOverlaps(ballX, leftX, rightX)
    || leftRightOverlaps(ballX, leftX, rightX)
    || rightOverlaps(ballX, leftX, rightX);

const topOverlaps = (ballY, topY, bottomY) => ballAbove(ballY, bottomY) && !ballAbove(ballY, topY);
const topBottomOverlaps = (ballY, topY, bottomY) => ballAbove(ballY, bottomY)
    && ballBelow(ballY, topY);
const bottomOverlaps = (ballY, topY, bottomY) => !ballBelow(ballY, bottomY)
    && ballBelow(ballY, topY);

export const ballOverlapsY = (ballY, topY, bottomY) => topOverlaps(ballY, topY, bottomY)
    || topBottomOverlaps(ballY, topY, bottomY)
    || bottomOverlaps(ballY, topY, bottomY);

export const constrainBallCoordinate = (minimum, maximum, coordinate) => Math.max(
    minimum + ballRadius,
    Math.min(maximum - ballRadius, coordinate)
);

export const createStartingBallPosition = () => ImmutablePosition({ x: 50, y: 70 });

export const createStartingBallAngle = () => ((5 / 6) * Math.PI * Math.random())
    + ((1 / 12) * Math.PI);

export const createBallVelocity = (angle) => ImmutableVelocity({
    angle,
    magnitude: Math.abs(30 / Math.sin(angle))
});
