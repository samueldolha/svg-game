import React from "react";
import GameEngine from "./game-engine";

export default () => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);
    const handleResize = React.useCallback(
        () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        },
        []
    );
    React.useEffect(
        () => {
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        },
        [handleResize]
    );
    const length = Math.min(width, height);

    return (
        <div
            style={{
                position: "absolute",
                left: (width - length) / 2,
                top: (height - length) / 2 + 3,
                width: length,
                height: length - 6,
                background: "Cyan",
            }}
        >
            <svg
                style={{ position: "relative", left: 0, top: 0 }}
                width="100%"
                height="100%"
            >
                <GameEngine />
            </svg>
        </div>
    )
};
