import { Vec4 } from "./math/Vector";
import { Texture } from "./Texture";
export class Material {

    // 反射系数
    // matrialAmbient : Vec4 = new Vec4(1.0, 1.0, 0.0)
    // matrialDiffuse : Vec4 = new Vec4( 1.0, 1.0, 0.5, )
    // matrialSpecular : Vec4 = new Vec4( 1.0, 1.0, 0.5, )

    // 反射贴图
    // 漫反射贴图
    matrialDiffuseTexture: Texture  = new Texture();
    // 镜面反射贴图
    matrialSpecularTexture: Texture = new Texture();
    // 法相贴图
    normalMap: Texture =  new Texture();
    // 高光系数
    materialShininess : number = 100.0
}