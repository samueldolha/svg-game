import React from "react";
import { radius as ballRadius } from "../utility/ball";
import { x, y, width } from "../utility/paddle";

export default () => (
    <rect
        x={`${x}%`}
        y={`${y}%`}
        width={`${width}%`}
        height={`${ballRadius}%`}
        rx="0.3%"
        style={{ fill: "#FF66CC", stroke: "#990066" }}
    />
);
