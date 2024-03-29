import { SCENE_NUMBER } from '@/config';
import { setTargetPosition } from '@/stores/gameStore';
import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/Addons.js';

export function setTarget(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.preventDefault();

    setTargetPosition(new Vector3(e.point.x, e.point.y + 0.01, e.point.z));
}

let timer: NodeJS.Timeout | null = null;

export function setTargetForMobile(e: ThreeEvent<MouseEvent>) {
    if (!timer) {
        timer = setTimeout(() => {
            timer = null;
        }, 300);
    } else {
        clearTimeout(timer);
        timer = null;
        setTargetPosition(new Vector3(e.point.x, e.point.y + 0.01, e.point.z));
    }
}

export function isInTrigger(position: Vector3, triggerArea: { xMin: number; xMax: number; zMin: number; zMax: number }) {
    return position.x >= triggerArea.xMin && position.x <= triggerArea.xMax && position.z >= triggerArea.zMin && position.z <= triggerArea.zMax;
}

export function convertRange(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
    return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

export function generateGrassBlade(grassSamplerPath: string, grassBladeCount: number[], xMin: number, xMax: number, zMin: number, zMax: number) {
    const { nodes } = useGLTF(grassSamplerPath);

    const position = new Vector3();

    const positionArray: number[] = [];
    const uvArray: number[] = [];
    const indiceArray: number[] = [];
    const colorArray: number[] = [];
    const sceneArray: number[] = [];

    for (let i = 0; i < SCENE_NUMBER; i++) {
        const sampler = new MeshSurfaceSampler(nodes[`GrassSampler00${i + 1}`] as Mesh).build();

        for (let j = 0; j < grassBladeCount[i]; j++) {
            sampler.sample(position);

            const uv = [convertRange(position.x, xMin, xMax, 0, 1), convertRange(position.z, zMin, zMax, 0, 1)];
            const blade = generateSingleGrassBlade(position, positionArray.length / 3 + j * 5, uv, i + 1);

            blade.verts.forEach((vertex) => {
                positionArray.push(...vertex.pos);
                uvArray.push(...vertex.uv);
                colorArray.push(...vertex.color);
                sceneArray.push(vertex.scene);
            });
            blade.indices.forEach((indice) => indiceArray.push(indice));
        }
    }

    return { positionArray, uvArray, indiceArray, colorArray, sceneArray };
}

export function objectToJsonFile(object: object, document: Document) {
    const blob = new Blob([JSON.stringify(object)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = 'output.json';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
}

function generateSingleGrassBlade(center: Vector3, vArrOffset: number, uv: number[], sceneNumber: number) {
    const BLADE_WIDTH = 0.07;
    const MID_WIDTH = BLADE_WIDTH * 0.5;
    const TIP_OFFSET = 0.01;
    const height = 0.2 + Math.random() * 0.1;

    const yaw = Math.random() * Math.PI * 2;
    const yawUnitVec = new Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const tipBend = Math.random() * Math.PI * 2;
    const tipBendUnitVec = new Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

    // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
    const bl = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * 1));
    const br = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * -1));
    const tl = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1));
    const tr = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1));
    const tc = new Vector3().addVectors(center, new Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET));

    tl.y += height / 2;
    tr.y += height / 2;
    tc.y += height;

    // Vertex Colors
    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1.0, 1.0, 1.0];

    const verts = [
        { pos: bl.toArray(), uv: uv, color: black, scene: sceneNumber },
        { pos: br.toArray(), uv: uv, color: black, scene: sceneNumber },
        { pos: tr.toArray(), uv: uv, color: gray, scene: sceneNumber },
        { pos: tl.toArray(), uv: uv, color: gray, scene: sceneNumber },
        { pos: tc.toArray(), uv: uv, color: white, scene: sceneNumber },
    ];

    const indices = [
        vArrOffset,
        vArrOffset + 1,
        vArrOffset + 2,
        vArrOffset + 2,
        vArrOffset + 4,
        vArrOffset + 3,
        vArrOffset + 3,
        vArrOffset,
        vArrOffset + 2,
    ];

    return { verts, indices };
}
