export const angleOnLeftHalf = (angle) => angle > (1 / 2) * Math.PI && angle < (3 / 2) * Math.PI;

export const angleOnRightHalf = (angle) => angle < (1 / 2) * Math.PI || angle > (3 / 2) * Math.PI;

export const angleOnTopHalf = (angle) => angle < Math.PI;

export const angleOnBottomHalf = (angle) => angle > Math.PI;

export const createMirroredAngle = (angle) => (angle <= Math.PI ? Math.PI : 3 * Math.PI) - angle;

export const createFlippedAngle = (angle) => (2 * Math.PI) - angle;
