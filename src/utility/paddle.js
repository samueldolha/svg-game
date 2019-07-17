import {
    radius as ballRadius,
    constrainCoordinate as constrainBallCoordinate
} from "./ball";

export const x = 50;

export const y = 98;

export const width = 20 * ballRadius;

export const createReflectingAngle = (ballX) => ((11 / 12) * Math.PI)
    - ((((constrainBallCoordinate(x, x + width, ballX) - x) * (5 / 6) * Math.PI) / width)
        + ((1 / 12) * Math.PI));
