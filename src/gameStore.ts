import { atom, map } from 'nanostores';
import { Vector3 } from 'three';

export const playerPosition = map<Vector3>(new Vector3(0, 0, 0));

export function setPlayerPosition(v: Vector3) {
    playerPosition.set(new Vector3(v.x, v.y, v.z));
}

export const playerOpacity = atom<number>(1);

export function setPlayerOpacity(opacity: number) {
    playerOpacity.set(opacity);
}

export const targetPosition = map<Vector3>(new Vector3(0, -1, 0));

export function setTargetPosition(v: Vector3) {
    targetPosition.set(new Vector3(v.x, v.y, v.z));
}
