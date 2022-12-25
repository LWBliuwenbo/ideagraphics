export class Buffer{
    buf: Float32Array
    index: number
    type: string
    constructor(size: number) {
        this.buf = new Float32Array(size)
        this.index = 0;
        this.type = 'buff'
    }

    push(x: number[]) {
        for(var i=0; i<x.length; i++) {
            this.buf[this.index+i] = x[i];
        }
        this.index += x.length;
        this.type = '';
    }
}


