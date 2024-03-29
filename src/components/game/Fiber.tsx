import Camera from '@/components/game/Camera';
import FinishLoading from '@/components/game/FinishLoading';
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
import { Suspense } from 'react';

function Fiber() {
    return (
        <Canvas shadows>
            <Physics>
                <Suspense fallback={Empty()}>
                    <Island />
                    <Grass />

                    <Sky distance={400} inclination={0.7} azimuth={0.625} turbidity={5} rayleigh={0.25} />

                    <Scene sceneNumber={1} />
                    <Scene sceneNumber={2} />
                    <Scene sceneNumber={3} animationFunction={(actions) => actions['Pales.Action.001'].play()} />
                    <Scene sceneNumber={4} />
                    <Scene sceneNumber={5} />
                    <Scene sceneNumber={6} />

                    <Plane />

                    <Player />
                    <Target />

                    <Camera />
                    <Lights />

                    <Preload all />

                    <FinishLoading />
                </Suspense>
            </Physics>
        </Canvas>
    );
}

function Empty() {
    return <></>;
}

export default Fiber;
