import { setTargetPosition } from '@/gameStore';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3 } from 'three';

export function setTarget(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.preventDefault();

    setTargetPosition(new Vector3(e.point.x, e.point.y + 0.01, e.point.z));
}
