
// 使用Blinn-Phong 光照模型，为引擎实现光照模块，光照负责光照相关数据管理，生成，
// 主要计算在Shader中

import { Vec3, Vec4 } from "./math/Vector";

export class Light {

    // 光源位置
    lightPosition: Vec4 = new Vec4;

    // color for pbr
    lightColor:Vec4 = new Vec4;

    // 光源颜色：环境光分量
    lightAmbient: Vec4 = new Vec4;
    // 光源颜色：漫反射光分量
    lightDiffuse: Vec4 = new Vec4;
    // 光源颜色：镜面反射光分量
    lightSpecular: Vec4 = new Vec4;

    setPosition(p: Vec4) {
        this.lightPosition = p;
    }

    setColor(color:Vec4) {
        this.lightColor = color;
    }

    setAmbient(v: Vec4) {
        this.lightAmbient = v;
    }

    setDiffuse(v: Vec4) {
        this.lightDiffuse = v;
    }

    setSpecular(v: Vec4) {
        this.lightSpecular = v;
    }

}

export class PbrLight {
    type: number = -1
    position: Vec3 = new Vec3(0, 0, 1)
    itensity:number = 25000
    falloffradius: number = 0
    color:Vec3 = new  Vec3(1,1,1)

    setProps(light: PbrLight) {
        this.type = light.type;
        this.position = light.position;
        this.color = light.color
        this.itensity = light.itensity;
    }
}


export const LIGHT_TYPE_DIRECTIONAL = 0;
export const LIGHT_TYPE_DOT = 1;


export class DirectionalLight extends PbrLight {
    type = LIGHT_TYPE_DIRECTIONAL

    position:Vec3 = new Vec3(2, 2, 2)

    color:Vec3 = new  Vec3(1,1,1)

    //  照度灯光单元(lx)
    itensity:number = 9000
}

export class DotLight extends PbrLight {

    type = LIGHT_TYPE_DOT
    
    position:Vec3 = new Vec3(3, 3, 3)
    
    itensity:number = 100

    color:Vec3 = new  Vec3(1,1,1)

    falloffradius: number = 0
}

