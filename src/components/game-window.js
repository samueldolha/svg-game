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
    const leftHorizontalBound = (width - length) / 2;
    const verticalMargin = 3;

    return (
        <div
            style={{
                position: "absolute",
                left: leftHorizontalBound,
                top: ((height - length) / 2) + verticalMargin,
                width: length,
                height: length - (2 * verticalMargin),
                background: "Cyan"
            }}
        >
            <svg
                style={{ position: "relative", left: 0, top: 0 }}
                width="100%"
                height="100%"
            >
                <GameEngine
                    leftHorizontalBound={leftHorizontalBound}
                    rightHorizontalBound={leftHorizontalBound + length}
                />
            </svg>
        </div>
    )
};
