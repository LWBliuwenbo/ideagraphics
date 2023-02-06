import quadShaderVertexShader from '../../shader/Quad.vertex.glsl?raw'
import IBLCompFragShader from '../../shader/IBLComp.frag.glsl?raw'
import IBLResultFragShader from '../../shader/IBLResult.frag.glsl?raw'

import { Shader } from "../Shader";
import { Mat4 } from "../math/Mat";
import { Texture } from "../Texture";
import { Vec2 } from '../math/Vector';
import { FBO } from '../FBO';
import {Quad} from '../mesh/Quad'
import { Light } from '../Light';
import { Camera } from '../Camera';
import { Model } from '../model/Model';

export const RENDER_NO_IBL = 0
export const RENDER_REGULAR_SAMPLING = 1
export const RENDER_IBL_IS = 2
export const RENDER_BRDF_IS = 3
export const RENDER_MIS =  4
 
export class Env {

    gl: WebGL2RenderingContext
    renderWithIBL = true

    envPhi = 0.0;
    envTheta = 0.0;

    stepSize = 271;
    totalSamples = this.stepSize*15;
    faceWidth = 128;
    faceHeight = 128;
    numColumns = this.faceWidth * 6;
    numRows = this.faceHeight;

    mSize = 0
    // probTex: Texture
    // marginalProbTex : Texture
    envTex:Texture
    envRotMatrix:Mat4 = new Mat4([])
    envRotMatrixInverse:Mat4 = new Mat4([])
    sampleGroupOrder :number [] = []
    numSampleGroupsRendered = 0
    iblRenderingMode = RENDER_IBL_IS

    timer : number|null = null;
    keepAddingSamples = true;

    models: Model[]
    quad: Quad
    // resultShader :Shader
    // compShader: 
    comShader: Shader;
    resultShader: Shader

    light: Light

    comp : FBO | null = null;
    fbo : FBO | null = null;


    constructor(gl: WebGL2RenderingContext, CubeTexture: Texture, models:Model[], light: Light) {
        this.gl  = gl;

        this.comShader = new Shader(this.gl, quadShaderVertexShader, IBLCompFragShader)
        this.resultShader = new Shader(this.gl, quadShaderVertexShader, IBLResultFragShader)

        this.envTex = CubeTexture;
        // const {probTexImageData, marginalProbTexImageData } = this.computeEnvMapSamplingData();
        // this.probTex = Texture.createTextureWithImageData(this.gl, probTexImageData)
        // this.marginalProbTex = Texture.createTextureWithImageData(this.gl, marginalProbTexImageData)

        //debug
        // imagecanvasContex.putImageData(probTexImageData,0,0)


        // this.resultShader = new Shader(this.gl, quadShaderVertexString)
        // this.compShader = new Shader(this.gl, quadShaderVertexString)
        this.models = models

        this.quad = new Quad(this.gl)
        
        this.lookAtEnv();

        this.light = light;

    }
    lookAtEnv() {
        this.envRotMatrix = Mat4.getRoateY(this.envPhi).mult(Mat4.getRoateY(this.envTheta));
        this.envRotMatrixInverse = this.envRotMatrix.inverse();
    }
    resetComps() {
        this.numSampleGroupsRendered = 0;
        if(this.comp){
            this.comp.bind();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
            this.comp.unbind();
        }

    //    this.draw();
    }

    recreateFBO() {
        const width = this.gl.canvas.width;
        const height = this.gl.canvas.height;

        this.mSize = width < height ? width: height;


        if(this.fbo && this.fbo.width === this.mSize) {
            return
        }

        this.quad = new Quad(this.gl,0.0, 0.0, this.mSize, this.mSize, 0.0, 0.0, 1.0, 1.0 )

        this.fbo = new FBO(this.gl, this.mSize, this.mSize, "FBO")
        this.fbo.addColorBuffer(0)
        this.fbo.addDepthBuffer();
        this.fbo.checkStatus();

        this.comp = new FBO(this.gl, this.mSize, this.mSize, "Comp")
        this.comp.addColorBuffer(0)
        this.comp.checkStatus();

        this.gl.disable(this.gl.BLEND)

        this.resetComps();

        return true;
    }






    drawObject(modelShader:Shader) {

        modelShader.enable();

        this.gl.enable( this.gl.DEPTH_TEST );


        modelShader.setUniformTexture( "envCube",0 , this.envTex, );

        //modelShader.setUniformTexture( "probTex", 1, this.probTex );
        // this.gl.texParameterf( this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
        // this.gl.texParameterf( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );
        //modelShader.setUniformTexture( "marginalProbTex",2 , this.marginalProbTex);
        // this.gl.texParameterf( this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
        // this.gl.texParameterf( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );
       modelShader.setUniform2fv ( "texDims", new Vec2( this.envTex.w(), this.envTex.h()) );

       modelShader.setUniformMat4fv( "envRotMatrix", this.envRotMatrix);
       modelShader.setUniformMat4fv( "envRotMatrixInverse", this.envRotMatrixInverse );

       modelShader.setUniformi( "totalSamples", this.totalSamples );
       modelShader.setUniformi( "stepSize", this.stepSize );
       modelShader.setUniformi( "passNumber", this.sampleGroupOrder[this.numSampleGroupsRendered] );

       modelShader.setUniformf( "renderWithIBL", (this.renderWithIBL) ? 1.0 : 0.0 );
       modelShader.setUniformf( "useIBLImportance", this.iblRenderingMode == RENDER_IBL_IS ? 1.0 : 0.0 );
       modelShader.setUniformf( "useBRDFImportance",this.iblRenderingMode == RENDER_BRDF_IS ? 1.0 : 0.0 );
       modelShader.setUniformf( "useMIS", (this.iblRenderingMode == RENDER_MIS) ? 1.0 : 0.0 );


        this.models.forEach((child)=>{
            child.material.draw(modelShader);
            child.draw(modelShader);
        })
    }
    compResult() {
        this.comp?.bind();
        if(this.numSampleGroupsRendered){
            this.gl.enable(this.gl.BLEND)
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE)
        }else {
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT| this.gl.COLOR_BUFFER_BIT)
        }
        const camera = new Camera();

        camera.ortho(0, this.mSize, 0, this.mSize)

        this.comShader.enable()
        
        this.comShader.setUniformMat4fv("projectionMatrix", camera.projectionMatrix)
        this.comShader.setUniformMat4fv("modelViewMatrix", new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]))
        if(this.fbo?.colorAttachments[0].buffer){
            this.comShader.setUniformTexture("resultTex",0, undefined, this.fbo?.colorAttachments[0].buffer )
        }

        this.quad.draw(this.comShader);

        this.comShader.disable();

        this.gl.disable(this.gl.BLEND)

        this.comp?.unbind()

    }

    drawResult() {
        // this.gl.enable(this.gl.TEXTURE_CUBE_MAP)
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.disable(this.gl.DEPTH_TEST)
        const width = this.gl.canvas.width;
        const height = this.gl.canvas.height;
        this.gl.viewport((width - this.mSize)/2, (height - this.mSize)/ 2, this.mSize, this.mSize)
        
        const camera = new Camera();

        camera.ortho(0, this.mSize, 0, this.mSize)

        this.resultShader.enable()
        
        this.resultShader.setUniformMat4fv("projectionMatrix", camera.projectionMatrix)
        this.resultShader.setUniformMat4fv("modelViewMatrix", new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]))
        if(this.comp?.colorAttachments[0].buffer){
            this.resultShader.setUniformTexture("resultTex",0, undefined, this.comp?.colorAttachments[0].buffer )
        }

        this.resultShader.setUniformTexture( "envCube",1, this.envTex);

        this.resultShader.setUniformf( "gamma", this.light.gamma );
        this.resultShader.setUniformf( "exposure", this.light.exposure );
        this.resultShader.setUniformf( "aspect", 1 );
        this.resultShader.setUniformf( "renderWithIBL", this.renderWithIBL ? 1.0 : 0.0 );
        this.resultShader.setUniformMat4fv( "envRotMatrix", this.envRotMatrix );

        // this.resultShader.setUniformTexture( "probTex",2, this.probTex);
        // this.gl.texParameterf( GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST );
        // this.gl.texParameterf( GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST );
        // this.resultShader.setUniformTexture( "marginalProbTex",3, this.marginalProbTex );
        // this.gl.texParameterf( GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST );
        // this.gl.texParameterf( GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST );

        this.quad.draw(this.resultShader);
        this.resultShader.disable();

    }

    draw(modelShader:Shader) {

        this.gl.clearColor( 0, 0, 0, 0 );
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.recreateFBO();
        this.fbo?.bind();
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.drawObject(modelShader);
        this.fbo?.unbind();    
        this.compResult();
        this.drawResult();

    }
}