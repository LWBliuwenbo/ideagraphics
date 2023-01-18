import { Vec3 } from "./math/Vector"


export class Transform{
    // roateMat: Mat4 
    roateTheta: Vec3= new Vec3(0,0,0)
    tranlate: Vec3 =  new Vec3(0,0,0)
    scale: Vec3 =  new Vec3(1,1,1)


    roateX(deg: number) {
        this.roateTheta.x = deg
    }

    roateY(deg: number) {
        this.roateTheta.y = deg
    }

    roateZ(deg: number) {
        this.roateTheta.z = deg
    }

    tranlateX(distance: number){
        this.tranlate.x = distance
    }
    tranlateY(distance: number){
        this.tranlate.y = distance
    }

    tranlateZ(distance: number){
        this.tranlate.z = distance
    }

    scaleX(distance: number){
        this.scale.x = distance
    }
    scaleY(distance: number){
        this.scale.y = distance
    }

    scaleZ(distance: number){
        this.scale.z = distance
    }
}