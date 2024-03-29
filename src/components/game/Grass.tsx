import { FADE_TIME, SCENE_NUMBER } from '@/config';
import grassBladeData from '@/data/grassBladeData.json';
import { lastSceneTimelineStarted } from '@/stores/gameStore';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BufferAttribute, BufferGeometry, DoubleSide, Mesh, RepeatWrapping, ShaderMaterial, Texture, TextureLoader } from 'three';

const grassVertexShader = `
        varying vec2 vUv;
        varying vec2 cloudUV;
        varying float vScene;

        varying vec3 vColor;
        uniform float u_time;

        attribute float scene;

        void main() {
            vScene = scene;

            vUv = uv;
            cloudUV = uv;
            vColor = color;
            vec3 cpos = position;

            float waveSize = 10.0f;
            float tipDistance = 0.1f;
            float centerDistance = 0.05f;

            if (color.x > 0.6f) {
                cpos.x += sin((u_time / 2.) + (uv.x * waveSize)) * tipDistance;
            } else if (color.x > 0.0f) {
                cpos.x += sin((u_time / 2.) + (uv.x * waveSize)) * centerDistance;
            }

            float diff = position.x - cpos.x;
            cloudUV.x += u_time / 20000.;
            cloudUV.y += u_time / 10000.;

            vec4 worldPosition = vec4(cpos, 1.);
            vec4 mvPosition = projectionMatrix * modelViewMatrix * worldPosition;
            gl_Position = mvPosition;
        }
    `;

const grassFragmentShader = `
        uniform sampler2D textures[4];
        uniform float scene_alpha[3];

        varying vec2 vUv;
        varying vec2 cloudUV;
        varying vec3 vColor;
        varying float vScene;

        void main() {
            float contrast = 1.5;
            float brightness = 0.1;
            vec3 color = texture2D(textures[0], vUv).rgb * contrast;
            color = color + vec3(brightness, brightness, brightness);
            color = mix(color, texture2D(textures[1], cloudUV).rgb, 0.4);

            gl_FragColor.rgb = color;
            gl_FragColor.a = scene_alpha[int(round(vScene)) - 1];
        }
    `;

interface GrassUniforms {
    textures: { value: [Texture, Texture] };
    u_time: { type: 'f'; value: number };
    scene_alpha: { type: 'fv'; value: number[] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [uniform: string]: any;
}

function Grass() {
    const ref = useRef<Mesh | null>(null);
    const [scenesAlphaStartTime, setScenesAlphaStartTime] = useState<number[]>(Array(SCENE_NUMBER).fill(-1));

    const { clock } = useThree();

    const grassGeometry = useMemo(() => {
        const tempGeometry = new BufferGeometry();

        tempGeometry.setAttribute('position', new BufferAttribute(new Float32Array(grassBladeData.positions), 3));
        tempGeometry.setAttribute('uv', new BufferAttribute(new Float32Array(grassBladeData.uvs), 2));
        tempGeometry.setAttribute('color', new BufferAttribute(new Float32Array(grassBladeData.colors), 3));
        tempGeometry.setAttribute('scene', new BufferAttribute(new Float32Array(grassBladeData.scenes), 1));
        tempGeometry.setIndex(grassBladeData.indices);
        tempGeometry.computeVertexNormals();

        return tempGeometry;
    }, []);

    const grassMaterial = useMemo(() => {
        const grassTexture = new TextureLoader().load('/textures/grass.jpg');

        const cloudTexture = new TextureLoader().load('/textures/cloud.jpg');
        cloudTexture.wrapS = cloudTexture.wrapT = RepeatWrapping;

        return new ShaderMaterial({
            uniforms: {
                textures: { value: [grassTexture, cloudTexture] },
                u_time: { type: 'f', value: 0.0 },
                scene_alpha: { type: 'fv', value: new Array(SCENE_NUMBER).fill(0) },
            } as GrassUniforms,
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            vertexColors: true,
            side: DoubleSide,
            transparent: true,
        });
    }, []);

    useEffect(() => {
        const unsubscribe = lastSceneTimelineStarted.subscribe((scene) => {
            if (scenesAlphaStartTime[scene - 1] === -1) {
                setScenesAlphaStartTime((prev) => {
                    const newAlpha = [...prev];
                    newAlpha[scene - 1] = clock.getElapsedTime();
                    return newAlpha;
                });
            }

            if (scene === SCENE_NUMBER) {
                unsubscribe();
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useFrame(({ clock }) => {
        if (ref.current) {
            (ref.current.material as ShaderMaterial).uniforms.u_time.value = clock.getElapsedTime();

            for (let i = 0; i < SCENE_NUMBER; i++) {
                if (scenesAlphaStartTime[i] === -1) continue;

                const alpha = Math.min((clock.getElapsedTime() - scenesAlphaStartTime[i]) / FADE_TIME, 1);

                (ref.current.material as ShaderMaterial).uniforms.scene_alpha.value[i] = alpha;

                if (alpha >= 1) {
                    setScenesAlphaStartTime((prev) => {
                        const newAlpha = [...prev];
                        newAlpha[i] = -1;
                        return newAlpha;
                    });
                }
            }
        }
    });

    return <mesh ref={ref} geometry={grassGeometry} material={grassMaterial} />;
}

export default Grass;
