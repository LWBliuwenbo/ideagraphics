// 观察

import { Mat4 } from "./math/Mat";
import { Vec3 } from "./math/Vector";

export class Camera {

    viewPosition:Vec3 = new Vec3();

    at : Vec3 = new Vec3();

    up: Vec3 = new Vec3();

    // 模视变换矩阵 
    modelViewMatrix: Mat4 = new Mat4([])
    // 投影变换矩阵
    projectionMatrix : Mat4 = new Mat4([])

    // 生成 model-view
    /**
     * v = a - e
     * n = v × up / | v × up |
     * u = n × v / | n × v |
     * v = -v 
     * return
     * 
     * n[x] n[y] n[z]  -a·n
     * u[x] u[y] u[z]  -a·u
     * v[x] v[y] v[z]  -a·v
     * 0    0    0     1.0
     */

    setViewPosition(pos: Vec3) {
        this.viewPosition = pos;
        this.lookAt(pos, this.at, this.up)
    }

    lookAt(eye: Vec3, at: Vec3, up: Vec3 ) {
        const  v = at.sub(eye).normalize();
        const n = v.cross(up).normalize();
        const u = n.cross(v).normalize();
        const bv = v.burden();
        this.modelViewMatrix = new Mat4([
            n.x, u.x, bv.x, 0,
            n.y, u.y, bv.y, 0,
            n.z, u.z, bv.z, 0,
            -n.dot(eye), -u.dot(eye), -bv.dot(eye), 1.0
        ])

        this.viewPosition = eye;
        this.up = up;
        this.at = at;

        return this;
    }
    // 生成正投影
    ortho(left: number, right: number, bottom: number, top: number, far: number, near: number) {
        this.projectionMatrix =  new Mat4([
            2/(right-left), 0, 0, 0,
            0, 2/(top-bottom), 0, 0,
            0,0, -2/(far-near),0,
            -(right+left)/(right-left), -(top+bottom)/(top-bottom),
            -(far+near)/(far-near), 1 
        ])

        return this;
    }

    // 生成透视投影
    frustum(left: number, right: number, bottom: number, top: number, far: number, near: number) {
        this.projectionMatrix = new Mat4([
            (-2*near)/(right-left), 0, 0, 0,
            0, -2*near/(top-bottom), 0, 0,
            (right+left)/(right-left), (top+bottom)/(top-bottom),
            -(far+near)/(far-near), -1, 
            0,0, 2/(far-near),0,
        ])

        return this
    }

     radians( degrees:number ) {
        return degrees * Math.PI / 180.0;
    }

    persective(fovy: number, aspect: number, near: number, far: number) {

        const f = 1.0 / Math.tan( this.radians(fovy) / 2 );
        const d = far - near;
        /*
        *   
            left = -right
            bottom = -top

            return frustum(left, right, bottom, top, far, near)
        */

        this.projectionMatrix = new Mat4([
            f/aspect, 0,0,0,
            0, f, 0,0,
            0,0, -(near + far) / d, -1,
            0,0,-2 * near * far / d,0
        ])

    

        return this;
    }



    roateViewX(deg:number) {
        const PI = 3.1415926;
        const angle = deg * PI / (180);
        const c = Math.cos(angle)
        const s = Math.sin(angle);
        // 绕x 轴旋转
        this.setViewPosition(Mat4.multVe3(this.viewPosition, 
            new Mat4([
                1.0,  0.0,  0.0, 0.0,
                0.0,  c,  s, 0.0,
                0.0, -s,  c, 0.0,
                0.0,  0.0,  0.0, 1.0
            ])))
    }

    roateViewY(deg:number) {
        const PI = 3.1415926;
        const angle = deg * PI / (180);
        const c = Math.cos(angle)
        const s = Math.sin(angle);
        // 绕x 轴旋转
        this.setViewPosition( Mat4.multVe3(this.viewPosition, 
            new Mat4([
                c, 0.0, -s, 0.0,
                0.0, 1.0,  0.0, 0.0,
                s, 0.0,  c, 0.0,
                0.0, 0.0,  0.0, 1.0
            ])))

    }



    
}