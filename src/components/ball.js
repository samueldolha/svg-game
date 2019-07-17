import React from "react";
import { radius as ballRadius } from "../utility/ball";

export default ({ position }) => (
    <circle
        cx={`${position.x}%`}
        cy={`${position.y}%`}
        r={`${ballRadius}%`}
        style={{ fill: "White", stroke: "Black" }}
    />
);
