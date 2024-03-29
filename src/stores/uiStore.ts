import { atom } from 'nanostores';

export const loaded = atom(0);

export function setLoaded() {
    loaded.set(1);
}
