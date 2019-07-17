import { ballRadius, constrainBallCoordinate } from "./ball";

export const paddleX = 50;

export const paddleY = 98;

export const paddleWidth = 20 * ballRadius;

export const createReflectingAngle = (ballX) => ((11 / 12) * Math.PI)
    - ((((constrainBallCoordinate(paddleX, paddleX + paddleWidth, ballX) - paddleX)
        * (5 / 6)
        * Math.PI)
        / paddleWidth)
        + ((1 / 12) * Math.PI));
