// import { Material, PBRMaterial } from "./Material";
// import { Vec3, Vec2 } from "./math/Vector";
// import { Transform } from "./Tansform";

// export  class Mesh extends Transform {
//     positions: Vec3[] = []
//     colors: Vec3[] = []
//     indices:number[] = []
//     normals: Vec3[] = []
//     vertices: Vec3[] = []
//     vertexColors: Vec3[] = []
//     textureCoords: Vec2[] = []
//     tagents: Vec3[] = []
//     bitagents: Vec3[] = []
//     material: Material = new Material();
//     pbrmaterial : PBRMaterial = new PBRMaterial();

//     setMaterial(material: Material) {
//         this.material = material
//     }

//     setPBRMaterial (material: PBRMaterial) {
//         this.pbrmaterial = material
//     }

//     draw(gl: WebGL2RenderingContext) {
//         gl
//     }

//     computeTagent(positions:Vec3[], uvs: Vec2[]) {

//         const tagents:Vec3[] = [];
//         const bitagents:Vec3[] = [];
//         for(let i = 0; i< positions.length; i++){
//             let index_of_quad_start = i < 3 ? 0 : Math.floor((i)/3)*3;

//             if(index_of_quad_start > positions.length - 3 - 1){
//                 index_of_quad_start = positions.length - 3;
//             }

//             const index1 = index_of_quad_start;
//             const index2 = index_of_quad_start + 1;
//             const index3 = index_of_quad_start + 2;


//             let pos1:Vec3; let pos2: Vec3; let pos3: Vec3;
//             let uv1:Vec2; let uv2: Vec2; let uv3: Vec2;

//             const tagent = new Vec3(0,0,0);
//             const bitagent= new Vec3(0,0,0)
       
//             pos1 = positions[index1 ]
//             pos2 = positions[index2]
//             pos3 = positions[index3]
//             uv1 = uvs[index1]
//             uv2 = uvs[index2]
//             uv3 = uvs[index3]


//             const edge1: Vec3 = pos2.sub(pos1)
//             const edge2: Vec3 = pos3.sub(pos1)

//             const deltaUV1 : Vec2 = uv2.sub(uv1)
//             const deltaUV2: Vec2 = uv3.sub(uv1)

//             const f = 1.0 / ( deltaUV1.x* deltaUV2.y - deltaUV1.y* deltaUV2.x )


//             tagent.x = f* ( deltaUV2.y*edge1.x - deltaUV1.y * edge2.x )
//             tagent.y = f* ( deltaUV2.y*edge1.y - deltaUV1.y * edge2.y )
//             tagent.z = f* ( deltaUV2.y*edge1.z - deltaUV1.y * edge2.z )

//             bitagent.x = f* ( -deltaUV2.x*edge1.x + deltaUV1.x * edge2.x )
//             bitagent.y = f* ( -deltaUV2.x*edge1.y + deltaUV1.x * edge2.y )
//             bitagent.z = f* ( -deltaUV2.x*edge1.z + deltaUV1.x * edge2.z )

//             const tagent_n = tagent.normalize();
//             const bitagent_n = bitagent.normalize();

//             tagents.push(tagent_n);
//             bitagents.push(bitagent_n)
//         }

//         this.tagents = tagents;
//         this.bitagents = bitagents;
//     }
// }
export {}
// /**
//  * Cube 立方体
//  */
// export class Cube extends Mesh {
//     positions = [
//         new Vec3(-0.5, -0.5, -0.5),
//         new Vec3(0.5, -0.5, -0.5),
//         new Vec3(0.5, 0.5, -0.5),
//         new Vec3(0.5, 0.5, -0.5),
//         new Vec3(-0.5, 0.5, -0.5),
//         new Vec3(-0.5, -0.5, -0.5),

//         new Vec3(-0.5, -0.5, 0.5),
//         new Vec3(0.5, -0.5, 0.5),
//         new Vec3(0.5, 0.5, 0.5),
//         new Vec3(0.5, 0.5, 0.5),
//         new Vec3(-0.5, 0.5, 0.5),
//         new Vec3(-0.5, -0.5, 0.5),
        
//         new Vec3(-0.5, 0.5, 0.5),
//         new Vec3(-0.5, 0.5, -0.5),
//         new Vec3(-0.5, -0.5, -0.5),
//         new Vec3(-0.5, -0.5, -0.5),
//         new Vec3(-0.5, -0.5, 0.5),
//         new Vec3(-0.5, 0.5, 0.5),
        
//         new Vec3(0.5, 0.5, 0.5),
//         new Vec3(0.5, 0.5, -0.5),
//         new Vec3(0.5, -0.5, -0.5),
//         new Vec3(0.5, -0.5, -0.5),
//         new Vec3(0.5, -0.5, 0.5),
//         new Vec3(0.5, 0.5, 0.5),
        
//         new Vec3(-0.5, -0.5, -0.5),
//         new Vec3(0.5, -0.5, -0.5),
//         new Vec3(0.5, -0.5, 0.5),
//         new Vec3(0.5, -0.5, 0.5),
//         new Vec3(-0.5, -0.5, 0.5),
//         new Vec3(-0.5, -0.5, -0.5),
        
//         new Vec3(-0.5, 0.5, -0.5),
//         new Vec3(0.5, 0.5, -0.5),
//         new Vec3(0.5, 0.5, 0.5),
//         new Vec3(0.5, 0.5, 0.5),
//         new Vec3(-0.5, 0.5, 0.5),
//         new Vec3(-0.5, 0.5, -0.5),
//     ]

//     normals = [
//         new Vec3(0.0, 0.0, -1.0),
//         new Vec3(0.0, 0.0, -1.0),
//         new Vec3(0.0, 0.0, -1.0),
//         new Vec3(0.0, 0.0, -1.0),
//         new Vec3(0.0, 0.0, -1.0),
//         new Vec3(0.0, 0.0, -1.0),

//         new Vec3(0.0, 0.0, 1.0),
//         new Vec3(0.0, 0.0, 1.0),
//         new Vec3(0.0, 0.0, 1.0),
//         new Vec3(0.0, 0.0, 1.0),
//         new Vec3(0.0, 0.0, 1.0),
//         new Vec3(0.0, 0.0, 1.0),

//         new Vec3(-1.0, 0.0, 0.0),
//         new Vec3(-1.0, 0.0, 0.0),
//         new Vec3(-1.0, 0.0, 0.0),
//         new Vec3(-1.0, 0.0, 0.0),
//         new Vec3(-1.0, 0.0, 0.0),
//         new Vec3(-1.0, 0.0, 0.0),

//         new Vec3(1.0, 0.0, 0.0),
//         new Vec3(1.0, 0.0, 0.0),
//         new Vec3(1.0, 0.0, 0.0),
//         new Vec3(1.0, 0.0, 0.0),
//         new Vec3(1.0, 0.0, 0.0),
//         new Vec3(1.0, 0.0, 0.0),

//         new Vec3(0.0, -1.0, 0.0),
//         new Vec3(0.0, -1.0, 0.0),
//         new Vec3(0.0, -1.0, 0.0),
//         new Vec3(0.0, -1.0, 0.0),
//         new Vec3(0.0, -1.0, 0.0),
//         new Vec3(0.0, -1.0, 0.0),

//         new Vec3(0.0, 1.0, 0.0),
//         new Vec3(0.0, 1.0, 0.0),
//         new Vec3(0.0, 1.0, 0.0),
//         new Vec3(0.0, 1.0, 0.0),
//         new Vec3(0.0, 1.0, 0.0),
//         new Vec3(0.0, 1.0, 0.0),
//     ]

//     textureCoords = [
//         new Vec2(0.0, 0.0),
//         new Vec2(1.0, 0.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(0.0, 1.0),
//         new Vec2(0.0, 0.0),

//         new Vec2(0.0, 0.0),
//         new Vec2(1.0, 0.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(0.0, 1.0),
//         new Vec2(0.0, 0.0),

//         new Vec2(1.0, 0.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(0.0, 1.0),
//         new Vec2(0.0, 1.0),
//         new Vec2(0.0, 0.0),
//         new Vec2(1.0, 0.0),

//         new Vec2(1.0, 0.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(0.0, 1.0),
//         new Vec2(0.0, 1.0),
//         new Vec2(0.0, 0.0),
//         new Vec2(1.0, 0.0),

//         new Vec2(0.0, 1.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(1.0, 0.0),
//         new Vec2(1.0, 0.0),
//         new Vec2(0.0, 0.0),
//         new Vec2(0.0, 1.0),

//         new Vec2(0.0, 1.0),
//         new Vec2(1.0, 1.0),
//         new Vec2(1.0, 0.0),
//         new Vec2(1.0, 0.0),
//         new Vec2(0.0, 0.0),
//         new Vec2(0.0, 1.0)
//     ]


//     vertexColors = [
//         new Vec3(0.0, 0.0, 0.0),  // black
//         new Vec3(1.0, 0.0, 0.0),  // red
//         new Vec3(1.0, 1.0, 0.0),  // yellow 
//         new Vec3(0.0, 1.0, 0.0),  // green
//         new Vec3(0.0, 0.0, 1.0),  // blue
//         new Vec3(1.0, 0.0, 1.0),  // magenta
//         new Vec3(0.0, 1.0, 1.0),  // cyan
//         new Vec3(1.0, 1.0, 1.0)   // white
//     ];




//     colors: Vec3[] = []


//     constructor() {
//         super();
//         this.computeTagent(this.positions, this.textureCoords);
//     }
//     // 计算法线空间切线 和 副切线


//     draw(gl: WebGL2RenderingContext) {
//         gl.drawArrays(gl.TRIANGLES, 0 , 36)
//     }

// }

// // /**
// //  * Sphere 球体
// //  */
// // export class Sphere extends Mesh {

// //     constructor() {
// //         super();
// //         this.computePositionsA();
// //         // this.computeTagent(this.positions, this.textureCoords);
// //     }
// //     computePositionsA() {
// //         const R = 0.5;
// //         const X_SEGMENTS: number = 64;
// //         const Y_SEGMENTS: number = 64;
// //         const PI =  3.14159265359;

// //         for (let x = 0; x <= X_SEGMENTS; x++) {
// //             for (let y = 0; y <= Y_SEGMENTS; y++) {
// //                 const xSegment = x / X_SEGMENTS;
// //                 const ySegment = y / Y_SEGMENTS;
// //                 const xPos =R*  Math.cos(xSegment * 2 * PI) * Math.sin(ySegment * PI);
// //                 const yPos =R*  Math.cos(ySegment * PI)
// //                 const zPos =R*  Math.sin(xSegment*2*PI)*Math.sin(ySegment * PI)
                
// //                 this.positions.push(new Vec3(xPos, yPos, zPos))
// //                 this.textureCoords.push(new Vec2(xSegment, ySegment))
// //                 this.normals.push(new Vec3(xPos, yPos, zPos))
// //                 this.tagents.push(new Vec3(1,0,0))
// //                 this.bitagents.push(new Vec3(0,1,0))

// //             }
// //         }


// //         for (let i = 0; i < Y_SEGMENTS; i++)
// //         {
// //             for (let j = 0; j < X_SEGMENTS; j++)
// //             {
    
// //                 this.indices.push(i * (X_SEGMENTS+1) + j);
// //                 this.indices.push((i + 1) * (X_SEGMENTS + 1) + j);
// //                 this.indices.push((i + 1) * (X_SEGMENTS + 1) + j + 1);

// //                 this.indices.push(i * (X_SEGMENTS + 1) + j);
// //                 this.indices.push((i + 1) * (X_SEGMENTS + 1) + j + 1);
// //                 this.indices.push(i * (X_SEGMENTS + 1) + j + 1);
// //             }
// //         }

        
// //     }

  
// //    draw(gl: WebGL2RenderingContext) {
// //        gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
// //    }
// // }