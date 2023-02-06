import { Mesh } from "../mesh/Mesh";
import { Shader } from "../Shader";
import { parseOBJ } from "./ParseObj";

const FLT_MAX = -1
// const MAX_VERTICES_PER_FACE = 255;

export class Model extends Mesh {
    loaded = false;
    madeVBO = false;
    id:string = ""

    vertexData: number[] = []
    normalData: number[] = []
    vertexBuffer: WebGLBuffer | null = null;
    normalBuffer: WebGLBuffer | null = null;
    vao: WebGLVertexArrayObject | null = null;
    numTriangles: number = 0;
    minX: number = 0
    maxX: number = 0
    minY: number = 0
    maxY: number = 0
    minZ: number = 0
    maxZ: number = 0

    constructor(gl: WebGL2RenderingContext, id:string) {
        super(gl);
        this.id = id;
    }



    async loadOBJ(modelUrl: string, scale?: number) {
        this.clear();
        await this.readObjFile(modelUrl)

        this.loaded = true;
        if (scale)
            this.unitizeVertices(this.vertexData, scale)

    }



    async readObjFile(modelUrl: string,) {
        return new Promise(async(resolve, reject)=> {

            try {
                const body = await fetch(modelUrl)
                const data = await body.blob();
                const filereader = new FileReader();
                filereader.onloadend = (e) => {
                    const obj = e.target?.result as string;
                    const { position, normal } = parseOBJ(obj);
                    
                    this.normalData = normal;
                    this.vertexData = position;

                    resolve(true);
                    
                }
                
                filereader.readAsText(data)
                
            } catch (error) {
                console.log(error)
                reject(false);
            }
        })
    }

    unitizeVertices(vertices: number[], scale: number) {
        const { maxX, minX, maxY, minY, maxZ, minZ } = this;
        // const scaleX = 2.0 / (maxX - minX);
        // const scaleY = 2.0 / (maxY - minY);
        // const scaleZ = 2.0 / (maxZ - minZ);
        const centerX = minX + (maxX - minX) * 0.5;
        const centerY = minY + (maxY - minY) * 0.5;
        const centerZ = minZ + (maxZ - minZ) * 0.5;

        // const scaleMin = Math.min(scaleX, Math.min(scaleY, scaleZ));

        const scaleMin = scale || 1;
        for (let i = 0; i < vertices.length / 3; i++) {
            vertices[3*i   ] = (vertices[3*i] - centerX) * scaleMin;
            vertices[3*i+1 ] = (vertices[3*i+1 ] - centerY) * scaleMin;
            vertices[3*i+ 2] = (vertices[3*i+ 2] - centerZ) * scaleMin;
        }
    }

    clear() {
        this.vertexData = [];
        this.normalData = []
        this.loaded = false;
        this.maxX = this.maxY = this.maxZ = -FLT_MAX;
        this.minX = this.minY = this.minZ = FLT_MAX;
        this.numTriangles = 0;

        if (this.madeVBO) {
            if (this.normalBuffer) {
                this.gl.deleteBuffer(this.normalBuffer)
                this.normalBuffer = null;
            }

            if (this.vertexBuffer) {
                this.gl.deleteBuffer(this.vertexBuffer)
                this.vertexBuffer = null
            }
        }

        this.madeVBO = false
    }




    createVBO() {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        this.normalBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normalData), this.gl.STATIC_DRAW)
    
        this.vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexData), this.gl.STATIC_DRAW)
        this.gl.bindVertexArray(null);
        
        this.madeVBO = true;
    
    }

    draw(shader:Shader) {

        if( !this.loaded ){
            return;

        }

    if( !this.madeVBO ){
        this.createVBO();
    }

    this.gl.bindVertexArray(this.vao);
    const vert_loc = this.gl.getAttribLocation(shader.program, 'vtx_position');
    if(vert_loc>=0){
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
        this.gl.vertexAttribPointer(vert_loc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vert_loc);
    }

    this.gl.bindVertexArray(this.vao);
    const normal_loc = this.gl.getAttribLocation(shader.program, 'vtx_normal');
    if(normal_loc>=0){
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.normalBuffer );
        this.gl.vertexAttribPointer(normal_loc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(normal_loc);
    }

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexData.length/3)


}

    



}