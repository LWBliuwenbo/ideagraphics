import Engine from "./engine";
import { Camera } from "./engine/Camera";
import { Cube } from "./engine/Geometric";
import { Light, DirectionalLight,DotLight } from "./engine/Light";
import { Material } from "./engine/Material";
import { Vec3, Vec4 } from "./engine/math/Vector";
import { Texture } from "./engine/Texture";

const engine = new Engine('engine-canvas')
const camera = new Camera();
const light = new DirectionalLight();

const radius = 4.0;
var Cameratheta = 10 / 180 * Math.PI;
var phi = 0 / 180 * Math.PI;

const engineRender = async () => {


    engine.setLight(light)

    camera.lookAt(
        new Vec3(0, 0, 3),
        new Vec3(0, 0, 0),
        new Vec3(0, 1, 0)
    ).persective(45, engine.canvas.width / engine.canvas.height, 0.1, 5);

    let theta = 0.0;
    let distance = 0.5

    const cube = new Cube();
    const material = new Material();
    // material.matrialSpecularTexture = await Texture.createTexture(engine.gl, './container2_specular.png') as Texture
    material.matrialDiffuseTexture = await Texture.createTexture(engine.gl, './brickwall.jpg') as Texture
    material.normalMap = await await Texture.createTexture(engine.gl, './brickwall_normal.jpg') as Texture

    cube.setMaterial(material)

    engine.addGeo(cube)
    engine.setCamera(camera)
    engine.pipelineInit();
    engine.pipelineRender((e) => {

        theta = theta + 0.5

        // e.scene[0].scaleX(0.8)
        // e.scene[0].scaleY(0.8)
        // e.scene[0].scaleZ(0.8)
        e.scene[0].roateX(theta)
        e.scene[0].roateY(theta)


    })

}

engineRender();