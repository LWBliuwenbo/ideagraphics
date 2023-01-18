import Engine from "./Engine";
import { Vec2 } from "./math/Vector";

export class EventSystem{

    engine: Engine;
    startposition = new Vec2();
    isstartmove = false;

    moveCallback: ((e: MouseEvent)=> void)|null = null;
    moveStartCallback: ((e: MouseEvent) =>void)|null = null;
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
    moveRoate(e: MouseEvent, callback: (degX: number, degY: number)=>void ) {
        if(!this.isstartmove){
            return ;
        }
        const {x, y} = e;
        const newposition = new Vec2(x, y)
        const direct = newposition.sub(this.startposition);
        const degx = direct.y / this.engine.canvas.width * 90 /2
        const degy = direct.x/ this.engine.canvas.height * 90 /2
        callback(degx, degy);        
    }

    moveUp() {
        this.isstartmove = false
    }
    removeMoveEventListener() {
        if(this.moveCallback){
            this.engine.canvas.removeEventListener('mousemove', this.moveCallback )
        }
        if(this.moveStartCallback){
            this.engine.canvas.removeEventListener('mousedown', this.moveStartCallback)
        }
    }
    addMoveEventListener(callback:( degX: number, degY: number ) =>  void) {
        this.startposition = new Vec2();
        this.moveCallback =  (e: MouseEvent)=> this.moveRoate(e, callback)
        this.moveStartCallback = this.moveStart.bind(this);
        this.engine.canvas.addEventListener('mousedown', this.moveStart.bind(this))
        this.engine.canvas.addEventListener('mousemove', this.moveCallback)
        this.engine.canvas.addEventListener('mouseup', this.moveUp.bind(this))
    }

    
}