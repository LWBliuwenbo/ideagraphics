import quadShaderVertexShader from '../../shader/Quad.vertex.glsl?raw'
import IBLCompFragShader from '../../shader/IBLComp.frag.glsl?raw'
import IBLResultFragShader from '../../shader/IBLResult.frag.glsl?raw'

import { Shader } from "../Shader";
import IBLFragShader from '../../shader/ibl.frag.glsl?raw'
import IBLVertexShader from '../../shader/ibl.vertex.glsl?raw'
import { Mat4 } from "../math/Mat";
import { Texture } from "../Texture";
import { Vec2 } from '../math/Vector';
import { luminance } from '../untils';
import { Sphere } from '../mesh/Sphere';
import { Mesh } from '../mesh/Mesh';
import { PBRMaterial } from '../Material';
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
export class IBL {

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
    probTex: Texture
    marginalProbTex : Texture
    envTex:Texture
    envRotMatrix:Mat4 = new Mat4([])
    envRotMatrixInverse:Mat4 = new Mat4([])
    sampleGroupOrder :number [] = []
    numSampleGroupsRendered = 0
    iblRenderingMode = RENDER_IBL_IS

    timer : number|null = null;
    keepAddingSamples = true;

    model: Model
    quad: Quad
    // resultShader :Shader
    // compShader: 
    
    IBLShader:Shader;
    comShader: Shader;
    resultShader: Shader

    light: Light

    comp : FBO | null = null;
    fbo : FBO | null = null;


    constructor(gl: WebGL2RenderingContext, CubeTexture: Texture, model:Model, light: Light) {
        this.gl  = gl;


        const imagecanvas = document.getElementById('hide-canvas') as HTMLCanvasElement;
        const imagecanvasContex =  imagecanvas.getContext('2d') as CanvasRenderingContext2D 

        this.randomizeSampleGroupOrder();
        this.IBLShader = new Shader(this.gl, IBLVertexShader, IBLFragShader)
        this.comShader = new Shader(this.gl, quadShaderVertexShader, IBLCompFragShader)
        this.resultShader = new Shader(this.gl, quadShaderVertexShader, IBLResultFragShader)

        this.envTex = CubeTexture;
        const {probTexImageData, marginalProbTexImageData } = this.computeEnvMapSamplingData();
        this.probTex = Texture.createTextureWithImageData(this.gl, probTexImageData)
        this.marginalProbTex = Texture.createTextureWithImageData(this.gl, marginalProbTexImageData)

        //debug
        imagecanvasContex.putImageData(probTexImageData,0,0)


        // this.resultShader = new Shader(this.gl, quadShaderVertexString)
        // this.compShader = new Shader(this.gl, quadShaderVertexString)
        this.model = model
        this.model.setMaterial(new PBRMaterial())
        this.quad = new Quad(this.gl)

        this.envRotMatrix = Mat4.getRoateY(this.envPhi).mult(Mat4.getRoateY(this.envTheta));
    
        this.envRotMatrixInverse = this.envRotMatrix.inverse();

        this.light = light;

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
        this.fbo.addColorBuffer(0, this.gl.RGBA32F)
        this.fbo.addDepthBuffer();
        this.fbo.checkStatus();

        this.comp = new FBO(this.gl, this.mSize, this.mSize, "Comp")
        this.comp.addColorBuffer(0, this.gl.RGBA32F)
        this.comp.checkStatus();

        this.gl.disable(this.gl.BLEND)

        this.resetComps();

        return true;
    }






    drawObject() {

        this.IBLShader.enable();

        this.gl.enable( this.gl.DEPTH_TEST );


        this.IBLShader.setUniformTexture( "envCube",0 , this.envTex, );

        this.IBLShader.setUniformTexture( "probTex", 1, this.probTex );
        this.gl.texParameterf( this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
        this.gl.texParameterf( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );
        this.IBLShader.setUniformTexture( "marginalProbTex",2 , this.marginalProbTex);
        this.gl.texParameterf( this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
        this.gl.texParameterf( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );
        this.IBLShader.setUniform2fv ( "texDims", new Vec2( this.envTex.w(), this.envTex.h()) );

        this.IBLShader.setUniformMat4fv( "envRotMatrix", this.envRotMatrix);
        this.IBLShader.setUniformMat4fv( "envRotMatrixInverse", this.envRotMatrixInverse );

        this.IBLShader.setUniformi( "totalSamples", this.totalSamples );
        this.IBLShader.setUniformi( "stepSize", this.stepSize );
        this.IBLShader.setUniformi( "passNumber", this.sampleGroupOrder[this.numSampleGroupsRendered] );

        this.IBLShader.setUniformf( "renderWithIBL", (this.renderWithIBL) ? 1.0 : 0.0 );
        this.IBLShader.setUniformf( "useIBLImportance", this.iblRenderingMode == RENDER_IBL_IS ? 1.0 : 0.0 );
        this.IBLShader.setUniformf( "useBRDFImportance",this.iblRenderingMode == RENDER_BRDF_IS ? 1.0 : 0.0 );
        this.IBLShader.setUniformf( "useMIS", (this.iblRenderingMode == RENDER_MIS) ? 1.0 : 0.0 );


        this.model.material.draw(this.IBLShader);
        this.model.draw(this.IBLShader);
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
    randomizeSampleGroupOrder()
    {
        this.sampleGroupOrder = [];
    
        // start with everything in-order
        for( let i = 0; i < this.stepSize; i++ )
            this.sampleGroupOrder[i] = i;
    
        // now swap random elements a bunch of times to shuffle the pass order
        for( let i = 0; i < this.stepSize*100; i++ )
        {
            let a = Math.floor(Math.random() * 100) % this.stepSize;
            let b =  Math.floor(Math.random() * 100) % this.stepSize;
            let temp = this.sampleGroupOrder[a];
            this.sampleGroupOrder[a] = this.sampleGroupOrder[b];
            this.sampleGroupOrder[b] = temp;
        }
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



    computeEnvMapSamplingData() {

        const w = this.envTex.w();
        const h = this.envTex.h();

        const probTexImageData = new ImageData(w, h)

        const marginalProbTexImageData = new ImageData( h, 1 );
        
        const marginalPdf:number[] = [];
        const conditionalPdf: number[] = [];
    
        // loop through each of the rows in the image

    
        for( let row = 0; row < h; row++ )
        {
            let y = (row + 0.5)/h * 2 - 1, ysquared = y*y;
    
            // loop through the pixels of this row, computing and storing a probability for each pixel
            for( let col = 0; col < w; col++ )
            {
                // compute the PDF value for this pixel
                // (compensate for cubemap distortion - see pbrt v2 pg 947)
                let x = ((col % h) + 0.5)/h * 2 - 1, xsquared = x*x;
                let undistort = Math.pow(xsquared + ysquared + 1, -1.5);

                const r = this.envTex.image?.data[col*row - 1] || 0
                const g = this.envTex.image?.data[col*row] || 0
                const b = this.envTex.image?.data[col*row + 1] || 0
                const a = this.envTex.image?.data[col*row + 2] || 0


                conditionalPdf[col] = luminance([r,g,b,a]) * undistort;
            }
    
            // compute the CDF and inverse CDF for this row
            const pdfSum = this.calculateProbs( conditionalPdf, probTexImageData, row*this.envTex.w(), this.envTex.w() );
    
            // save the integral of the PDF for this row in the marginal image
            marginalPdf[row] = pdfSum;
        }
    
        // compute the CDF and inverse CDF for the marginal image
        this.calculateProbs(marginalPdf, marginalProbTexImageData, 0, this.envTex.h() );

        return {probTexImageData, marginalProbTexImageData }
    }

    createGLSamplingTextures() {

    }

    calculateProbs(pdf: number[], imagedata: ImageData,baseIndex : number, numElements: number) {
        const  cdf :number[] = [];

        // sum PDF
        let pdfSum = 0;
        for( let i = 0; i < numElements; i++ )
            pdfSum += pdf[i];
    
        if (pdfSum <= 0) {
            // degenerate - no probability to reach this area
            // make uniform CDF
            let cdfScale = 1.0/numElements;
            for( let i = 0; i < numElements; i++ ) {
                cdf[i] = (i+1) * cdfScale;
            }
        }
        else {
            // compute the CDF based on normalized pdf
            let  cdfTotal = 0.0;
            let  cdfScale = 1/pdfSum;
            for( let i = 0; i < numElements; i++ ) {
                cdfTotal += pdf[i] * cdfScale;
                cdf[i] = cdfTotal;
            }
        }
    
        // compute the inverse CDF
        // (center samples between 0..1 range with implied (0,0) and (1,1) points)
        let yi = 0;
        let  oneOverNumElements = 1.0 / numElements;
        for( let xi = 0; xi < numElements; xi++ )
        {
            // find segment spanning target x value
            let  x = (xi+.5) * oneOverNumElements;
            while( cdf[yi] < x && yi < numElements-1)
                yi++;
    
            // interpolate segment to get corresponding y value
            let  xa = yi > 0 ? cdf[yi-1] : 0;
            let  ya = yi * oneOverNumElements;
            let  xb = cdf[yi];
            let  yb = (yi+1) * oneOverNumElements;
            imagedata.data[baseIndex +  xi] = (ya + (yb-ya)/(xb-xa) * (x-xa));
        }
    
        return pdfSum;
    }

    updateRender() {
        if(this.keepAddingSamples){
            this.draw();
        }
    }

    stratTimer() {
        if(!this.timer){
            this.timer = setInterval(this.updateRender.bind(this), 50)
        }
    }

    stopTimer() {
        if(this.timer != null){
            clearInterval(this.timer)
            this.timer = null
        }
    }

    draw() {

        this.gl.clearColor( 0, 0, 0, 0 );
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        
        this.recreateFBO();

        if(this.numSampleGroupsRendered < this.stepSize){
            this.fbo?.bind();
            this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
            this.drawObject();
            this.fbo?.unbind();    

            this.compResult();

            this.numSampleGroupsRendered++


            if(this.renderWithIBL){
                if(this.numSampleGroupsRendered < this.stepSize){
                    this.stratTimer();
                }else {
                    this.stopTimer();
                }
            }

        }

        this.drawResult();

    }
}