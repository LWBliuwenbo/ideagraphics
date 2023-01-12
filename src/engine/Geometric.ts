import { Material, PBRMaterial } from "./Material";
import { Vec4, Vec3, Vec2 } from "./math/Vector";
import { Transform } from "./Tansform";

export class Geometric extends Transform {

    positions: Vec4[] = []
    colors: Vec4[] = []
    normals: Vec3[] = []
    vertices: Vec4[] = []
    vertexColors: Vec4[] = []
    textureCoords: Vec2[] = []
    tagents: Vec3[] = []
    bitagents: Vec3[] = []
    material: Material = new Material();
    pbrmaterial : PBRMaterial = new PBRMaterial();

    setMaterial(material: Material) {
        this.material = material
    }

    setPBRMaterial (material: PBRMaterial) {
        this.pbrmaterial = material
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

        new Vec3(-1.0, 0.0, 0.0),
        new Vec3(-1.0, 0.0, 0.0),
        new Vec3(-1.0, 0.0, 0.0),
        new Vec3(-1.0, 0.0, 0.0),
        new Vec3(-1.0, 0.0, 0.0),
        new Vec3(-1.0, 0.0, 0.0),

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
        this.computeTagent(this.positions, this.textureCoords);
    }
    // 计算法线空间切线 和 副切线
    computeTagent(positions:Vec4[], uvs: Vec2[]) {

        const tagents:Vec3[] = [];
        const bitagents:Vec3[] = [];
        for(let i = 0; i< positions.length; i++){
            let index_of_quad_start = i < 3 ? 0 : Math.floor((i)/3)*3;

            if(index_of_quad_start > positions.length - 3 - 1){
                index_of_quad_start = positions.length - 3;
            }

            const index1 = index_of_quad_start;
            const index2 = index_of_quad_start + 1;
            const index3 = index_of_quad_start + 2;


            let pos1:Vec3; let pos2: Vec3; let pos3: Vec3;
            let uv1:Vec2; let uv2: Vec2; let uv3: Vec2;

            const tagent = new Vec3(0,0,0);
            const bitagent= new Vec3(0,0,0)
       
            pos1 = positions[index1 ].xyz()
            pos2 = positions[index2].xyz()
            pos3 = positions[index3].xyz();
            uv1 = uvs[index1]
            uv2 = uvs[index2]
            uv3 = uvs[index3]


            const edge1: Vec3 = pos2.sub(pos1)
            const edge2: Vec3 = pos3.sub(pos1)

            const deltaUV1 : Vec2 = uv2.sub(uv1)
            const deltaUV2: Vec2 = uv3.sub(uv1)

            const f = 1.0 / ( deltaUV1.x* deltaUV2.y - deltaUV1.y* deltaUV2.x )


            tagent.x = f* ( deltaUV2.y*edge1.x - deltaUV1.y * edge2.x )
            tagent.y = f* ( deltaUV2.y*edge1.y - deltaUV1.y * edge2.y )
            tagent.z = f* ( deltaUV2.y*edge1.z - deltaUV1.y * edge2.z )

            bitagent.x = f* ( -deltaUV2.x*edge1.x + deltaUV1.x * edge2.x )
            bitagent.y = f* ( -deltaUV2.x*edge1.y + deltaUV1.x * edge2.y )
            bitagent.z = f* ( -deltaUV2.x*edge1.z + deltaUV1.x * edge2.z )

            const tagent_n = tagent.normalize();
            const bitagent_n = bitagent.normalize();

            tagents.push(tagent_n);
            bitagents.push(bitagent_n)
        }

        this.tagents = tagents;
        this.bitagents = bitagents;
    }

}

export class Ball extends Geometric {
    
}