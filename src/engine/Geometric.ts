import { Material } from "./Material";
import { Vec4, Vec3, Vec2 } from "./math/Vector";
import { Transform } from "./Tansform";

export class Geometric extends Transform{

    positions:Vec4[] =  []
    colors:Vec4[] = []
    nomarls: Vec3[] = []
    vertices:Vec4[] = []
    vertexColors:Vec4[]= []
    textureCoords: Vec2[] = []
    material : Material = new Material();

    setMaterial (material: Material) {
        this.material = material
    }
}


export class Cube extends Geometric {
    vertices = [
        new Vec4(-0.5, -0.5, 0.5),
        new Vec4(-0.5, 0.5, 0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(0.5, -0.5, 0.5),
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(-0.5, 0.5, -0.5),
        new Vec4(0.5, 0.5, -0.5),
        new Vec4(0.5, -0.5, -0.5),
    ]

    vertexColors = [
        new Vec4(0.0, 0.0, 0.0),  // black
        new Vec4(1.0, 0.0, 0.0),  // red
        new Vec4(1.0, 1.0, 0.0),  // yellow
        new Vec4(0.0, 1.0, 0.0),  // green
        new Vec4(0.0, 0.0, 1.0),  // blue
        new Vec4(1.0, 0.0, 1.0),  // magenta
        new Vec4(0.0, 1.0, 1.0),  // cyan
        new Vec4(1.0, 1.0, 1.0)   // white
    ];




    positions:Vec4[] =  []
    colors:Vec4[] = []


    constructor() {
        super();
        this.init();
    }

    init(){

        this.quad(1, 0, 3, 2);
        this.quad(2, 3, 7, 6);
        this.quad(3, 0, 4, 7);
        this.quad(6, 5, 1, 2);
        this.quad(4, 5, 6, 7);
        this.quad(5, 4, 0, 1);
    }

    quad(a:number, b:number, c:number, d:number) {
        const indices = [a, b, c, a, c, d];
        // 因为一个面的点的法向量相同，因此计算一次

        const v1 = this.vertices[b].sub(this.vertices[a])
        const v2 = this.vertices[c].sub(this.vertices[b])

        const normal = v1.cross(v2)

        this.textureCoords = this.textureCoords.concat([
            new Vec2(0.0, 0.0),
            new Vec2(1.0, 0.0),
            new Vec2(1.1, 1.1),
            new Vec2(0.0, 0.0),
            new Vec2(1.0, 1.0),
            new Vec2(0.0, 1.0),
        ])
        for ( var i = 0; i < indices.length; ++i ) {
            this.positions.push( this.vertices[indices[i]] );
            this.colors.push(this.vertexColors[indices[i]]);
            this.nomarls.push(normal)
        }
    }

}