import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Camera from './Camera';
import Lights from './Lights';

function Fiber() {
    return (
        <Canvas shadows>
            <Physics>
                <Camera />
                <Lights />
                <Preload all />
            </Physics>
        </Canvas>
    );
}

export default Fiber;
