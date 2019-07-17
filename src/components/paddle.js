import React from "react";
import { ballRadius } from "../utility/ball";
import { paddleY, paddleWidth } from "../utility/paddle";

export default ({ x }) => (
    <rect
        x={`${x}%`}
        y={`${paddleY}%`}
        width={`${paddleWidth}%`}
        height={`${ballRadius}%`}
        rx="0.3%"
        style={{ fill: "#FF66CC", stroke: "#990066" }}
    />
);
