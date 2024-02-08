import { atom, map } from 'nanostores';

export const currentPOI = atom<number>(-1);

export interface PlayerPosition {
    x: number;
    y: number;
    z: number;
}

export const playerPosition = map<PlayerPosition>({
    x: 0,
    y: 0,
    z: 0,
});

export const playerOpacity = atom<number>(1);

export function setPlayerOpacity(opacity: number) {
    playerOpacity.set(opacity);
}
