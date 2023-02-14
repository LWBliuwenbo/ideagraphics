import { Mat3, Mat4 } from "../math/Mat";
import { Vec2, Vec3 } from "../math/Vector";
import { Shader } from "../Shader";
import { flatten, flattenV2, flattenV4 } from "../untils";
import { Mesh } from "./Mesh";


export class CubeQuad {


    indices: number[] = [];
    pos: Vec3[] = [];
    normals: Vec3[] = [];
    colors: Vec3[] = [];
    texCoords: Vec2[] = []
    quad_num = 0;




    constructor(quadnum: number, v1: Vec3, v2: Vec3, v3: Vec3, v4: Vec3, v5: Vec3, v6: Vec3, isfront: boolean,) {
        this.quad_num = quadnum;
        this.QuadConstuctor(v1, v2, v3, v4, v5,v6, isfront)

    }


    QuadConstuctor(v1: Vec3, v2: Vec3, v3: Vec3, v4: Vec3,v5: Vec3, v6: Vec3, isfront: boolean) {
        this.pos.push(v1, v2, v3, v4, v5, v6)
        const edge1 = v1.sub(v2);
        const edge2 = v1.sub(v3)
        const normal = edge2.cross(edge1).normalize()
        const quadNormal = isfront ? normal : normal.burden();
        this.normals.push(quadNormal, quadNormal, quadNormal, quadNormal,quadNormal,quadNormal)


        this.reSetColor();
    }
    reSetColor(color?: Vec3) {
        const quadColor = color || new Vec3(0, 0, 0)

        this.colors = [quadColor, quadColor, quadColor, quadColor,quadColor,quadColor]

        return this.colors;
    }
    checkHover(hoverPoint: Vec3, viewPosition: Vec3, projectionMatrix: Mat4, viewMatrix: Mat4, modelMatrix: Mat4) {

        const positions = this.pos.map(child=> Mat4.multVe3(child, modelMatrix))
        const normal =  positions[2].sub(positions[0]).cross(positions[1].sub(positions[0]));
        const hoverPointStart = new Vec3(hoverPoint.x, hoverPoint.y, viewPosition.z);

        const viewHoverDir = Mat4.multVe3(hoverPointStart, projectionMatrix.inverse())
             
            

        const u = viewHoverDir.normalize();
        if (u.dot(normal) == 0) {
            return false
        }
        const d = positions[0].dot(normal);
        const t = (d - hoverPointStart.dot(normal)) / u.dot(normal);
        const pointAtQuad = hoverPointStart.add(u.mult(t));

        if (this.checkIsInQuad(pointAtQuad, positions)) {
            return true
        }

        return false
    }
    SameSide(A: Vec3, B: Vec3, C: Vec3, P: Vec3) {
        const AB = B.sub(A);
        const AC = C.sub(A);
        const AP = P.sub(A);

        const v1 = AB.cross(AC);
        const v2 = AB.cross(AP);

        // v1 and v2 should point to the same direction

        return v1.dot(v2) >= 0;
    }

    PointinTriangle1(A: Vec3, B: Vec3, C: Vec3, P: Vec3) {
        return this.SameSide(A, B, C, P) &&
            this.SameSide(B, C, A, P) &&
            this.SameSide(C, A, B, P);
    }

    checkIsInQuad(pointAtQuad: Vec3, positions: Vec3[]) {

        return this.PointinTriangle1(positions[0], positions[1], positions[2], pointAtQuad) ||
            this.PointinTriangle1(positions[3], positions[4], positions[5], pointAtQuad)
    }




}

export class Cube extends Mesh {

    vao: WebGLVertexArrayObject | null = null;
    bufs: (WebGLBuffer | null)[] = []

    indices: number[] = [];
    pos: Vec3[] = [];
    normals: Vec3[] = [];
    colors: Vec3[] = [];
    texCoords: Vec2[] = []
    quad_num = 0;

    quads: CubeQuad[] = []
    ready: boolean = false;

    hovercheck = true;
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.CubeInit()
        this.quadInit()
    }

    quadInit() {
        if (this.quads.length !== 0) {
            this.quads.forEach((child) => {
      
                    
                    this.pos = this.pos.concat(child.pos)
                    this.normals = this.normals.concat(child.normals)
                    this.colors = this.colors.concat(child.colors)
                
            })
        }
    }
    CubeInit() {
        this.quads.push(new CubeQuad(
            0,
            new Vec3(-0.5, -0.5, -0.5),
            new Vec3(0.5, -0.5, -0.5),
            new Vec3(0.5, 0.5, -0.5),
            new Vec3(0.5, 0.5, -0.5),
            new Vec3(-0.5, 0.5, -0.5),
            new Vec3(-0.5, -0.5, -0.5),
            true,
        ))

        this.quads.push(new CubeQuad(
            1,
            new Vec3(-0.5, -0.5, 0.5),
            new Vec3(0.5, -0.5, 0.5),
            new Vec3(0.5, 0.5, 0.5),
            new Vec3(0.5, 0.5, 0.5),
            new Vec3(-0.5, 0.5, 0.5),
            new Vec3(-0.5, -0.5, 0.5),

            false
        ))


        this.quads.push(new CubeQuad(
            2,
            new Vec3(-0.5, 0.5, 0.5),
            new Vec3(-0.5, 0.5, -0.5),
            new Vec3(-0.5, -0.5, -0.5),
            new Vec3(-0.5, -0.5, -0.5),
            new Vec3(-0.5, -0.5, 0.5),
            new Vec3(-0.5, 0.5, 0.5),

            false,
        ))

        this.quads.push(new CubeQuad(
            3,
            new Vec3(0.5, 0.5, 0.5),
            new Vec3(0.5, 0.5, -0.5),
            new Vec3(0.5, -0.5, -0.5),
            new Vec3(0.5, -0.5, -0.5),
            new Vec3(0.5, -0.5, 0.5),
            new Vec3(0.5, 0.5, 0.5),

            true
        ))

        this.quads.push(new CubeQuad(
            4,
            new Vec3(-0.5, -0.5, -0.5),
            new Vec3(0.5, -0.5, -0.5),
            new Vec3(0.5, -0.5, 0.5),
            new Vec3(0.5, -0.5, 0.5),
            new Vec3(-0.5, -0.5, 0.5),
            new Vec3(-0.5, -0.5, -0.5),

            false
        ))

        this.quads.push(new CubeQuad(
            5,
            new Vec3(-0.5, 0.5, -0.5),
            new Vec3(0.5, 0.5, -0.5),
            new Vec3(0.5, 0.5, 0.5),
            new Vec3(0.5, 0.5, 0.5),
            new Vec3(-0.5, 0.5, 0.5),
            new Vec3(-0.5, 0.5, -0.5),
            true
        ))
    }
    init() {
        if (this.vao) {
            this.gl.bindVertexArray(this.vao);
        } else {
            this.vao = this.gl.createVertexArray();
            this.gl.bindVertexArray(this.vao);
        }


        this.bufs[1] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[1])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.pos), this.gl.STATIC_DRAW)

        this.bufs[2] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[2])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.normals), this.gl.STATIC_DRAW)

        this.bufs[3] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[3])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.colors), this.gl.STATIC_DRAW)

        this.ready = true;
    }
    reColor(quad: CubeQuad, color?: Vec3) {
        this.colors = [];
        this.pos = [];
        this.normals= [];
      
        quad.reSetColor(color);
        this.quadInit()
        this.init();
    }
    draw(shader: Shader, hoverPoint?: Vec3, viewPosition?: Vec3, projectionMatrix?: Mat4, viewMatrix?: Mat4): void {
        const modelMatrix = this.getModelTansformMatrix()
        shader.setUniformMat4fv("modelMatrix", modelMatrix)

        if (hoverPoint && viewPosition && projectionMatrix && viewMatrix) {
            this.quads.forEach(child => {
                const isHover = child.checkHover(hoverPoint, viewPosition, projectionMatrix, viewMatrix, modelMatrix)
                if (isHover) {
                    this.reColor(child, new Vec3(0.88, 0.13, 0.13))
                } else {
                    this.reColor(child)
                }
            })
        }

        if (!this.ready) {
            this.init()
        }

        this.gl.bindVertexArray(this.vao)

        let vertex_loc = shader.getAttribLocation("vtx_position");
        if (vertex_loc >= 0) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[1]);
            this.gl.vertexAttribPointer(vertex_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(vertex_loc);
        }

        let vtx_normal_loc = shader.getAttribLocation("vtx_normal");
        if (vtx_normal_loc >= 0) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[2]);
            this.gl.vertexAttribPointer(vtx_normal_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(vtx_normal_loc);
        }
        let vtx_color_loc = shader.getAttribLocation("vtx_color");
        if (vtx_color_loc >= 0) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufs[3]);
            this.gl.vertexAttribPointer(vtx_color_loc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(vtx_color_loc);
        }

        this.gl.drawArrays(this.gl.TRIANGLES,  0, this.pos.length);
    }

}