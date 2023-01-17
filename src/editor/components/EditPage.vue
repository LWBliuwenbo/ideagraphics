<template>
    <div class="editor">
        <MeshListPanel v-model="currentMesh" @change="changeMesh" />
        <div class="view-panel">
            <canvas id="editor-canvas" width="1000" height="1000"></canvas>
        </div>
        <PropsEditPanel @props-set="propsSet" />
    </div>
    
</template>

<script setup lang="ts">
import Engine from "@/engine";
import { Camera } from "@/engine/Camera";
import { Cube, Sphere } from "@/engine/Geometric";
import {  DirectionalLight, PbrLight } from "@/engine/Light";
import {  PBRMaterial } from "@/engine/Material";
import { Vec3 } from "@/engine/math/Vector";
import { Texture } from "@/engine/Texture";
import { onMounted } from "vue";
import MeshListPanel from "./MeshListPanel.vue";
import PropsEditPanel from "./PropsEditPanel.vue";

enum MeshID {
    Cube= 'Cube',
    Sphere= 'Sphere'
}
interface mesh {
    image: string,
    id: MeshID,
    name: string
}

interface EditProps {
    light: PbrLight,
    material: PBRMaterial
}

const camera = new Camera();
const light = new DirectionalLight();

const meshs = {
    Cube: new Cube(),
    Sphere: new Sphere()
}

const currentMesh : mesh = {
    id: MeshID.Cube,
    name: '',
    image: ''
}

let engine: Engine;
let material = new PBRMaterial();

const engineInit = async () => {
    engine = new Engine('editor-canvas')
    engine.setLight(light)
    camera.lookAt(
        new Vec3(0, 0, 3),
        new Vec3(0, 0, 0),
        new Vec3(0, 1, 0)
    ).persective(45, engine.canvas.width / engine.canvas.height, 0.1, 5);

    engine.setCamera(camera)

    material.matrialDiffuseTexture = await Texture.createTexture(engine.gl, './brickwall.jpg') as Texture
    material.normalMap =  await Texture.createTexture(engine.gl, './brickwall_normal.jpg') as Texture
    
    let roateX = 0;
    let roateY = 0;
    engine.addMouseMoveListener((degx: number, degy: number)=>{
        roateX += degx;
        roateY += degy;
        engine.scene[0].roateX(roateX)
        engine.scene[0].roateY(roateY)
    });

    // const cube = new Cube();
    const mesh = meshs[currentMesh.id];
    mesh.setPBRMaterial(material)
    engine.addGeo(mesh)


}
const engineRender =  () => {    
    engine.pipelineRender()
}

const propsSet = (props:EditProps) => {
    material.setProps(props.material)
    light.setProps(props.light);
    engine.scene[0].setPBRMaterial(material)
    engine.clearAnimate();
    engineRender();
}

const changeMesh = (mesh: mesh) => {
    engine.clear();
    const meshInstance = meshs[mesh.id];
    meshInstance.setPBRMaterial(material)
    engine.addGeo(meshInstance)
    engineRender();
}

onMounted( async()=>{
   await engineInit();
    engineRender();
})

</script>
<style>
.editor {
    display: flex;
}
</style>

