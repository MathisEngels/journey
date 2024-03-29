import { ANIMATION_DELAY, ANIMATION_DURATION, ANIMATION_Y, TRIGGER_POINTS_SCENE_REVEAL } from '@/config';
import {
    lastSceneTimelineStarted,
    playerPosition,
    setCurrentTutorialInstruction,
    setLastSceneTimelineCompleted,
    setLastSceneTimelineStarted,
} from '@/stores/gameStore';
import { isInTrigger } from '@/utils/gameUtils';
import { useAnimations, useGLTF, useTexture } from '@react-three/drei';
import type { MeshProps } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BufferGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D, SRGBColorSpace, Vector3, type Object3DEventMap } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';

function Scene({ sceneNumber, animationFunction }: { sceneNumber: number; animationFunction?: () => void }) {
    useGLTF.preload(`/scene-${sceneNumber}-c.glb`);
    const group = useRef<Object3D>(null);

    const { nodes, animations } = useGLTF(`/scene-${sceneNumber}-c.glb`);
    const { actions } = useAnimations(animations, group);

    const texture = useTexture(`/textures/Scene-${sceneNumber}-texture.jpg`);
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    const textureMaterial = useMemo(() => {
        return new MeshStandardMaterial({ map: texture });
    }, []);
    if (sceneNumber !== 4 && sceneNumber !== 5) textureMaterial.side = DoubleSide;

    const [merged, setMerged] = useState<BufferGeometry | null>(null);
    const [animationDoneIndex, setAnimationDoneIndex] = useState(0);
    const [shadowCast, setShadowCast] = useState(true);

    const timeline = useRef<GSAPTimeline | null>(null);

    const sortedNodes = useMemo(() => {
        const referencePoint = new Vector3(-79.58, 0, -9.26);

        const nodesArray = [];

        for (const [_, value] of Object.entries(nodes)) {
            if (value.type === 'Mesh') {
                const distance = value.position.distanceTo(referencePoint);
                nodesArray.push({ name: value.name, distance });
            }
        }

        nodesArray.sort((a, b) => a.distance - b.distance);

        return nodesArray;
    }, [nodes]);

    const { geometriesToMerge, animatedMeshes } = useMemo(() => {
        const geometriesToMerge = [];
        const animatedMeshes = [];

        for (const nodeData of sortedNodes) {
            const nodeName = nodeData.name;
            const node = nodes[nodeName] as Mesh;

            const nodeAnimations = Object.keys(actions).filter((animationName) => {
                return animationName.startsWith(`${nodeName}.Action`);
            });

            if (nodeAnimations.length > 0) {
                animatedMeshes.push(node);
            } else {
                const clonedGeometry = node.geometry.clone();

                if (clonedGeometry.attributes && clonedGeometry.attributes.uv1) {
                    clonedGeometry.deleteAttribute('uv1');
                }

                clonedGeometry.translate(node.position.x, node.position.y, node.position.z);
                clonedGeometry.name = nodeName;

                geometriesToMerge.push(clonedGeometry);
            }
        }
        return { geometriesToMerge, animatedMeshes };
    }, [sortedNodes, actions]);

    useEffect(() => {
        if (animationFunction) {
            animationFunction();
        }

        if (group.current) {
            group.current.visible = false;

            let animatedMeshes = 0;

            timeline.current = gsap.timeline({ paused: true });

            for (const [index, node] of Object.entries(sortedNodes)) {
                const mesh = group.current.getObjectByName(node.name);

                if (!mesh) return;

                mesh.position.y += ANIMATION_Y;

                timeline.current.fromTo(
                    mesh.position,
                    { y: mesh.position.y },
                    {
                        y: mesh.position.y - ANIMATION_Y,
                        duration: ANIMATION_DURATION,
                        onComplete: () => {
                            if (mesh.animations.length > 0) animatedMeshes++;
                            setAnimationDoneIndex(Number(index) - animatedMeshes);
                        },
                    },
                    '>-' + ANIMATION_DELAY
                );
            }

            timeline.current.eventCallback('onComplete', () => {
                setLastSceneTimelineCompleted(sceneNumber);
                setShadowCast(false);
            });
        }

        const unlisten = playerPosition.listen((position) => {
            if (
                timeline.current &&
                group.current &&
                lastSceneTimelineStarted.get() === sceneNumber - 1 &&
                isInTrigger(position, TRIGGER_POINTS_SCENE_REVEAL[sceneNumber - 1])
            ) {
                setLastSceneTimelineStarted(sceneNumber);
                group.current.visible = true;
                timeline.current.restart();
            }
        });

        let unsubcribeTutorialUpdater = () => {};
        if (sceneNumber === 1) {
            unsubcribeTutorialUpdater = playerPosition.listen((position) => {
                if (isInTrigger(position, TRIGGER_POINTS_SCENE_REVEAL[sceneNumber - 1])) {
                    setCurrentTutorialInstruction(0);
                    unsubcribeTutorialUpdater();

                    setTimeout(() => {
                        setCurrentTutorialInstruction(3);
                    }, 250);
                }
            });
        }

        return () => {
            unlisten();
            unsubcribeTutorialUpdater();
            useGLTF.clear(`/scene-${sceneNumber}-c.glb`);
        };
    }, []);

    const mergeGeometries = (mergedGeometry: BufferGeometry, geometryToMerge: BufferGeometry): BufferGeometry => {
        return BufferGeometryUtils.mergeGeometries([mergedGeometry, geometryToMerge]);
    };

    useEffect(() => {
        switch (animationDoneIndex) {
            case 0:
                break;
            case 1:
                setMerged(mergeGeometries(geometriesToMerge[0], geometriesToMerge[1]));
                break;
            default:
                setMerged(mergeGeometries(merged as BufferGeometry, geometriesToMerge[animationDoneIndex]));
                break;
        }
    }, [animationDoneIndex]);

    return (
        <group ref={group as React.Ref<Group<Object3DEventMap>>} name={`scene-${sceneNumber}`}>
            {geometriesToMerge.map((geometry, index) => {
                return (
                    index >= animationDoneIndex &&
                    animationDoneIndex !== geometriesToMerge.length - 1 && (
                        <mesh
                            key={`geometry-${index}`}
                            name={geometry.name}
                            geometry={geometry}
                            material={textureMaterial}
                            castShadow
                            receiveShadow
                        />
                    )
                );
            })}
            {merged && (
                <RigidBody key={merged.uuid} colliders={'trimesh'} type={'fixed'}>
                    <mesh geometry={merged} material={textureMaterial} receiveShadow castShadow={shadowCast} />
                </RigidBody>
            )}
            {animatedMeshes.map((mesh, index) => {
                return <mesh {...(mesh as unknown as MeshProps)} key={`animated-${index}`} material={textureMaterial} receiveShadow castShadow />;
            })}
        </group>
    );
}

export default Scene;
