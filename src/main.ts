import Engine from "./engine";
import { Camera } from "./engine/Camera";
import { Cube } from "./engine/Geometric";
import { Light } from "./engine/Light";
import { Material } from "./engine/Material";
import { Vec3, Vec4 } from "./engine/math/Vector";
import { Texture } from "./engine/Texture";

const engine = new Engine('engine-canvas')
const camera = new Camera();
const light = new Light();

const radius = 4.0;
var Cameratheta = 10 / 180 * Math.PI;
var phi = 0 / 180 * Math.PI;

const engineRender = async () => {
    light.setPosition(new Vec4(3.0, 3.0, 3.0, 1.0))
    light.setAmbient(new Vec4(0.3, 0.3, 0.3))
    light.setDiffuse(new Vec4(1, 1, 1))
    light.setSpecular(new Vec4(1, 1, 1))

    engine.setLight(light)

    camera.lookAt(
        new Vec3(2, 2, 2),
        new Vec3(1, 1, 1),
        new Vec3(0, 0, 1)
    ).persective(45, engine.canvas.width / engine.canvas.height, 0.1, 5);

    let theta = 0.0;
    let distance = 0.5

    const cube = new Cube();
    const material = new Material();
    material.matrialSpecularTexture = await Texture.createTexture(engine.gl, './container2_specular.png') as Texture
    material.matrialDiffuseTexture = await Texture.createTexture(engine.gl, './container2.png') as Texture


    cube.setMaterial(material)

    engine.addGeo(cube)
    engine.setCamera(camera)
    engine.pipelineInit();
    engine.pipelineRender((e) => {

        theta = theta + 2.0

        e.scene[0].scaleX(0.8)
        e.scene[0].scaleY(0.8)
        e.scene[0].scaleZ(0.8)
        e.scene[0].roateZ(theta)
        // e.scene[0].roateX(theta)
    })

}

engineRender();