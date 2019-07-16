export const radius = 0.75;

export const leftOf = (ballX, x) => (ballX + radius) < x;

export const rightOf = (ballX, x) => (ballX - radius) > x;

export const above = (ballY, y) => (ballY + radius) < y;

export const below = (ballY, y) => (ballY - radius) > y;

export const constrainCoordinate = (minimum, maximum, coordinate) => Math.max(
    minimum + radius,
    Math.min(maximum - radius, coordinate)
);
