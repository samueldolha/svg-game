import React from "react";
import GameWindow from "./game-window";

export default () => (
    <div
        style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "DarkCyan"
        }}
    >
        <GameWindow />
    </div>
);
