import React from "react";

export default ({ block }) => (
    <rect
        key={`${block.topLeft.x},${block.topLeft.y}`}
        x={`${block.topLeft.x}%`}
        y={`${block.topLeft.y}%`}
        width={`${block.bottomRight.x - block.topLeft.x}%`}
        height={`${block.bottomRight.y - block.topLeft.y}%`}
        rx="0.3%"
        style={{ fill: block.colour, stroke: "Black" }}
    />
);
