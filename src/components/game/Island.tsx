import { SCENE_NUMBER } from '@/config';
import { lastSceneTimelineCompleted } from '@/stores/gameStore';
import { setTarget, setTargetForMobile } from '@/utils/gameUtils';
import { useGLTF, useTexture } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useMemo, useState } from 'react';
import { LinearFilter, Mesh, MeshStandardMaterial, SRGBColorSpace, Texture } from 'three';

function Island() {
    const [texture, setTexture] = useState<Texture>();
    const { nodes } = useGLTF('/island.glb');

    const textures: Texture[] = [];
    for (let i = 0; i <= SCENE_NUMBER; i++) {
        textures.push(useTexture(`/textures/Island-${i}.webp`));
        textures[i].flipY = false;
        textures[i].colorSpace = SRGBColorSpace;
        textures[i].minFilter = LinearFilter;
        textures[i].magFilter = LinearFilter;
    }

    const textureMaterial = useMemo(() => {
        if (!texture) return;
        const material = new MeshStandardMaterial({ map: texture });
        material.alphaTest = 0.99;
        return material;
    }, [texture]);

    const preventMovement = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        event.nativeEvent.stopPropagation();
        event.nativeEvent.preventDefault();
    };

    useEffect(() => {
        const unsubscribe = lastSceneTimelineCompleted.subscribe((lastSceneTimelineCompleted) => {
            setTexture(textures[lastSceneTimelineCompleted]);
        });

        return () => {
            unsubscribe();
            useGLTF.clear('/island.glb');
            for (let i = 0; i <= SCENE_NUMBER; i++) {
                useTexture.clear(`/textures/Island-${i}.webp`);
            }
        };
    }, []);

    return (
        <>
            <RigidBody type="fixed" colliders="trimesh">
                <mesh
                    name="Text"
                    geometry={(nodes.Text as Mesh).geometry}
                    material={textureMaterial}
                    position={[-80, 0, -8.858]}
                    receiveShadow
                    onContextMenu={setTarget}
                    onClick={setTargetForMobile}
                />
                <mesh
                    name="Ground"
                    geometry={(nodes.Ground as Mesh).geometry}
                    material={textureMaterial}
                    position={[0, -0.01, 0]}
                    receiveShadow
                    onContextMenu={setTarget}
                    onClick={setTargetForMobile}
                />
                <mesh
                    name="Water"
                    geometry={(nodes.Water as Mesh).geometry}
                    material={textureMaterial}
                    position={[0, -0.323, 0]}
                    receiveShadow
                    onContextMenu={preventMovement}
                    onClick={preventMovement}
                />
            </RigidBody>
        </>
    );
}

useGLTF.preload('/island.glb');

export default Island;
