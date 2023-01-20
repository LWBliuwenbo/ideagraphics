import { Transform } from "../Tansform";
import {PBRMaterial, Material} from '../Material'
import {Shader} from '../Shader'
export abstract class Mesh extends Transform {
    gl: WebGL2RenderingContext;
    material: Material;
    constructor(gl: WebGL2RenderingContext) {
        super();
        this.gl = gl;
        this.material = new PBRMaterial()
    }

    setMaterial(material: Material) {
        this.material = material;
    }
    abstract draw(shader: Shader):void;
}