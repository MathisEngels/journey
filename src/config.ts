export const ANIMATION_DELAY = 2; // Can't be superior than ANIMATION_DURATION

export const ANIMATION_DURATION = 2.5;

export const ANIMATION_Y = 35;

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

export const FADE_TIME = 2;

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

export const TRIGGER_POINTS_POI = [
    {
        xMin: -69.4313,
        zMin: -14.1949,
        xMax: -58.4091,
        zMax: -2.00724,
    },
    {
        xMin: -53.3119,
        zMin: -7.23438,
        xMax: -43.1053,
        zMax: 3.42339,
    },
    {
        xMin: -36.3572,
        zMin: -14.8796,
        xMax: -28.0947,
        zMax: -6.61716,
    },
    {
        xMin: -22.3435,
        zMin: -9.14696,
        xMax: -9.07827,
        zMax: 2.0567,
    },
    {
        xMin: -1.35399,
        zMin: -16.9141,
        xMax: 15.3005,
        zMax: -2.64602,
    },
    {
        xMin: 27.263,
        zMin: -13.6759,
        xMax: 52.2799,
        zMax: 0,
    },
    {
        xMin: 41.3302,
        zMin: -5.7628,
        xMax: 46.0705,
        zMax: -1.02247,
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
        xMin: 19.7,
        zMin: -7.2,
        xMax: 26.2,
        zMax: 0,
    },
];

export const CONTACT_API = 'https://api.mathisengels.fr/contact';

export const CONTACT_EMAIL = 'contact@mathisengels.fr';
