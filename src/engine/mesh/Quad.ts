import {  Vec2 } from "../math/Vector";
import { Shader } from "../Shader";
import {  flattenV2 } from "../untils";
import { Mesh } from "./Mesh";


export class Sphere extends Mesh {

    vao: WebGLVertexArrayObject|null = null;
    bufs: (WebGLBuffer|null)[] = []

    ready = false;

    indices: number[] = [];
    pos: Vec2[] = [];
    texCoords: Vec2[] = []

    constructor(gl: WebGL2RenderingContext,  x1:number,  y1: number, x2: number, y2: number, u1: number,  v1: number,  u2: number,  v2: number);
    constructor(gl: WebGL2RenderingContext,  x1:number,  y1: number, x2: number, y2: number);
    constructor(gl: WebGL2RenderingContext);

    

    constructor(gl: WebGL2RenderingContext,  x1?:number,  y1?: number, x2?: number, y2?: number, u1?: number,  v1?: number,  u2?: number,  v2?: number) {
        super(gl);

        if(x1 === undefined){
            this.QuadConstuctor(-1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0)
        }

        if(x1!== undefined && y1 !== undefined && x2!== undefined && y2 !== undefined){
            this.QuadConstuctor(x1, y1, x2, y2, 0.0, 0.0, 1.0, 1.0)
        }

        if(x1!== undefined && y1 !== undefined && x2!== undefined && y2 !== undefined 
            && u1 !== undefined && u2 !== undefined && v1 !== undefined && v2 !== undefined
        ){
            this.QuadConstuctor(x1, y1, x2, y2,u1,v1,u2,v2)
        }

      

    }


    QuadConstuctor(x1:number,  y1: number, x2: number, y2: number, u1: number,  v1: number,  u2: number,  v2: number) {
        this.setTexCoord(0, u1, v1)
        this.setPos(0, x1, y1)

        this.setTexCoord(1, u2, v1)
        this.setPos(1, x2, y1)

        this.setTexCoord(2, u2, v2)
        this.setPos(2, x2, y2)

        this.setTexCoord(3, u1, v2)
        this.setPos(3, x1, y2)

        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 3;

        this.indices[3] = 1;
        this.indices[4] = 2;
        this.indices[5] = 3;


    }

    setTexCoord(id: number, x: number, y: number) {
         this.texCoords[id] = new Vec2(x, y)
    }

    setPos(id: number, x: number, y: number) {
        this.pos[id] = new Vec2(x, y)
    }

    init() {
        this.vao = this.gl.createVertexArray();
        if(this.vao){
            this.gl.bindVertexArray(this.vao);
        }

        this.bufs[0] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufs[0])
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), this.gl.STATIC_DRAW)

        this.bufs[1] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[1])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flattenV2(this.pos), this.gl.STATIC_DRAW)


        this.bufs[5] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[5])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flattenV2(this.texCoords), this.gl.STATIC_DRAW)

        this.ready = true;
    }



    draw(shader: Shader): void {
        if(!this.ready){
            this.init()
        }

        this.gl.bindVertexArray(this.vao)
        
        let vertex_loc = shader.getAttribLocation("vtx_position");
        if(vertex_loc>=0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[1]);
            this.gl.vertexAttribPointer(vertex_loc, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(vertex_loc);
        }

    
        let texCoord_loc = shader.getAttribLocation("vtx_texCoord");
        if(texCoord_loc>=0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[5]);
            this.gl.vertexAttribPointer(texCoord_loc, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(texCoord_loc);
        }
    
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length,  this.gl.UNSIGNED_INT, 0);
    


    }


}