import { Camera } from "../Camera";
import { Model } from "../model/Model";
import { Shader } from "../Shader";
import { Mesh } from "./Mesh";
import CameraVertexShader from '../../shader/camera.vertex.glsl?raw'
import CameraFragShader from '../../shader/camera.frag.glsl?raw'


export class CameraView extends Mesh {
    
    modelurl = ''
    camera :Camera| null = null;
    model: Model | null = null;
    ready = false;
    shader: Shader;

    constructor(gl:WebGL2RenderingContext, camera: Camera, modelurl:string) {
        super(gl);
        this.camera = camera;
        this.modelurl = modelurl;
        this.shader = new Shader(gl, CameraVertexShader, CameraFragShader)
    }

    async init(){
        if(this.ready || this.camera == null){
            return
        }
        this.model = new Model(this.gl, this.modelurl);
        await this.model.loadOBJ(this.modelurl, 0.3)
        this.setTranslate(this.camera.viewPosition);
        this.ready = true;
    
    }



    draw(): void {
        if(this.ready == false){
            this.init();
        }

        if(this.model == null){
            return
        }

        this.shader.enable();
        const modelView = this.getModelTansformMatrix();
        this.shader.setUniformMat4fv('modelViewMatrix',modelView)
        this.model?.draw(this.shader);
    }
}