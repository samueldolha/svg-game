export const onLeftHalf = (angle) => angle > (1 / 2) * Math.PI && angle < (3 / 2) * Math.PI;

export const onRightHalf = (angle) => angle < (1 / 2) * Math.PI || angle > (3 / 2) * Math.PI;

export const onTopHalf = (angle) => angle < Math.PI;

export const onBottomHalf = (angle) => angle > Math.PI;

export const getMirrored = (angle) => (angle <= Math.PI ? Math.PI : 3 * Math.PI) - angle;

export const getFlipped = (angle) => (2 * Math.PI) - angle;
