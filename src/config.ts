export const ANIMATION_DELAY = 1.5;

export const ANIMATION_DURATION = 2;

export const ANIMATION_Y = 15;

export const CAMERA_MIN_DISTANCE = 1;

export const CAMERA_MAX_DISTANCE = 10;

export const CAMERA_TRANSITION_SPEED = 0.5;

export const DEFAULT_CAMERA_POSITION = {
    x: -77,
    y: 0.1,
    z: -7,
};

export const DEFAULT_CAMERA_ROTATION = {
    azimuth: 0,
    polar: Math.PI / 16,
};

export const DEFAULT_PLAYER_POSITION = {
    x: -79.58,
    y: 0,
    z: -9.26,
};

export const SCENE_NUMBER = 6;

export const SCENES_DISCOVERY_CAMERA_ANGLE = [
    {
        azimuth: -Math.PI / 3,
        polar: Math.PI / 2 - Math.PI / 16,
    },
    {
        azimuth: -Math.PI / 2,
        polar: Math.PI / 2 - Math.PI / 16,
    },
    {
        azimuth: -Math.PI / 4,
        polar: Math.PI / 2 - Math.PI / 16,
    },
    {
        azimuth: -Math.PI / 2,
        polar: Math.PI / 2 - Math.PI / 16,
    },
    {
        azimuth: -Math.PI / 2,
        polar: Math.PI / 2 - Math.PI / 16,
    },
    {
        azimuth: -Math.PI / 2,
        polar: Math.PI / 2 - Math.PI / 16,
    },
];

export const TRIGGER_POINTS_SCENE_REVEAL = [
    {
        xMin: -76,
        zMin: -6,
        xMax: -74,
        zMax: -4,
    },
    {
        xMin: -58.4,
        zMin: -6,
        xMax: -55.9,
        zMax: -4,
    },
    {
        xMin: -41,
        zMin: -7,
        xMax: -38.5,
        zMax: -4.3,
    },
    {
        xMin: -28.5,
        zMin: -6.5,
        xMax: -26,
        zMax: -4,
    },
    {
        xMin: -6.2,
        zMin: -14.6,
        xMax: -3.7,
        zMax: -6.6,
    },
    {
        xMin: 34.5,
        zMin: -4.7,
        xMax: 38.2,
        zMax: 7,
    },
];
