export class Vec2 {
    out = new Array<number>(2)
    type = "vec2"

    constructor(arg1: number[]);
    constructor(arg2: Vec2);
    constructor();



    constructor( arg?: any) {
        if(arg === undefined){
            this.out = [0.0, 0.0]
        }else if(arg.type === 'vec2'){
            this.out = [...arg.out];
        }else {
            this.out[0] = arg[0]
            this.out[1] = arg[1]
        }
    }
}

export class Vec3 {
    x:number = 0.0
    y:number = 0.0
    z:number = 0.0
    type = "vec3"

    constructor(x: number, y: number, z: number);
    constructor(arg2: Vec3);
    constructor();



    constructor( arg1?: any, arg2?:any, arg3?:any) {
        if(arg1 === undefined){
        
        }else if(arg1.type === 'vec3'){
            this.x = arg1.x
            this.y = arg1.y
            this.z = arg1.z
        }else {
            this.x = arg1
            this.y = arg2
            this.z = arg3
        }
    }

    burden() {
        const {x, y, z} = this;
        return new Vec3(-x, -y, -z )
    }

    add(v: Vec3) {
        const {x, y, z} = this;
        return new Vec3(x+v.x, y+v.y, z+ v.z)
    }

    sub(v: Vec3) {
        const {x, y, z} = this;
        return new Vec3(x-v.x, y-v.y, z- v.z)
    }

    normalize():Vec3{
        const {x, y, z} = this;

        const magsql = Math.sqrt(x*x + y*y + z*z)
        if(magsql == 0){
            return this
        }
        const overmag = 1.0 / magsql;
        return new Vec3(x*overmag, y*overmag, z*overmag)
    }
    dot(v: Vec3) {
        const {x, y, z} = this;
        return x* v.x + y* v.y+ z*v.z
    }

    mag() {
        const {x, y, z} = this;

        return Math.sqrt(x*x + y*y+ z*z)
    }

    cross(v: Vec3) {
        const {x, y, z} = this;
        return new Vec3( y*v.z - z*v.y, z*v.x - x*v.z, x*v.y - y*v.x )
    }

    mult(n: number) {
        const {x, y, z} = this;
        return new Vec3(x* n , y* n, z*n)
    }







    



}

export class Vec4 {
    x:number = 0.0
    y:number = 0.0
    z:number = 0.0
    r:number = 1.0
    type = "vec4"

    constructor(x: number, y: number, z: number);
    constructor(x: number, y: number, z: number,r: number);
    constructor(arg2: Vec3);
    constructor();



    constructor( arg1?: any, arg2?:any, arg3?:any, arg4?: any) {
        if(arg1 === undefined){
        
        }else if(arg1.type === 'vec3' || arg1.type === 'vec4'){
            this.x = arg1.x
            this.y = arg1.y
            this.z = arg1.z
        }else {
            this.x = arg1
            this.y = arg2
            this.z = arg3
            this.r = arg4 || 1.0
        }
    }

    flattrn() {
        const {x, y, z} = this;

        return new Float32Array([x, y, z, 1])
    }

    burden() {
        const {x, y, z} = this;
        return new Vec4(-x, -y, -z )
    }

    add(v: Vec4) {
        const {x, y, z} = this;
        return new Vec4(x+v.x, y+v.y, z+ v.z)
    }

    sub(v: Vec4) {
        const {x, y, z} = this;
        return new Vec4(x-v.x, y-v.y, z- v.z)
    }

    normalize():Vec4{
        const {x, y, z} = this;

        const magsql = Math.sqrt(x*x + y*y + z*z)
        if(magsql == 0){
            return this
        }
        const overmag = 1.0 / magsql;
        return new Vec4(x*overmag, y*overmag, z*overmag)
    }
    dot(v: Vec4) {
        const {x, y, z} = this;
        return x* v.x + y* v.y+ z*v.z
    }

    mag() {
        const {x, y, z} = this;

        return Math.sqrt(x*x + y*y+ z*z)
    }

    cross(v: Vec4) {
        const {x, y, z} = this;
        return new Vec3( y*v.z - z*v.y, z*v.x - x*v.z, x*v.y - y*v.x )
    }

    mult(n: number) {
        const {x, y, z} = this;
        return new Vec4(x* n , y* n, z*n)
    }

    multV(v: Vec4) {
        const {x, y, z} = this;
        return new Vec4(x* v.x , y* v.y, z*v.z)
    }

}