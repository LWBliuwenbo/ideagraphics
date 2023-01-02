
// 使用Blinn-Phong 光照模型，为引擎实现光照模块，光照负责光照相关数据管理，生成，
// 主要计算在Shader中

import { Vec4 } from "./math/Vector";

export class Light {

    // 光源位置
    lightPosition: Vec4 = new Vec4;
    // 光源颜色：环境光分量
    lightAmbient: Vec4 = new Vec4;
    // 光源颜色：漫反射光分量
    lightDiffuse: Vec4 = new Vec4;
    // 光源颜色：镜面反射光分量
    lightSpecular: Vec4 = new Vec4;

    setPosition(p: Vec4) {
        this.lightPosition = p;
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