import { Material } from "./Material";
import { Vec4, Vec3, Vec2 } from "./math/Vector";
import { Transform } from "./Tansform";

export class Geometric extends Transform {

    positions: Vec4[] = []
    colors: Vec4[] = []
    normals: Vec3[] = []
    vertices: Vec4[] = []
    vertexColors: Vec4[] = []
    textureCoords: Vec2[] = []
    material: Material = new Material();

    setMaterial(material: Material) {
        this.material = material
    }
}


export class Cube extends Geometric {
    positions = [
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(0.5, -0.5, -0.5),
        new Vec4(0.5, 0.5, -0.5),
        new Vec4(0.5, 0.5, -0.5),
        new Vec4(-0.5, 0.5, -0.5),
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(-0.5, -0.5, 0.5),
        new Vec4(0.5, -0.5, 0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(-0.5, 0.5, 0.5),
        new Vec4(-0.5, -0.5, 0.5),
        new Vec4(-0.5, 0.5, 0.5),
        new Vec4(-0.5, 0.5, -0.5),
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(-0.5, -0.5, 0.5),
        new Vec4(-0.5, 0.5, 0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(0.5, 0.5, -0.5),
        new Vec4(0.5, -0.5, -0.5),
        new Vec4(0.5, -0.5, -0.5),
        new Vec4(0.5, -0.5, 0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(0.5, -0.5, -0.5),
        new Vec4(0.5, -0.5, 0.5),
        new Vec4(0.5, -0.5, 0.5),
        new Vec4(-0.5, -0.5, 0.5),
        new Vec4(-0.5, -0.5, -0.5),
        new Vec4(-0.5, 0.5, -0.5),
        new Vec4(0.5, 0.5, -0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(0.5, 0.5, 0.5),
        new Vec4(-0.5, 0.5, 0.5),
        new Vec4(-0.5, 0.5, -0.5),
    ]

    normals = [
        new Vec3(0.0, 0.0, -1.0),
        new Vec3(0.0, 0.0, -1.0),
        new Vec3(0.0, 0.0, -1.0),
        new Vec3(0.0, 0.0, -1.0),
        new Vec3(0.0, 0.0, -1.0),
        new Vec3(0.0, 0.0, -1.0),
        new Vec3(0.0, 0.0, 1.0),
        new Vec3(0.0, 0.0, 1.0),
        new Vec3(0.0, 0.0, 1.0),
        new Vec3(0.0, 0.0, 1.0),
        new Vec3(0.0, 0.0, 1.0),
        new Vec3(0.0, 0.0, 1.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(0.0, -1.0, 0.0),
        new Vec3(0.0, -1.0, 0.0),
        new Vec3(0.0, -1.0, 0.0),
        new Vec3(0.0, -1.0, 0.0),
        new Vec3(0.0, -1.0, 0.0),
        new Vec3(0.0, -1.0, 0.0),
        new Vec3(0.0, 1.0, 0.0),
        new Vec3(0.0, 1.0, 0.0),
        new Vec3(0.0, 1.0, 0.0),
        new Vec3(0.0, 1.0, 0.0),
        new Vec3(0.0, 1.0, 0.0),
        new Vec3(0.0, 1.0, 0.0),
    ]

    textureCoords = [
        new Vec2(0.0, 0.0),
        new Vec2(1.0, 0.0),
        new Vec2(1.0, 1.0),
        new Vec2(1.0, 1.0),
        new Vec2(0.0, 1.0),
        new Vec2(0.0, 0.0),

        new Vec2(0.0, 0.0),
        new Vec2(1.0, 0.0),
        new Vec2(1.0, 1.0),
        new Vec2(1.0, 1.0),
        new Vec2(0.0, 1.0),
        new Vec2(0.0, 0.0),

        new Vec2(1.0, 0.0),
        new Vec2(1.0, 1.0),
        new Vec2(0.0, 1.0),
        new Vec2(0.0, 1.0),
        new Vec2(0.0, 0.0),
        new Vec2(1.0, 0.0),

        new Vec2(1.0, 0.0),
        new Vec2(1.0, 1.0),
        new Vec2(0.0, 1.0),
        new Vec2(0.0, 1.0),
        new Vec2(0.0, 0.0),
        new Vec2(1.0, 0.0),

        new Vec2(0.0, 1.0),
        new Vec2(1.0, 1.0),
        new Vec2(1.0, 0.0),
        new Vec2(1.0, 0.0),
        new Vec2(0.0, 0.0),
        new Vec2(0.0, 1.0),

        new Vec2(0.0, 1.0),
        new Vec2(1.0, 1.0),
        new Vec2(1.0, 0.0),
        new Vec2(1.0, 0.0),
        new Vec2(0.0, 0.0),
        new Vec2(0.0, 1.0)
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




    colors: Vec4[] = []


    constructor() {
        super();
    }

}