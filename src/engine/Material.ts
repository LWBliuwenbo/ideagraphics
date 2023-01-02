import { Vec4 } from "./math/Vector";

export class Material {

    // 反射系数
    matrialAmbient : Vec4 = new Vec4(1.0, 1.0, 0.0)
    matrialDiffuse : Vec4 = new Vec4( 1.0, 1.0, 0.5, )
    matrialSpecular : Vec4 = new Vec4( 1.0, 1.0, 0.5, )

    // 高光系数
    materialShininess : number = 100.0
}