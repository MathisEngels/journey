import { DEFAULT_PLAYER_POSITION } from '@/config';
import { playerOpacity, playerPosition, setCurrentTutorialInstruction, setPlayerPosition, targetPosition } from '@/gameStore';
import { useStore } from '@nanostores/react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import { Group, LoopOnce, MathUtils, Mesh, Object3D, Quaternion, Vector3, type Object3DEventMap } from 'three';

const position = new Vector3();
const direction = new Vector3();
const newPlayerPosition = new Vector3();

let accumulator = 0;
const fixedDeltaTime = 1 / 60; // 60 updates per second

function Player() {
    const group = useRef<Object3D>();
    const { nodes, materials, animations } = useGLTF('/player-c.glb');
    const { actions } = useAnimations(animations, group);

    const [wakingUp, setWakingUp] = useState(false);
    const [wokeUp, setWokeUp] = useState(false);

    const playerRigidBodyRef = useRef<RapierRigidBody>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerControllerRef = useRef<any>();
    const horizontalVelocityRef = useRef<{ x: number; z: number }>({
        x: 0,
        z: 0,
    });

    const { world } = useRapier();

    const $target = useStore(targetPosition);
    const $opacity = useStore(playerOpacity);

    const wakeUpAnimationAndRelease = () => {
        if (wakingUp) return;
        setWakingUp(true);

        if (actions['WakeUp'] && actions['Sleeping']) {
            actions['Sleeping'].stop();
            actions['WakeUp'].setLoop(LoopOnce, 1);
            actions['WakeUp'].time = 0.1;
            actions['WakeUp'].getMixer().addEventListener('finished', () => {
                setWokeUp(true);
            });
            actions['WakeUp'].play();
        }
    };
    if (!wokeUp && $target.y !== -1) wakeUpAnimationAndRelease();

    useEffect(() => {
        playerControllerRef.current = world.createCharacterController(0.01);
        playerControllerRef.current.enableAutostep(0.3, 0.2, true);
        playerControllerRef.current.enableSnapToGround(0.3);
        playerControllerRef.current.setApplyImpulsesToDynamicBodies(true);

        if (actions['Sleeping']) actions['Sleeping'].play();

        const unsubscribeTutorialUpdater = playerPosition.listen(() => {
            setCurrentTutorialInstruction(0);
            unsubscribeTutorialUpdater();

            setTimeout(() => {
                setCurrentTutorialInstruction(2);
            }, 250);
        });

        return () => {
            playerControllerRef.current?.free();
            playerControllerRef.current = null;
            unsubscribeTutorialUpdater();
            useGLTF.clear('/player-c.glb');
        };
    }, []);

    useFrame((_, delta) => {
        if (!playerRigidBodyRef.current || !playerControllerRef.current || !playerRigidBodyRef.current.numColliders()) return;

        accumulator += delta;

        while (accumulator >= fixedDeltaTime) {
            if (wokeUp && $target) {
                position.copy(playerRigidBodyRef.current.translation());

                const distance = Math.round($target.distanceTo(position) * 1000) / 1000;
                const speed = (1 - Math.pow(0.01, fixedDeltaTime)) * Math.min(distance, 1);

                if (distance > speed && speed > 0) {
                    setPlayerPosition(position);

                    const factor = 1.5 - Math.pow(0.1, fixedDeltaTime);
                    direction.subVectors($target, position).normalize().multiplyScalar(speed);

                    // Rotation
                    if (distance > 0.5) {
                        const angle = Math.atan2(direction.z, direction.x);
                        const rotationToTarget = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -angle);
                        const newRotation = new Quaternion().copy(playerRigidBodyRef.current.rotation());
                        const rotation = new Quaternion().slerpQuaternions(newRotation, rotationToTarget, factor);

                        newRotation.x += rotation.x;
                        newRotation.y += rotation.y;
                        newRotation.z += rotation.z;
                        newRotation.w += rotation.w;

                        playerRigidBodyRef.current.setNextKinematicRotation(newRotation);
                    }

                    horizontalVelocityRef.current = {
                        x: MathUtils.lerp(horizontalVelocityRef.current.x, direction.x, factor),
                        z: MathUtils.lerp(horizontalVelocityRef.current.z, direction.z, factor),
                    };

                    const movementDirection = {
                        x: horizontalVelocityRef.current.x,
                        y: direction.y < 0 ? direction.y : 0,
                        z: horizontalVelocityRef.current.z,
                    };

                    const playerCollider = playerRigidBodyRef.current.collider(0);
                    playerControllerRef.current.computeColliderMovement(playerCollider, movementDirection);

                    const movement = playerControllerRef.current.computedMovement();

                    newPlayerPosition.set(position.x + movement.x, position.y + movement.y, position.z + movement.z);

                    playerRigidBodyRef.current.setNextKinematicTranslation(newPlayerPosition);
                }
            }

            accumulator -= fixedDeltaTime;
        }
    });

    return (
        <group ref={group as React.Ref<Group<Object3DEventMap>>}>
            <RigidBody
                ref={playerRigidBodyRef}
                name={'player_rigid_body'}
                type={'kinematicPosition'}
                mass={1}
                position={new Vector3().copy(DEFAULT_PLAYER_POSITION)}
            >
                <mesh
                    name="Player"
                    geometry={(nodes.Player as Mesh).geometry}
                    material={materials.Player}
                    material-transparent
                    material-opacity={$opacity}
                    castShadow
                />
            </RigidBody>
        </group>
    );
}

useGLTF.preload('/player-c.glb');

export default Player;
