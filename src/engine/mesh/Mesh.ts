import { Transform } from "../Tansform";
import { Mat4 } from "../math/Mat";
import {  Vec2, Vec3 } from "../math/Vector";
import {PBRMaterial, Material} from '../Material'
import {Shader} from '../Shader'
export abstract class Mesh extends Transform {
    gl: WebGL2RenderingContext;
    material: Material;
    hovercheck = false;
    constructor(gl: WebGL2RenderingContext) {
        super();
        this.gl = gl;
        this.material = new PBRMaterial()
    }

    setMaterial(material: Material) {
        this.material = material;
    }
    abstract draw(shader: Shader,hoverPoint?:Vec3, viewPosition?:Vec3,projectionMatrix?:Mat4,viewMatrix?: Mat4 ):void;
}