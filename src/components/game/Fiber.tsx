import Camera from '@/components/game/Camera';
import Grass from '@/components/game/Grass';
import Island from '@/components/game/Island';
import Lights from '@/components/game/Lights';
import Plane from '@/components/game/Plane';
import Player from '@/components/game/Player';
import Scene from '@/components/game/Scene';
import Target from '@/components/game/Target';
import { Preload, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { Suspense } from 'react';

function Fiber() {
    return (
        <Canvas shadows>
            <Physics>
                <Suspense>
                    <Perf deepAnalyze />

                    <Island />
                    <Sky distance={400} inclination={0.7} azimuth={0.625} turbidity={5} rayleigh={0.25} />
                    <Grass />

                    <Scene sceneNumber={1} />

                    <Plane />

                    <Player />
                    <Target />

                    <Camera />
                    <Lights />

                    <Preload all />
                </Suspense>
            </Physics>
        </Canvas>
    );
}

export default Fiber;
