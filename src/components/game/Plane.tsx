import { ANIMATION_DURATION, ANIMATION_Y, SCENE_NUMBER } from '@/config';
import { endOfExperience, lastSceneTimelineCompleted, setEndOfExperience, setPlanePosition } from '@/gameStore';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { CatmullRomCurve3, Group, Object3D, Vector3, type Object3DEventMap } from 'three';

function Plane() {
    const group = useRef<Object3D>(null);
    const { nodes, materials, animations } = useGLTF('/plane-c.glb');
    const { actions } = useAnimations(animations, group);

    const [startTime, setStartTime] = useState<number | null>(null);

    const animation = useRef<GSAPTween | null>(null);

    const { clock } = useThree();

    const points = [
        new Vector3(44.5999, 0, -3.39263),
        new Vector3(53.0974, 0, -3.39263),
        new Vector3(59.0209, -0.095292, -3.39263),
        new Vector3(63.0709, 0.655257, -3.39263),
        new Vector3(68.8682, 2.5647, -3.39263),
        new Vector3(78.2812, 6.41233, 12.6921),
        new Vector3(59.6364, 12.7575, 19.5364),
        new Vector3(52.9101, 12.7575, 23.1946),
        new Vector3(-62.2629, 12.7575, 24.4926),
        new Vector3(-64.859, 12.7575, 22.2506),
        new Vector3(-63.679, 12.7575, 17.8844),
        new Vector3(-60.7289, 12.7575, 15.6423),
        new Vector3(-39.842, 12.7575, 16.1143),
        new Vector3(-5.14844, 12.7575, 20.1265),
        new Vector3(16.5645, 8.90693, 15.0522),
        new Vector3(19.6326, 5.35693, 0.065583),
        new Vector3(20.7194, 4.37814, -2.33853),
        new Vector3(25.7911, 1.2137, -3.39263),
        new Vector3(40.2487, 0.009814, -3.39263),
        new Vector3(44.5999, 0, -3.39263),
    ];

    const path = new CatmullRomCurve3(points);

    useEffect(() => {
        if (group.current) {
            group.current.visible = false;

            group.current.position.y += ANIMATION_Y;

            animation.current = gsap.fromTo(
                group.current.position,
                { y: group.current.position.y },
                {
                    y: group.current.position.y - ANIMATION_Y,
                    duration: ANIMATION_DURATION,
                    paused: true,
                }
            );
        }

        const unsubAnimationTrigger = lastSceneTimelineCompleted.subscribe((value) => {
            if (value === SCENE_NUMBER && animation.current && group.current) {
                group.current.visible = true;
                animation.current.restart();
            }
        });

        const unsubEndOfXP = endOfExperience.subscribe((value) => {
            if (value) {
                setStartTime(clock.getElapsedTime());
                actions['AvionPales.Action.001']?.play();
            } else {
                actions['AvionPales.Action.001']?.stop();
                setStartTime(null);
            }
        });

        return () => {
            unsubEndOfXP();
            unsubAnimationTrigger();
            useGLTF.clear('/plane-c.glb');
        };
    }, []);

    function interpolate(t: number, tMin: number, tMax: number, transition: number, minValue: number, maxValue: number): number {
        if (t <= tMin || t >= tMax) return minValue;
        if (t <= tMin + transition) {
            const ratio = (t - tMin) / transition;
            return minValue + ratio * (maxValue - minValue);
        }
        if (t <= tMax - transition) return maxValue;

        if (t > tMax - transition) {
            const ratio = 1 - (tMax - t) / transition;
            return maxValue - ratio * (maxValue - minValue);
        }

        return 0;
    }

    useFrame(({ clock }) => {
        if (startTime) {
            const t = (clock.getElapsedTime() - startTime) / 60;

            if (t >= 1) {
                setEndOfExperience(false);

                setStartTime(null);
                return;
            }

            const position = path.getPointAt(t);
            group.current?.position.copy(position);
            setPlanePosition(position);

            const tangent = path.getTangentAt(t).normalize();
            group.current?.lookAt(position.clone().add(tangent));
            group.current?.rotateY(-Math.PI / 2);
            group.current?.rotateZ(interpolate(t, 0.1, 0.9, 0.1, 0, -Math.PI / 16));
        }
    });

    return (
        <group ref={group as React.Ref<Group<Object3DEventMap>>} name="Avion" position={[44.6, 0, -3.393]}>
            <group>
                <mesh name="Plane061" geometry={(nodes.Plane061 as THREE.Mesh).geometry} material={materials['Avion blanc']} />
                <mesh name="Plane061_1" geometry={(nodes.Plane061_1 as THREE.Mesh).geometry} material={materials['Avion bleu']} />
                <mesh name="Plane061_2" geometry={(nodes.Plane061_2 as THREE.Mesh).geometry} material={materials['Avion fenetre']} />
                <mesh name="Plane061_3" geometry={(nodes.Plane061_3 as THREE.Mesh).geometry} material={materials['Avion roue']} />
            </group>
            <group name="Pales" position={[0.467, 0.662, 0]} rotation={[0, 0, 0.214]}>
                <mesh name="Plane066" geometry={(nodes.Plane066 as THREE.Mesh).geometry} material={materials['Avion blanc']} />
                <mesh name="Plane066_1" geometry={(nodes.Plane066_1 as THREE.Mesh).geometry} material={materials['Avion bleu']} />
            </group>
        </group>
    );
}

export default Plane;
