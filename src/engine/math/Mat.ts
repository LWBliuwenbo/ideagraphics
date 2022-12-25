

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

    mult(mat4: Mat4): Mat4 {
        const result: number[][] = []
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
            result[i][j] = 0.0;
            for (var k = 0; k < 4; k++) result[i][j] += this.out[i][k] * mat4.out[k][j];
        }
        return new Mat4(result)
    }

}