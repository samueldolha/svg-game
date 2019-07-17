import React from "react";
import { ballRadius } from "../utility/ball";
import { paddleX, paddleY, paddleWidth } from "../utility/paddle";

export default () => (
    <rect
        x={`${paddleX}%`}
        y={`${paddleY}%`}
        width={`${paddleWidth}%`}
        height={`${ballRadius}%`}
        rx="0.3%"
        style={{ fill: "#FF66CC", stroke: "#990066" }}
    />
);
