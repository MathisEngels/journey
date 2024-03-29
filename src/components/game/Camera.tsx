import {
    CAMERA_MAX_DISTANCE,
    CAMERA_MIN_DISTANCE,
    CAMERA_TRANSITION_SPEED,
    DEFAULT_CAMERA_POSITION,
    DEFAULT_CAMERA_ROTATION,
    SCENES_DISCOVERY_CAMERA_ANGLE,
    SCENE_NUMBER,
} from '@/config';
import {
    endOfExperience,
    lastSceneTimelineStarted,
    planePosition,
    playerOpacity,
    playerPosition,
    setCurrentTutorialInstruction,
    setPlayerOpacity,
} from '@/stores/gameStore';
import { useStore } from '@nanostores/react';
import { CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import type { Object3D } from 'three/src/core/Object3D.js';
import type { Mesh } from 'three/src/objects/Mesh.js';

function Camera() {
    const controlsRef = useRef<CameraControls>(null);
    const { gl, scene } = useThree();

    const [colliderMeshes, setColliderMeshes] = useState<Mesh[]>();
    const locked = useRef<boolean>(true);
    const previousDistance = useRef<number>(0);

    const $playerOpacity = useStore(playerOpacity);
    const $endOfExperience = useStore(endOfExperience);

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

        const computeColliderMeshes = () => {
            const meshes: Mesh[] = [];

            const nonCollidersMeshes = ['Player', 'Chemin', 'Avion', 'Pales.003'];

            scene.traverse((child: Object3D) => {
                if ((child as Mesh).isMesh && !nonCollidersMeshes.includes(child.name)) {
                    meshes.push(child as Mesh);
                }
            });

            setColliderMeshes(meshes);
        };

        computeColliderMeshes();

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

                controlsRef.current.moveTo(DEFAULT_CAMERA_POSITION.x, DEFAULT_CAMERA_POSITION.y, DEFAULT_CAMERA_POSITION.z, false);
                controlsRef.current.rotateTo(DEFAULT_CAMERA_ROTATION.azimuth, DEFAULT_CAMERA_ROTATION.polar, false);
                onResize(undefined, false);

                locked.current = true;

                controlsRef.current.disconnect();
            }
        };

        setupCameraControls();

        const unsubCameraPlayerPositionUpdater = playerPosition.listen((position) => {
            if (locked.current) return;
            if ($endOfExperience) return;
            if (controlsRef.current) {
                controlsRef.current.moveTo(position.x, position.y + 0.75, position.z, true);
            }
        });

        const unsubCameraPlanePositionUpdater = planePosition.listen((position) => {
            if (locked.current) return;
            if (!$endOfExperience) return;
            if (controlsRef.current) {
                controlsRef.current.moveTo(position.x, position.y + 0.75, position.z, true);
            }
        });

        const unlistenSceneDiscoveryAnimation = lastSceneTimelineStarted.listen((lastSceneTimelineStarted) => {
            switch (lastSceneTimelineStarted) {
                case 0:
                    break;
                case 1:
                    controlsRef.current!.connect(gl.domElement);
                    locked.current = false;
                    controlsRef.current?.rotateTo(
                        SCENES_DISCOVERY_CAMERA_ANGLE[lastSceneTimelineStarted - 1].azimuth,
                        SCENES_DISCOVERY_CAMERA_ANGLE[lastSceneTimelineStarted - 1].polar,
                        true
                    );
                    break;
                default:
                    controlsRef.current!.rotateTo(
                        SCENES_DISCOVERY_CAMERA_ANGLE[lastSceneTimelineStarted - 1].azimuth,
                        SCENES_DISCOVERY_CAMERA_ANGLE[lastSceneTimelineStarted - 1].polar,
                        true
                    );
                    break;
            }
            if (lastSceneTimelineStarted === SCENE_NUMBER) {
                unlistenSceneDiscoveryAnimation();
            }
        });

        const tutorialUpdater = () => {
            setTimeout(() => {
                setCurrentTutorialInstruction(0);
                controlsRef.current?.removeEventListener('control', tutorialUpdater);
            }, 1000);
        };
        controlsRef.current?.addEventListener('control', tutorialUpdater);

        window.addEventListener('resize', onResize);
        return () => {
            unsubCameraPlayerPositionUpdater();
            unsubCameraPlanePositionUpdater();
            unlistenSceneDiscoveryAnimation();
            controlsRef.current?.removeEventListener('control', tutorialUpdater);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const onCameraChange = (e?: { type: 'update' } | { target: { distance: number } }) => {
        if (e && 'target' in e) {
            if ($endOfExperience) return;
            const distance = e.target.distance;

            if ((previousDistance.current !== distance && distance <= 5) || ($playerOpacity !== 1 && distance > 5)) {
                const opacity = distance <= 5 ? (distance - 1) / (5 - 1) : 1;

                setPlayerOpacity(opacity);

                previousDistance.current = distance;
            }
        }
    };

    return <CameraControls ref={controlsRef} colliderMeshes={colliderMeshes} onChange={onCameraChange} />;
}

export default Camera;
