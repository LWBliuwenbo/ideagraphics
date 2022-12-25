import { Geometric } from "./Geometric"
import { Vec4 } from "./math/Vector"
import fragString from '../shader/frag.glsl?raw'
import vertexString from '../shader/vertex.glsl?raw'
import {Shader} from "./Shader"
import { Camera } from "./Camera"


export default  class Engine {
    
    gl : WebGL2RenderingContext
    canvas : HTMLCanvasElement
    scene: Geometric[]
    camera: Camera
    theta: number[] = [0,0,0]
    thetaLoc: WebGLUniformLocation | null
    shaders: Shader[]
    transformShader: Shader | null


    constructor(id: string) {
        const el = document.getElementById(id)

        if(el == null){
            throw new Error('画布不存在')
        }

        this.canvas = el as HTMLCanvasElement;

        const gl = this.canvas.getContext('webgl2')

        if(!gl){
            throw new Error('不支持webgl2')
        }
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
        gl.enable(gl.DEPTH_TEST);
        
        this.gl = gl;
        this.scene = []
        this.thetaLoc = null
        this.shaders = []
        this.transformShader = null
        this.camera = new Camera();
    }


    addGeo(geo: Geometric){
        this.scene.push(geo)
    }

    addShader( uniforms: string[], vertexShader?: string, fragmentShader?: string) {
        this.shaders.push( new Shader( this.gl, uniforms, vertexShader, fragmentShader))
    }

    flatten(vecs : Vec4[]) {
        const buffer =  new Float32Array(vecs.length * 4)
        vecs.forEach((child, i)=> {
            buffer[0 + 4*i] = child.out[0]
            buffer[1 + 4*i] = child.out[1]
            buffer[2 + 4*i] = child.out[2]
            buffer[3 + 4*i] = child.out[3]
        })

        return buffer
    }

    pipelineInit() {
        this.scene.forEach((geo)=> {
            this.pipelineTransformShaderInit(geo);
            this.shaders.forEach((shader)=> {
                this.pipelineSetShaderAttr(shader, geo)
            })
        })
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    pipelineSetShaderAttr(shader: Shader, geo: Geometric) {

        const {gl} = this;
        gl.useProgram(shader.program);

        const cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.flatten(geo.colors), gl.STATIC_DRAW)

        const cLoc = gl.getAttribLocation(shader.program, 'aColor')
        gl.vertexAttribPointer( cLoc, 4, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(cLoc) 

        const vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flatten(geo.positions), gl.STATIC_DRAW)

        const pLoc = gl.getAttribLocation(shader.program, "aPosition");
        gl.vertexAttribPointer(pLoc, 4, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pLoc)

    }
    pipelineTransformShaderInit(geo: Geometric) {
        this.transformShader = new Shader(this.gl, ['uTheta', 'uTranslate', 
            'uScale', 'uModelView', 'uProject'], vertexString, fragString )
        this.pipelineSetShaderAttr(this.transformShader, geo) 
        this.transformShader.setUniformMat4fv('uModelView', this.camera.modelViewMatrix)
        this.transformShader.setUniformMat4fv('uProject', this.camera.projectionMatrix)
    }
    pipelineTransformRender(geo: Geometric) {
        if(this.transformShader){
            this.transformShader.setUniform3fv('uTheta', geo.roateTheta)
            this.transformShader.setUniform3fv('uTranslate', geo.tranlate)
            this.transformShader.setUniform3fv('uScale', geo.scale)
        }
    }
    pipelineRender(callback?:(engine: Engine )=> void ) {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        callback && callback(this);

        this.scene.forEach((geo)=> {
            this.pipelineTransformRender(geo)
            this.gl.drawArrays(this.gl.TRIANGLES, 0 , 36)
        })

        
        requestAnimationFrame(this.pipelineRender.bind(this, callback));

    }
}
