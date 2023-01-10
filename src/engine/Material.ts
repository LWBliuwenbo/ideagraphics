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
    materialShininess : number = 100.0;
}

export class PBRMaterial extends Material{
    /*金属度，规定电介质为0，金属为1；
当值趋向1时：弱化漫反射比率，强化镜面反射强度，同时镜面反射逐渐附带上金属色
半导体材质情况特殊，尽量避免使用半导体调试效果 0 1 0
*/
 metallic:number = 0;

// 次表面 控制漫反射形状 0 1 0

 subsurface:number = 0;

// 高光强度（镜面反射强度）
// 控制镜面反射光占入射光的比率，用于取代折射率 0 1 .5
 specular:number = 0;


// 粗糙度，影响漫反射和镜面反射 0 1 .5
 roughness:number = 1;

//高光染色，和baseColor一起，控制镜面反射的颜色
//注意，这是非物理效果，且掠射镜面反射依然是非彩色 0 1 0
 specularTint:number = 0;

//各向异性程度，控制镜面反射在不同朝向上的强度，既镜面反射高光的纵横比
//规定完全各向同性时为0，完全各项异性时为1 0 1 0
 anisotropic:number = 1;

//光泽度，一种额外的掠射分量，一般用于补偿布料在掠射角下的光能  0 1 0
 sheen:number = 0;

// 光泽色，控制sheen的颜色  0 1 .5
 sheenTint:number = 0;

// 清漆强度，控制第二个镜面反射波瓣形成及其影响范围 0 1 0
 clearcoat:number = 1;

// 清漆光泽度，控制透明涂层的高光强度（光泽度）
// 规定缎面(satin)为0，光泽(gloss)为1； 0 1 1
 clearcoatGloss:number = 0;
}