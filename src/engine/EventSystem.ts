import Engine from "./Engine";
import { Mat4 } from "./math/Mat";
import { Vec2 } from "./math/Vector";
import _ from 'lodash'

export class EventSystem{

    engine: Engine;
    startposition = new Vec2();
    isstartmove = false;
    constructor(engine:Engine) {
        this.engine = engine;
    }

     throttle(fn:Function, delay:number) {
        let previous = 0;
        let that = this;
        // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
        return function() {
            let args = arguments;
            let now = new Date().getTime();
            if(now - previous > delay) {
                fn.apply(that, args);
                previous = now;
            }
        }
      }
    moveStart(e: MouseEvent) {
        this.isstartmove = true;
        const {x, y} = e;
        this.startposition.x = x;
        this.startposition.y = y;
    }
    moveRoate(e: MouseEvent) {
        if(!this.isstartmove){
            return false;
        }
        const {x, y} = e;
        const newposition = new Vec2(x, y)
        const direct = newposition.sub(this.startposition);

            this.roateViewX(-direct.y / this.engine.canvas.width )
        
        
            this.roateViewY(-direct.x/ this.engine.canvas.height)

        
    }

    moveUp() {
        this.isstartmove = false
    }
    removeMoveEventListener() {
        this.engine.canvas.removeEventListener('mousedown', _.throttle(this.moveStart.bind(this), 10) )
        this.engine.canvas.removeEventListener('mousemove', _.throttle(this.moveRoate.bind(this), 10))
    }
    addMoveEventListener() {
        this.startposition = new Vec2();
        this.engine.canvas.addEventListener('mousedown', this.moveStart.bind(this))
        this.engine.canvas.addEventListener('mousemove', this.moveRoate.bind(this))
        this.engine.canvas.addEventListener('mouseup', this.moveUp.bind(this))
    }


    roateViewX(deg:number) {
        const PI = 3.1415926;
        const angle = deg * PI / (90);
        const c = Math.cos(angle)
        const s = Math.sin(angle);
        // 绕x 轴旋转
        this.engine.camera.setViewPosition(Mat4.multVe3(this.engine.camera.viewPosition, 
            new Mat4([
                1.0,  0.0,  0.0, 0.0,
                0.0,  c,  s, 0.0,
                0.0, -s,  c, 0.0,
                0.0,  0.0,  0.0, 1.0
            ])))
    }

    roateViewY(deg:number) {
        const PI = 3.1415926;
        const angle = deg * PI / (90);
        const c = Math.cos(angle)
        const s = Math.sin(angle);
        // 绕x 轴旋转
        this.engine.camera.setViewPosition( Mat4.multVe3(this.engine.camera.viewPosition, 
            new Mat4([
                c, 0.0, -s, 0.0,
                0.0, 1.0,  0.0, 0.0,
                s, 0.0,  c, 0.0,
                0.0, 0.0,  0.0, 1.0
            ])))

    }

    
}