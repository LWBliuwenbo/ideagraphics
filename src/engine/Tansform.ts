import { Mat4 } from "./math/Mat";
import { Vec3 } from "./math/Vector"


export class Transform{
    // roateMat: Mat4 
    roateTheta: Vec3= new Vec3(0,0,0)
    tranlate: Vec3 =  new Vec3(0,0,0)
    scale: Vec3 =  new Vec3(1,1,1)

    roateAnyWayMatirx:Mat4 | null = null;
    roateAnyWay: boolean = false;

    getModelTansformMatrix() {
      

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
        if(this.roateAnyWay && this.roateAnyWayMatirx != null){
            return this.roateAnyWayMatirx.mult(tScale).mult(tMat)
        }else {
            return this.getBaseRoate().mult(tScale).mult(tMat)
        }
    }


    setTranslate(vec: Vec3) {
        this.tranlate = vec;
    }

    scaleAll(s: number) {
        this.scale = new Vec3(s,s,s)
    }



    roateX(deg: number) {
        this.roateAnyWay = false;
        this.roateTheta.x = deg
    }

    roateY(deg: number) {
        this.roateAnyWay = false;
        this.roateTheta.y = deg
    }

    roateZ(deg: number) {
        this.roateAnyWay = false;
        this.roateTheta.z = deg
    }

    getBaseRoate() {
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


        return roateX.mult(roateY).mult(roateZ)
    }

    roateAnyAxis (axis: Vec3, theta: number) {
        this.roateAnyWay = true;
        /**
         * 将整个坐标轴旋转，使得旋转轴 p 和 z 轴重合
           再将点 P 绕 z 轴旋转 θ 角
           再将整个坐标轴旋转回原位
         */
        const {x, y, z} = axis.normalize();
        const PI = Math.PI;
        const angle = theta * PI / (180);
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const b = 1 - c
        const roateMatirx = new Mat4([
            c + x*x*b, x*y*b + z*s, x*z*b-y*s,0.0,
            x*y*b-z*s, c+y*y*b, y*z*b+x*s,0.0,
            x*z*b + y*s, y*z*b - x*s, c+z*z*b,0.0,
            0,0,0,1
        ])

        this.roateAnyWayMatirx = roateMatirx;

        return roateMatirx;
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