import React from "react";

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
    const borderWidth = 1;

    return (
        <div
            style={{
                position: "absolute",
                left: (window.innerWidth - length) / 2,
                top: (window.innerHeight - length) / 2,
                width: length - (borderWidth * 2),
                height: length - (borderWidth * 2),
                borderWidth,
                borderStyle: "solid",
                borderColor: "black"
            }}
        >
            <svg
                style={{ position: "relative", left: 0, top: 0 }}
                width="100%"
                height="100%"
            >
            </svg>
        </div>
    )
};
