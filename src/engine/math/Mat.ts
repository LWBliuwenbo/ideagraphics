import { Vec3 } from "./Vector";


export class Mat4 {
    out: number[][] = []

    constructor(input: number[]);
    constructor(input: number[][]);


    constructor(input: any) {
        if (!input || input.length == 0) {
            this.out = []
        } else if (input.length === 4) {
            this.out = input;
        } else {
            this.out = this.initMat(input);
        }
    }


    initMat(input: number[]) {
        const out: number[][] = []

        for (let i = 0; i < 4; i++) {
            out[i] = []
            for (let f = 0; f < 4; f++) {
                out[i][f] = input[i * 4 + f]
            }
        }

        return out;
    }

    flattrn() {
        let result: number[] = [];
        for (let i = 0; i < this.out.length; i++) {
            result = result.concat(this.out[i])
        }
        var floats = new Float32Array(result.length)
        for (let i = 0; i < result.length; i++) floats[i] = result[i];
        return floats;
    }
    inverse() {
        const result: number[][] = []
        for (let i = 0; i < this.out.length; i++)  {
            if(result[i] == undefined){
                result[i] = []
            }

            for (let j = 0; j < 4; j++){
                result[i][j] = this.out[j][i]
            }
        }
        return new Mat4(result)
    }
    mult(mat4: Mat4): Mat4 {
        const result: number[][] = []
        for (let i = 0; i < this.out.length; i++) for (let j = 0; j < mat4.out.length; j++) {
            if(result[i] == undefined){
                result[i] = []
            }
            result[i][j] = 0.0;
            for (var k = 0; k < 4; k++) result[i][j] += this.out[i][k] * mat4.out[k][j];
        }
        return new Mat4(result)
    }

    static multVe3(vec3: Vec3, mat:Mat4) { 
        const {x, y, z} = vec3
        const mat4 = mat.out;
      return new Vec3(
        x* mat4[0][0] + y*mat4[1][0] + z * mat4[2][0] + mat4[3][0],
        x* mat4[0][1] + y*mat4[1][1] + z * mat4[2][1] + mat4[3][1],
        x* mat4[0][2] + y*mat4[1][2] + z * mat4[2][2] + mat4[3][2],
      )
    }

   static getRoateX(deg:number) {
        const PI = 3.1415926;
        const angle = deg * PI / (180);
        const c = Math.cos(angle)
        const s = Math.sin(angle);
        // 绕x 轴旋转
        return  new Mat4([
                1.0,  0.0,  0.0, 0.0,
                0.0,  c,  s, 0.0,
                0.0, -s,  c, 0.0,
                0.0,  0.0,  0.0, 1.0
        ])
    }

    static getRoateY (deg:number) {
        const PI = 3.1415926;
        const angle = deg * PI / (180);
        const c = Math.cos(angle)
        const s = Math.sin(angle);
        // 绕x 轴旋转
        return new Mat4([
                c, 0.0, -s, 0.0,
                0.0, 1.0,  0.0, 0.0,
                s, 0.0,  c, 0.0,
                0.0, 0.0,  0.0, 1.0
        ])
    }

}