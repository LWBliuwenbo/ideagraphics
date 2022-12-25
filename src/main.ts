import Engine from "./engine";
import { Camera } from "./engine/Camera";
import { Cube } from "./engine/Geometric";
import { Vec3 } from "./engine/math/Vector";

const engine = new Engine('engine-canvas')
const camera = new Camera();

const radius = 4.0;
var Cameratheta = 10 / 180 * Math.PI;
var phi = 0 / 180 * Math.PI;

camera.lookAt(
    new Vec3(0,1,4),
    new Vec3(0,0,0),
    new Vec3(0,1,0)
).persective(45, engine.canvas.width/engine.canvas.height, 0.3, 3);

let theta = 0.0;
let distance = 0.5


engine.addGeo(new Cube())
engine.setCamera(camera)
engine.pipelineInit();
engine.pipelineRender( (e)=> {
    theta = 0
    e.scene[0].tranlateZ(1)
    e.scene[0].scaleX(0.8)
    e.scene[0].scaleY(0.8)
    e.scene[0].scaleZ(0.8)


})
