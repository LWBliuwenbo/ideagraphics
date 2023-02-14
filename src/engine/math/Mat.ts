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
    transpose() {
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
    child(x: number, y: number){
        const out = this.out;
        const result = [];
        for (let i = 0; i < this.out.length; i++) {
            for (let f = 0; f < 4; f++) {
                if(i == x || f ==y){
                    continue
                } else {
                    result.push(out[i][f])
                }
            }
        }

        return new Mat3(result)
    }

    value() {
        const out = this.out;
        const mat1 = this.child(0,0)
        const mat2 = this.child(0,1)
        const mat3 = this.child(0,2)
        const mat4 = this.child(0,3)
        

        return  out[0][0] * mat1.value() - out[0][1] * mat2.value() + out[0][2] * mat3.value() - out[0][3]* mat4.value();
    }
    inverse() {
        const adjMatArray: number[] = []
        for (let i = 0; i < this.out.length; i++) {
            for (let f = 0; f < 4; f++) {
                if(f ==0 || f==2){
                    adjMatArray.push( this.child(i,f).value() )
                }
                if(f ==1 || f==3){
                    adjMatArray.push( -this.child(i,f).value())
                }
            }
        }

        const adjmat = new Mat4(adjMatArray);
        return adjmat.multNum(1/this.value())

    }
    multNum(num: number) {
        const out = this.out;
        const result: number[] = []
        for (let i = 0; i < out.length; i++) {
            for (let f = 0; f < 4; f++) {
                result.push( out[i][f] * num )
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

export class Mat3 {
    out: number[][] = []

    constructor(input: number[]);
    constructor(input: number[][]);


    constructor(input: any) {
        if (!input || input.length == 0) {
            this.out = []
        } else if (input.length === 3) {
            this.out = input;
        } else {
            this.out = this.initMat(input);
        }
    }


    initMat(input: number[]) {
        const out: number[][] = []

        for (let i = 0; i < 3; i++) {
            out[i] = []
            for (let f = 0; f < 3; f++) {
                out[i][f] = input[i * 3 + f]
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
    transpose() {
        const result: number[][] = []
        for (let i = 0; i < this.out.length; i++)  {
            if(result[i] == undefined){
                result[i] = []
            }

            for (let j = 0; j < 3; j++){
                result[i][j] = this.out[j][i]
            }
        }
        return new Mat3(result)
    }
    inverse() {

    }
    mult(mat3: Mat3): Mat3 {
        const result: number[][] = []
        for (let i = 0; i < this.out.length; i++) for (let j = 0; j < mat3.out.length; j++) {
            if(result[i] == undefined){
                result[i] = []
            }
            result[i][j] = 0.0;
            for (var k = 0; k < 3; k++) result[i][j] += this.out[i][k] * mat3.out[k][j];
        }
        return new Mat3(result)
    }

    static multVe3(vec3: Vec3, mat:Mat3) { 
        const {x, y, z} = vec3
        const mat3 = mat.out;
      return new Vec3(
        x* mat3[0][0] + y*mat3[1][0] + z * mat3[2][0],
        x* mat3[0][1] + y*mat3[1][1] + z * mat3[2][1],
        x* mat3[0][2] + y*mat3[1][2] + z * mat3[2][2],
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

    child(x: number, y: number){
        const out = this.out;
        const result = [];
        for (let i = 0; i < this.out.length; i++) {
            for (let f = 0; f < 3; f++) {
                if(i == x || f ==y){
                    continue
                } else {
                    result.push(out[i][f])
                }
            }
        }

        return new Mat2(result)
    }

    value() {
        const out = this.out;
        const mat1 = this.child(0,0)
        const mat2 = this.child(0,1)
        const mat3 = this.child(0,2)

        return  out[0][0] * mat1.value() - out[0][1] * mat2.value() + out[0][2] * mat3.value();
    }

}

export class Mat2 {
    out: number[][] = []

    constructor(input: number[]);
    constructor(input: number[][]);


    constructor(input: any) {
        if (!input || input.length == 0) {
            this.out = []
        } else if (input.length === 2) {
            this.out = input;
        } else {
            this.out = this.initMat(input);
        }
    }


    initMat(input: number[]) {
        const out: number[][] = []

        for (let i = 0; i < 2; i++) {
            out[i] = []
            for (let f = 0; f < 2; f++) {
                out[i][f] = input[i * 2 + f]
            }
        }

        return out;
    }

    value() {
        return this.out[0][0]*this.out[1][1] - this.out[0][1]*this.out[1][0]
    }

}