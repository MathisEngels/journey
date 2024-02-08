import { CAMERA_MAX_DISTANCE, CAMERA_MIN_DISTANCE, CAMERA_TRANSITION_SPEED, DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_ROTATION } from '@/config';
import { playerOpacity, playerPosition, setPlayerOpacity } from '@/gameStore';
import { useStore } from '@nanostores/react';
import { CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import type { Object3D } from 'three/src/core/Object3D.js';
import type { Mesh } from 'three/src/objects/Mesh.js';

function Camera() {
    const controlsRef = useRef<CameraControls>(null);
    const { scene } = useThree();

    const locked = useRef<boolean>(true);
    const previousDistance = useRef<number>(0);

    const colliderMeshes = useMemo(() => {
        const meshes: Mesh[] = [];

        scene.traverse((child: Object3D) => {
            if ((child as Mesh).isMesh && child.name !== 'player' && child.name !== 'Chemin') {
                meshes.push(child as Mesh);
            }
        });

        return meshes;
    }, []);

    const $playerPosition = useStore(playerPosition);
    const $playerOpacity = useStore(playerOpacity);

    useEffect(() => {
        if (locked.current) return;
        if (controlsRef.current) {
            controlsRef.current.moveTo($playerPosition.x, $playerPosition.y + 0.75, $playerPosition.z, true);
        }
    }, [$playerPosition]);

    useEffect(() => {
        const onResize = (_event?: Event, animate = true): void => {
            if (controlsRef.current) {
                const target = new Vector3();
                controlsRef.current.getTarget(target);

                if (target.x === DEFAULT_CAMERA_POSITION.x && target.y === DEFAULT_CAMERA_POSITION.y && target.z === DEFAULT_CAMERA_POSITION.z) {
                    const aspectRatio = window.innerWidth / window.innerHeight;
                    if (aspectRatio < 16 / 9) {
                        controlsRef.current.zoomTo(Math.min(aspectRatio * 0.8 + 0.2 * aspectRatio, (16 / 9) * 0.8), animate);
                    } else {
                        controlsRef.current.zoomTo((16 / 9) * 0.8, animate);
                    }
                } else {
                    window.removeEventListener('resize', onResize);
                }
            }
        };

        const setupCameraControls = () => {
            if (controlsRef.current) {
                controlsRef.current.smoothTime = CAMERA_TRANSITION_SPEED;
                controlsRef.current.minDistance = CAMERA_MIN_DISTANCE;
                controlsRef.current.maxDistance = CAMERA_MAX_DISTANCE;
                controlsRef.current.distance = CAMERA_MAX_DISTANCE;
                controlsRef.current.maxPolarAngle = Math.PI / 2;
                controlsRef.current.mouseButtons = {
                    left: 1,
                    middle: 0,
                    right: 0,
                    wheel: 8,
                };
                controlsRef.current.colliderMeshes = colliderMeshes;

                controlsRef.current.moveTo(DEFAULT_CAMERA_POSITION.x, DEFAULT_CAMERA_POSITION.y, DEFAULT_CAMERA_POSITION.z, false);
                controlsRef.current.rotateTo(DEFAULT_CAMERA_ROTATION.azimuth, DEFAULT_CAMERA_ROTATION.polar, false);
                onResize(undefined, false);

                locked.current = false;

                // controlsRef.current.disconnect();
            }
        };

        setupCameraControls();

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const onCameraChange = (e?: { type: 'update' } | { target: { distance: number } }) => {
        if (e && 'target' in e) {
            const distance = e.target.distance;

            if ((previousDistance.current !== distance && distance <= 5) || ($playerOpacity !== 1 && distance > 5)) {
                const opacity = distance <= 5 ? (distance - 1) / (5 - 1) : 1;

                setPlayerOpacity(opacity);

                previousDistance.current = distance;
            }
        }
    };

    return <CameraControls ref={controlsRef} onChange={onCameraChange} />;
}

export default Camera;
