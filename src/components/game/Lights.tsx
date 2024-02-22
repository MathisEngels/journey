import { DEFAULT_PLAYER_POSITION } from '@/config';
import { playerPosition } from '@/gameStore';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Object3D } from 'three/src/core/Object3D.js';
import type { DirectionalLight } from 'three/src/lights/DirectionalLight.js';

function Lights() {
    const ref = useRef<DirectionalLight>(null);
    const [target, setTarget] = useState<Object3D>();
    const { scene } = useThree();

    useEffect(() => {
        scene.traverse((child: Object3D) => {
            if (child.name === 'player_rigid_body') {
                setTarget(child);
                return;
            }
        });

        const unsubscribe = playerPosition.listen((position) => {
            if (ref.current) {
                ref.current.position.set(position.x + 4.5, position.y + 5.25, position.z + 5);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <ambientLight intensity={0.9} />
            <directionalLight
                ref={ref}
                target={target}
                position={[DEFAULT_PLAYER_POSITION.x + 4.5, DEFAULT_PLAYER_POSITION.y + 5.25, DEFAULT_PLAYER_POSITION.z + 5]}
                castShadow
                intensity={1.1}
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={0.5}
                shadow-camera-far={20}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-normalBias={0.02}
                shadow-bias={-0.005}
            />
        </>
    );
}

export default Lights;
