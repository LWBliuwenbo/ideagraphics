import { Vec4 } from "./math/Vector";
import { Transform } from "./Tansform";

export class Geometric extends Transform{

    positions:Vec4[] =  []
    colors:Vec4[] = []
    vertices:Vec4[] = []
    vertexColors:Vec4[]=[]


}


export class Cube extends Geometric {
    vertices = [
        new Vec4([-0.5, -0.5, 0.5, 1.0]),
        new Vec4([-0.5, 0.5, 0.5, 1.0]),
        new Vec4([0.5, 0.5, 0.5, 1.0]),
        new Vec4([0.5, -0.5, 0.5, 1.0]),
        new Vec4([-0.5, -0.5, -0.5, 1.0]),
        new Vec4([-0.5, 0.5, -0.5, 1.0]),
        new Vec4([0.5, 0.5, -0.5, 1.0]),
        new Vec4([0.5, -0.5, -0.5, 1.0]),
    ]

    vertexColors = [
        new Vec4(0.0, 0.0, 0.0, 1.0),  // black
        new Vec4(1.0, 0.0, 0.0, 1.0),  // red
        new Vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        new Vec4(0.0, 1.0, 0.0, 1.0),  // green
        new Vec4(0.0, 0.0, 1.0, 1.0),  // blue
        new Vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        new Vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        new Vec4(1.0, 1.0, 1.0, 1.0)   // white
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
        for ( var i = 0; i < indices.length; ++i ) {
            this.positions.push( this.vertices[indices[i]] );
            //colors.push( vertexColors[indices[i]] );
    
            // for solid colored faces use
            this.colors.push(this.vertexColors[a]);
        }
    }

}