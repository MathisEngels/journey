import { atom, computed, map } from 'nanostores';
import { Vector3 } from 'three';
import { TRIGGER_POINTS_POI } from '../config';
import { isInTrigger } from '../utils/gameUtils';

export const currentTutorialInstruction = atom(0);

export function setCurrentTutorialInstruction(instructions: number) {
    currentTutorialInstruction.set(instructions);
}

export const lastSceneTimelineStarted = atom(0);

export function setLastSceneTimelineStarted(scene: number) {
    lastSceneTimelineStarted.set(scene);
}

export const lastSceneTimelineCompleted = atom(0);

export function setLastSceneTimelineCompleted(scene: number) {
    lastSceneTimelineCompleted.set(scene);
}

export const loaderFade = atom(false);

export function setLoaderFade(fade: boolean) {
    loaderFade.set(fade);
}

export const playerOpacity = atom<number>(1);

export function setPlayerOpacity(opacity: number) {
    playerOpacity.set(opacity);
}

export const playerPosition = map<Vector3>(new Vector3(0, 0, 0));

export function setPlayerPosition(v: Vector3) {
    playerPosition.set(new Vector3(v.x, v.y, v.z));
}

export const targetPosition = map<Vector3>(new Vector3(0, -1, 0));

export function setTargetPosition(v: Vector3) {
    targetPosition.set(new Vector3(v.x, v.y, v.z));
}

export const endOfExperience = atom(false);

export function setEndOfExperience(end: boolean) {
    endOfExperience.set(end);
}

export const planePosition = map<Vector3>(new Vector3(0, 0, 0));

export function setPlanePosition(v: Vector3) {
    playerPosition.set(new Vector3(v.x, v.y, v.z));
}

export const currentPOI = computed([playerPosition, endOfExperience], (position, endOfExperience) => {
    let newPOI = -1;

    for (let i = 0; i < TRIGGER_POINTS_POI.length; i++) {
        if (isInTrigger(position, TRIGGER_POINTS_POI[i])) {
            newPOI = i;
            if (newPOI !== TRIGGER_POINTS_POI.length - 2 || endOfExperience) break;
        }
    }

    return newPOI;
});
