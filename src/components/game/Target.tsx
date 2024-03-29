import { targetPosition } from '@/stores/gameStore';
import { useStore } from '@nanostores/react';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import type { Mesh } from 'three';

function Target() {
    const { nodes, materials } = useGLTF('/target-c.glb');

    const $targetPosition = useStore(targetPosition);

    useEffect(() => {
        return () => {
            useGLTF.clear('/target-c.glb');
        };
    }, []);

    return <mesh geometry={(nodes.Target as Mesh).geometry} material={materials.nodes} position={$targetPosition} />;
}

export default Target;
