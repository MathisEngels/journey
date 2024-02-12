import { setTargetPosition } from '@/gameStore';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3 } from 'three';

export function setTarget(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.preventDefault();

    setTargetPosition(new Vector3(e.point.x, e.point.y + 0.01, e.point.z));
}

export function isInTrigger(position: Vector3, triggerArea: { xMin: number; xMax: number; zMin: number; zMax: number }) {
    return position.x >= triggerArea.xMin && position.x <= triggerArea.xMax && position.z >= triggerArea.zMin && position.z <= triggerArea.zMax;
}
