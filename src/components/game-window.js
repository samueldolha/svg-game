import React from "react";
import GameEngine from "./game-engine";

const getLength = () => Math.min(window.innerWidth, window.innerHeight);

export default () => {
    const [length, setLength] = React.useState(getLength());
    const handleResize = React.useCallback(
        () => {
            setLength(getLength());
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

    return (
        <div
            style={{
                position: "absolute",
                left: (window.innerWidth - length) / 2,
                top: (window.innerHeight - length) / 2 + 3,
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
