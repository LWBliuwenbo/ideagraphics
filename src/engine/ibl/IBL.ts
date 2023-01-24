import quadShaderVertexString from '../shader/Quad.vertex.glsl?raw'
import { Shader } from "../Shader";
import IBLFragShader from '../../shader/ibl.frag.glsl?raw'
import IBLVertexShader from '../../shader/ibl.vertex.glsl?raw'
import { Mat4 } from "../math/Mat";
import { Texture } from "../Texture";
import { Vec2 } from '../math/Vector';
import { luminance } from '../untils';
import { Sphere } from '../mesh/Sphere';
import { Mesh } from '../mesh/Mesh';

export const RENDER_NO_IBL = 0
export const RENDER_REGULAR_SAMPLING = 1
export const RENDER_IBL_IS = 2
export const RENDER_BRDF_IS = 3
export const RENDER_MIS =  4
export class IBL {

    gl: WebGL2RenderingContext
    renderWithIBL = false

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

    model: Mesh
    // resultShader :Shader
    // compShader: 
    
    IBLShader:Shader;


    constructor(gl: WebGL2RenderingContext, CubeTexture: Texture) {
        this.gl  = gl;
        this.IBLShader = new Shader(this.gl, IBLVertexShader, IBLFragShader)
        this.envTex = CubeTexture;
        const {probTexImageData, marginalProbTexImageData } = this.computeEnvMapSamplingData();
        this.probTex = Texture.createTextureWithImageData(this.gl, probTexImageData)
        this.marginalProbTex = Texture.createTextureWithImageData(this.gl, marginalProbTexImageData)
        // this.resultShader = new Shader(this.gl, quadShaderVertexString)
        // this.compShader = new Shader(this.gl, quadShaderVertexString)
        this.model = new Sphere(this.gl, 0.3, 64, 64)

    }

    createFBO() {
        const width = this.gl.canvas.width;
        const height = this.gl.canvas.height;

        this.mSize = width < height ? width: height;



    }






    drawObject() {

        this.model.draw(this.IBLShader);

        this.IBLShader.setUniformTexture( "envCube", this.envTex, 0 );

        this.IBLShader.setUniformTexture( "probTex", this.probTex, 1 );
        this.gl.texParameterf( this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
        this.gl.texParameterf( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );
        this.IBLShader.setUniformTexture( "marginalProbTex", this.marginalProbTex, 2 );
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
            const pdfSum = this.calculateProbs( conditionalPdf, probTexImageData, row, this.envTex.w() );
    
            // save the integral of the PDF for this row in the marginal image
            marginalPdf[row] = pdfSum;
        }
    
        // compute the CDF and inverse CDF for the marginal image
        this.calculateProbs(marginalPdf, marginalProbTexImageData, 0, this.envTex.h() );

        return {probTexImageData, marginalProbTexImageData }
    }

    createGLSamplingTextures() {

    }

    calculateProbs(pdf: number[], imagedata: ImageData,row : number, numElements: number) {
        const  cdf :number[] = [];
        const baseIndex = row * numElements;

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

    draw() {
        this.envRotMatrix = Mat4.getRoateY(this.envPhi).mult(Mat4.getRoateY(this.envTheta));
    
        this.envRotMatrixInverse = this.envRotMatrix.inverse();

        this.drawObject();

    }
}