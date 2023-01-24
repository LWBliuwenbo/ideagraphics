
// 使用Blinn-Phong 光照模型，为引擎实现光照模块，光照负责光照相关数据管理，生成，
// 主要计算在Shader中

import { Vec3 } from "./math/Vector";


export const LIGHT_TYPE_DIRECTIONAL = 0;
export const LIGHT_TYPE_DOT = 1;

export class Light {

    type = LIGHT_TYPE_DIRECTIONAL;

    brightness = 1.0;
    gamma = 2.2;
    exposure = 0.0;
    
    inTheta = 0.785398163;
    inPhi = 0.785398163;

    doubleTheta = true;
    useNDotL = true;

    incidentVector: Vec3 = new Vec3();

    constructor() {
        this.init();
    }

    init() {
        let useTheta = this.inTheta;
        if( this.doubleTheta )
            useTheta *= 2.0;
    
        this.incidentVector.x = Math.sin(useTheta) * Math.cos(this.inPhi);
        this.incidentVector.y = Math.sin(useTheta) * Math.sin(this.inPhi);
        this.incidentVector.z = Math.cos(useTheta);
    }

    setProps(light : Light) {
        const {brightness, gamma, exposure, inTheta, inPhi, doubleTheta, useNDotL } = light;
        this.brightness = brightness;
        this.gamma = gamma;
        this.exposure = exposure;
        this.inTheta = inTheta;
        this.inPhi = inPhi;
        this.doubleTheta = doubleTheta;
        this.useNDotL = useNDotL;
    }
}

export class PbrLight extends Light {
}






