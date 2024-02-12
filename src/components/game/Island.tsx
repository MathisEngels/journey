import { SCENE_NUMBER } from '@/config';
import { useGLTF, useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useMemo, useState } from 'react';
import { LinearFilter, Mesh, MeshStandardMaterial, SRGBColorSpace, Texture } from 'three';
import { setTarget } from '../../utils/gameUtils';

function Island() {
    const [texture, setTexture] = useState<Texture>();
    const { nodes } = useGLTF('/world-c.glb');

    const textures: Texture[] = [];
    for (let i = 0; i <= SCENE_NUMBER; i++) {
        textures.push(useTexture(`/textures/World-texture-${i}.jpg`));
        textures[i].flipY = false;
        textures[i].colorSpace = SRGBColorSpace;
        textures[i].minFilter = LinearFilter;
    }

    const textureMaterial = useMemo(() => {
        if (!texture) return;
        return new MeshStandardMaterial({ map: texture });
    }, [texture]);

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
                />
                <mesh name="Ground" geometry={(nodes.Ground as Mesh).geometry} material={textureMaterial} receiveShadow onContextMenu={setTarget} />
            </RigidBody>
        </>
    );
}

useGLTF.preload('/world-c.glb');

export default Island;
