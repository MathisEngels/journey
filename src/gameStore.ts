import { atom, computed, map } from 'nanostores';
import { Vector3 } from 'three';
import { isInTrigger } from './utils/gameUtils';
import { TRIGGER_POINTS_POI } from './config';

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

export const lastSceneTimelineStarted = atom(0);

export function setLastSceneTimelineStarted(scene: number) {
    lastSceneTimelineStarted.set(scene);
}

export const lastSceneTimelineCompleted = atom(0);

export function setLastSceneTimelineCompleted(scene: number) {
    lastSceneTimelineCompleted.set(scene);
}

export const currentPOI = computed(playerPosition, (position) => {
    let newPOI = -1;

    for (let i = 0; i < TRIGGER_POINTS_POI.length; i++) {
        if (isInTrigger(position, TRIGGER_POINTS_POI[i])) {
            newPOI = i;
            break;
        }
    }

    return newPOI;
});

export const loaderFade = atom(false);

export function setLoaderFade(fade: boolean) {
    loaderFade.set(fade);
}
