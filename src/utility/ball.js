import ImmutablePosition from "../utility/immutable-position";
import ImmutableVelocity from "./immutable-velocity";

export const radius = 0.75;

export const leftOf = (ballX, x) => (ballX + radius) < x;

export const rightOf = (ballX, x) => (ballX - radius) > x;

export const above = (ballY, y) => (ballY + radius) < y;

export const below = (ballY, y) => (ballY - radius) > y;

const leftOverlaps = (ballX, leftX, rightX) => leftOf(ballX, rightX) && !leftOf(ballX, leftX);
const leftRightOverlaps = (ballX, leftX, rightX) => leftOf(ballX, rightX) && rightOf(ballX, leftX);
const rightOverlaps = (ballX, leftX, rightX) => !rightOf(ballX, rightX) && rightOf(ballX, leftX);

export const overlapsX = (ballX, leftX, rightX) => leftOverlaps(ballX, leftX, rightX)
    || leftRightOverlaps(ballX, leftX, rightX)
    || rightOverlaps(ballX, leftX, rightX);

const topOverlaps = (ballY, topY, bottomY) => above(ballY, bottomY) && !above(ballY, topY);
const topBottomOverlaps = (ballY, topY, bottomY) => above(ballY, bottomY) && below(ballY, topY);
const bottomOverlaps = (ballY, topY, bottomY) => !below(ballY, bottomY) && below(ballY, topY);

export const overlapsY = (ballY, topY, bottomY) => topOverlaps(ballY, topY, bottomY)
    || topBottomOverlaps(ballY, topY, bottomY)
    || bottomOverlaps(ballY, topY, bottomY);

export const constrainCoordinate = (minimum, maximum, coordinate) => Math.max(
    minimum + radius,
    Math.min(maximum - radius, coordinate)
);

export const createStartingPosition = () => ImmutablePosition({ x: 50, y: 70 });

export const createStartingAngle = () => ((5 / 6) * Math.PI * Math.random()) + ((1 / 12) * Math.PI);

export const createVelocity = (angle) => ImmutableVelocity({
    angle,
    magnitude: Math.abs(30 / Math.sin(angle))
});
