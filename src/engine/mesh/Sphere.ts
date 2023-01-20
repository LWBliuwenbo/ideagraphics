import { Vec3, Vec2 } from "../math/Vector";
import { Shader } from "../Shader";
import { flatten, flattenV2 } from "../untils";
import { Mesh } from "./Mesh";


export class Sphere extends Mesh {

    vao: WebGLVertexArrayObject|null = null;
    bufs: (WebGLBuffer|null)[] = []

    ready = false;

    indices: number[] = [];
    vertices: Vec3[] = [];
    colors: Vec3[] = [];
    normals: Vec3[] = [];
    tangents: Vec3[] = [];
    texCoords: Vec2[] = []

    radius:number = 0.5;
    nU:number = 100;
    nV:number = 100;



    

    constructor(gl: WebGL2RenderingContext, radius: number, nU: number, nV: number) {
        super(gl);

        this.radius = radius;
        this.nU = nU;
        this.nV = nV;
        const PI = 3.14159265358979323846;
        const PI_2 =  1.57079632679489661923
        // const n_vertices = (nU + 1) * (nV + 1);
        // const n_triangles = nU * nV * 2

        for( let v=0;v<=nV;++v)
        {
            for( let u=0;u<=nU;++u)
            {
    
                 let theta = u /  nU * PI;
                 let phi  = v /  nV * PI * 2;
    
                 let index 	= u +(nU+1)*v;
    
                let  vertex:Vec3= new Vec3(), tangent:Vec3= new Vec3(), normal:Vec3 = new Vec3();
                let texCoord: Vec2 = new Vec2();
    
                // normal
                normal.x = Math.sin(theta) * Math.cos(phi);
                normal.y = Math.sin(theta) * Math.sin(phi);
                normal.z = Math.cos(theta);
                normal = normal.normalize();
    
                // position
                vertex = normal.mult(this.radius);
    
                // tangent
                theta += PI_2;
                tangent.x = Math.sin(theta) * Math.cos(phi);
                tangent.y = Math.sin(theta) * Math.sin(phi);
                tangent.z = Math.cos(theta);
                tangent = tangent.normalize();
    
                // texture coordinates
                texCoord.x = u / nU;
                texCoord.y = v /  nV;
    
                this.vertices[index] = vertex;
                this.normals[index] = normal;
                this.tangents[index] = tangent;
                this.texCoords [index] = texCoord;
                this.colors[index] = new  Vec3(0.6,0.2,0.8);
            }
        }

        let index: number = 0;
        for(let v=0;v<nV;++v)
        {
            for(let u=0;u<nU;++u)
            {
                let vindex 	= u + (nU+1)*v;
    
                this.indices[index+0] = vindex;
                this.indices[index+1] = vindex+1 ;
                this.indices[index+2] = vindex+1 + (nU+1);
    
                this.indices[index+3] = vindex;
                this.indices[index+4] = vindex+1 + (nU+1);
                this.indices[index+5] = vindex   + (nU+1);
    
                index += 6;
            }
        }
        

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
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW)

        this.bufs[2] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[2])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.colors), this.gl.STATIC_DRAW)


        this.bufs[3] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[3])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.normals), this.gl.STATIC_DRAW)


        this.bufs[4] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[4])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.tangents), this.gl.STATIC_DRAW)


        this.bufs[5] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[5])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flattenV2(this.texCoords), this.gl.STATIC_DRAW)

        this.ready = true;
    }

    getRadius() {
        return this.radius
    }

    getLats() { 
        return this.nU
    }

    getLongs() {
        return this.nV
    }


    draw(shader: Shader): void {
        if(!this.ready){
            this.init()
        }

        this.gl.bindVertexArray(this.vao)
        
        let vertex_loc = shader.getAttribLocation("vtx_position");
        if(vertex_loc>=0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[1]);
            this.gl.vertexAttribPointer(vertex_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(vertex_loc);
        }
    
        let color_loc = shader.getAttribLocation("vtx_color");
        if(color_loc>=0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[2]);
            this.gl.vertexAttribPointer(color_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(color_loc);
        }
    
        let normal_loc = shader.getAttribLocation("vtx_normal");
        if(normal_loc>=0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[3]);
            this.gl.vertexAttribPointer(normal_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(normal_loc);
        }
    
        let tangent_loc = shader.getAttribLocation("vtx_tangent");
        if(tangent_loc>=0){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[4]);
            this.gl.vertexAttribPointer(tangent_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(tangent_loc);
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