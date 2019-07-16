import ImmutableVelocity from "./immutable-velocity";

export const radius = 0.75;

export const leftOf = (ballX, x) => (ballX + radius) < x;

export const rightOf = (ballX, x) => (ballX - radius) > x;

export const above = (ballY, y) => (ballY + radius) < y;

export const below = (ballY, y) => (ballY - radius) > y;

export const constrainCoordinate = (minimum, maximum, coordinate) => Math.max(
    minimum + radius,
    Math.min(maximum - radius, coordinate)
);

export const createAngle = () => ((2 / 3) * Math.PI * Math.random()) + ((1 / 12) * Math.PI);

export const createVelocity = (angle) => ImmutableVelocity({
    angle,
    magnitude: Math.abs(30 / Math.sin(angle))
});
