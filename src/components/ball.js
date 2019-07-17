import React from "react";
import * as Ball from "../utility/ball";

export default ({ position }) => (
    <circle
        cx={`${position.x}%`}
        cy={`${position.y}%`}
        r={`${Ball.radius}%`}
        style={{ fill: "White", stroke: "Black" }}
    />
);
