<template>
    <div class="editor">

        <div class="view-panel">
            <canvas id="editor-canvas" width="1500" height="900"></canvas>
        </div>
        <PropsEditPanel @props-set="propsSet" />
    </div>
    
</template>

<script setup lang="ts">
import Engine from "@/engine";
import { Camera } from "@/engine/Camera";
import { Cube } from "@/engine/Geometric";
import {  DirectionalLight, PbrLight } from "@/engine/Light";
import {  PBRMaterial } from "@/engine/Material";
import { Vec3 } from "@/engine/math/Vector";
import { Texture } from "@/engine/Texture";
import { onMounted } from "vue";
import PropsEditPanel from "./PropsEditPanel.vue";


interface EditProps {
    light: PbrLight,
    material: PBRMaterial
}

const camera = new Camera();
const light = new DirectionalLight();
let engine: Engine;
let material = new PBRMaterial();

const engineInit = async () => {
    engine = new Engine('editor-canvas')
    engine.setLight(light)
    camera.lookAt(
        new Vec3(0, 1, 3),
        new Vec3(0, 0, 0),
        new Vec3(0, 1, 0)
    ).persective(45, engine.canvas.width / engine.canvas.height, 0.1, 5);
    engine.setCamera(camera)

    // material.matrialSpecularTexture = await Texture.createTexture(engine.gl, './container2_specular.png') as Texture
    material.matrialDiffuseTexture = await Texture.createTexture(engine.gl, './brickwall.jpg') as Texture
    material.normalMap =  await Texture.createTexture(engine.gl, './brickwall_normal.jpg') as Texture
    
    engine.enableMouseMove();

}

const engineRender =  () => {
    
    // let theta = 0.0;
    const cube = new Cube();
    cube.setPBRMaterial(material)
    engine.addGeo(cube)
    engine.pipelineInit();

    engine.pipelineRender(() => {

        // theta = theta + 0.5
        // e.scene[0].roateX(theta)
        // e.scene[0].roateY(theta)

    })

}

const propsSet = (props:EditProps) => {
    material.setProps(props.material)
    light.setProps(props.light);
    engine.clear();
    engineRender();
}

onMounted( async()=>{
   await engineInit();
    engineRender();
})

</script>


