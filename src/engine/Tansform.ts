import { Mat4 } from "./math/Mat";
import { Vec3 } from "./math/Vector"


export class Transform{
    // roateMat: Mat4 
    roateTheta: Vec3= new Vec3(0,0,0)
    tranlate: Vec3 =  new Vec3(0,0,0)
    scale: Vec3 =  new Vec3(1,1,1)

    getModelTansformMatrix() {
        const PI = 3.1415926;
        const angle_x = this.roateTheta.x * PI / (180);
        const angle_y = this.roateTheta.y * PI / (180);
        const angle_z = this.roateTheta.z * PI / (180);

        const  c_x = Math.cos(angle_x)
        const s_x = Math.sin(angle_x)
        const  c_y = Math.cos(angle_y)
        const s_y = Math.sin(angle_y)
        const  c_z = Math.cos(angle_z)
        const s_z = Math.sin(angle_z)

        const roateX = new Mat4([
            1.0,  0.0,  0.0, 0.0,
		    0.0,  c_x,  s_x, 0.0,
		    0.0, -s_x,  c_x, 0.0,
		    0.0,  0.0,  0.0, 1.0])

        const roateY = new Mat4([
            c_y, 0.0, -s_y, 0.0,
		    0.0, 1.0,  0.0, 0.0,
		    s_y, 0.0,  c_y, 0.0,
		    0.0, 0.0,  0.0, 1.0
        ])

        const roateZ = new Mat4([
            c_z, s_z, 0.0, 0.0,
		    -s_z,  c_z, 0.0, 0.0,
		    0.0,  0.0, 1.0, 0.0,
		    0.0,  0.0, 0.0, 1.0
        ])

        const tMat = new Mat4([
            1.0,  0.0,  0.0, 0.0,
		    0.0,  1.0,  0.0, 0.0,
		    0.0,  0.0,  1.0,  0.0,
		    this.tranlate.x,  this.tranlate.y,  this.tranlate.z, 1.0
        ])

        const tScale = new Mat4([
            this.scale.x, 0, 0, 0,
            0, this.scale.y, 0, 0,
            0,0, this.scale.z, 0,
            0,0,0,1
        ]);

        return roateX.mult(roateY).mult(roateZ).mult(tScale).mult(tMat)
    }


    setTranslate(vec: Vec3) {
        this.tranlate = vec;
    }

    scaleAll(s: number) {
        this.scale = new Vec3(s,s,s)
    }



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