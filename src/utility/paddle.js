import { ballRadius, constrainBallCoordinate } from "./ball";

export const paddleY = 98;

export const paddleWidth = 20 * ballRadius;

export const constrainPaddleCoordinate = (minimum, maximum, coordinate) => Math.max(
    minimum,
    Math.min(maximum - paddleWidth, coordinate)
);

export const createReflectingAngle = (paddleX, ballX) => {
    return Math.PI
        - ((((constrainBallCoordinate(paddleX, paddleX + paddleWidth, ballX) - paddleX)
            * (2 / 3)
            * Math.PI)
            / paddleWidth)
            + ((1 / 6) * Math.PI));
};
