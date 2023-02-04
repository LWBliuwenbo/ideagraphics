import { Texture } from "./Texture";
import {Vec3, Vec4} from './math/Vector'
import { Shader } from "./Shader";
export abstract class Material {

    // 法相贴图
    normalMap: Texture =  new Texture();

    // 颜色贴图
    colorMap: Texture = new Texture();

    abstract draw(shader: Shader) :void;
    abstract setProps(props: Material):void;
}
export class PhongMaterial extends Material {

    matrialAmbient : Vec4 = new Vec4(1.0, 1.0, 0.0)
    matrialDiffuse : Vec4 = new Vec4( 1.0, 1.0, 0.5, )
    matrialSpecular : Vec4 = new Vec4( 1.0, 1.0, 0.5, )
    // 高光系数
    materialShininess : number = 100.0;

    matrialDiffuseTexture: Texture  = new Texture();
    // 镜面反射贴图
    matrialSpecularTexture: Texture = new Texture();

    draw(shader: Shader) {
        shader.setUniformf('shininess', this.materialShininess)
    }
    setProps() {
        
    }
}
export class PBRMaterial extends Material{
baseColor:Vec3 = new Vec3(0.82, 0.67, 0.16)
    /*金属度，规定电介质为0，金属为1；
当值趋向1时：弱化漫反射比率，强化镜面反射强度，同时镜面反射逐渐附带上金属色
半导体材质情况特殊，尽量避免使用半导体调试效果 0 1 0
*/
 metallic:number = 0;

// 次表面 控制漫反射形状 0 1 0

 subsurface:number = 0;

// 高光强度（镜面反射强度）
// 控制镜面反射光占入射光的比率，用于取代折射率 0 1 .5
 specular:number = .5;


// 粗糙度，影响漫反射和镜面反射 0 1 .5
 roughness:number = .5;

//高光染色，和baseColor一起，控制镜面反射的颜色
//注意，这是非物理效果，且掠射镜面反射依然是非彩色 0 1 0
 specularTint:number = 0;

//各向异性程度，控制镜面反射在不同朝向上的强度，既镜面反射高光的纵横比
//规定完全各向同性时为0，完全各项异性时为1 0 1 0
 anisotropic:number = 0;

//光泽度，一种额外的掠射分量，一般用于补偿布料在掠射角下的光能  0 1 0
 sheen:number = 0;

// 光泽色，控制sheen的颜色  0 1 .5
 sheenTint:number = 0.5;

// 清漆强度，控制第二个镜面反射波瓣形成及其影响范围 0 1 0
 clearcoat:number = 0;

// 清漆光泽度，控制透明涂层的高光强度（光泽度）
// 规定缎面(satin)为0，光泽(gloss)为1； 0 1 1
 clearcoatGloss:number = 1;



 setProps(material: PBRMaterial) {
    this.baseColor = material.baseColor
    this.metallic = material.metallic;
    this.subsurface = material.subsurface;
    this.specular = material.specular;
    this.roughness = material.roughness;
    this.specularTint = material.specularTint;
    this.anisotropic = material.anisotropic;
    this.sheen = material.sheen;
    this.sheenTint = material.sheenTint;
    this.clearcoat = material.clearcoat;
    this.clearcoatGloss = material.clearcoatGloss
 }

 draw(shader: Shader): void {
    shader.setUniform3fv('baseColor', this.baseColor)
    shader.setUniformf('metallic', this.metallic)
    shader.setUniformf('subsurface', this.subsurface)
    shader.setUniformf('specular', this.specular)
    shader.setUniformf('roughness', this.roughness)
    shader.setUniformf('specularTint', this.specularTint)
    shader.setUniformf('sheen', this.sheen)
    shader.setUniformf('sheenTint', this.sheenTint)
    shader.setUniformf('clearcoat', this.clearcoat)
    shader.setUniformf('clearcoatGloss', this.clearcoatGloss)
 }
}