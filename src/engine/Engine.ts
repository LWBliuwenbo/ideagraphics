import { Geometric } from "./Geometric"
import { Vec4,Vec3 } from "./math/Vector"
import fragString from '../shader/frag.glsl?raw'
import vertexString from '../shader/vertex.glsl?raw'
import {Shader} from "./Shader"
import { Camera } from "./Camera"
import { Light } from "./Light"


export default  class Engine {
    
    gl : WebGL2RenderingContext
    canvas : HTMLCanvasElement
    scene: Geometric[]
    camera: Camera
    light: Light
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
        this.light = new Light();
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
            buffer[0 + 4*i] = child.x
            buffer[1 + 4*i] = child.y
            buffer[2 + 4*i] = child.z
            buffer[3 + 4*i] = child.r
        })

        return buffer
    }

    flattenV3(vecs : Vec3[]) {
        const buffer =  new Float32Array(vecs.length * 3)
        vecs.forEach((child, i)=> {
            buffer[0 + 3*i] = child.x
            buffer[1 + 3*i] = child.y
            buffer[2 + 3*i] = child.z
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
    setLight(light: Light) {
        this.light = light;
    }

    pipelineSetShaderAttr(shader: Shader, geo: Geometric) {

        const {gl} = this;
        gl.useProgram(shader.program);


        const nBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flattenV3(geo.nomarls), gl.STATIC_DRAW)

        console.log( this.flattenV3(geo.nomarls))

        const nLoc = gl.getAttribLocation(shader.program, "aNormal");
        gl.vertexAttribPointer(nLoc, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(nLoc)

        // const cBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
        // gl.bufferData(gl.ARRAY_BUFFER, this.flatten(geo.colors), gl.STATIC_DRAW)

        // const cLoc = gl.getAttribLocation(shader.program, 'aColor')
        // gl.vertexAttribPointer( cLoc, 4, gl.FLOAT, false, 0, 0)
        // gl.enableVertexAttribArray(cLoc) 

        const vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flatten(geo.positions), gl.STATIC_DRAW)

        const pLoc = gl.getAttribLocation(shader.program, "aPosition");
        gl.vertexAttribPointer(pLoc, 4, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pLoc)


    }
    pipelineTransformShaderInit(geo: Geometric) {
        this.transformShader = new Shader(this.gl, 
            ['uTheta', 'uTranslate', 'uScale', 
             'uModelView', 'uProject',
             'uAmbientProduct', 'uDiffuseProduct', 'uSpecularProduct',
             'uLightPosition', 'uShininess','uViewPos'
        ], vertexString, fragString )
        this.pipelineSetShaderAttr(this.transformShader, geo) 
        this.transformShader.setUniformMat4fv('uModelView', this.camera.modelViewMatrix)
        this.transformShader.setUniformMat4fv('uProject', this.camera.projectionMatrix)
        this.transformShader.setUniform4fv('uAmbientProduct', this.light.lightAmbient.multV(geo.material.matrialAmbient) )
        this.transformShader.setUniform4fv('uDiffuseProduct', this.light.lightDiffuse.multV(geo.material.matrialDiffuse) )
        this.transformShader.setUniform4fv('uSpecularProduct', this.light.lightSpecular.multV(geo.material.matrialSpecular) )
        this.transformShader.setUniform4fv('uLightPosition', this.light.lightPosition)
        this.transformShader.setUniformf('uShininess', geo.material.materialShininess)
        this.transformShader.setUniform3fv('uViewPos', this.camera.viewPosition.flattrn())

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
