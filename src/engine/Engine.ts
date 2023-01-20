import { Mesh } from "./mesh/Mesh"
import fragString from '../shader/PBR.frag.glsl?raw'
import vertexString from '../shader/PBR.vertex.glsl?raw'
import {Shader} from "./Shader"
import { Camera } from "./Camera"
import {  Light } from "./Light"
import { EventSystem } from './EventSystem'

/**
 * 引擎类: 用于实例化化图形引擎
 * 可以设置 Light, Camera, 为Scene 添加Mesh 开启事件监听
 */

export default  class Engine {
    /** webgl 上下文，根据初始化canvas获取 */
    gl : WebGL2RenderingContext

    /** canvas 引擎初始化的画布 */
    canvas : HTMLCanvasElement

    /** scene 场景 */
    scene: Mesh[]

    /** camera 摄像机 */
    camera: Camera

    /** light 光照 */
    light: Light

    /** 基础着色器 */
    transformShader: Shader | null
    
    /** 事件系统 */
    eventSystem:EventSystem

    /** 渲染循环ID */
    animateid:number| null

    shader:Shader

    /**
     * Engine 构造器
     *
     * @param id 引擎初始画布元素 id
     */
    constructor(id: string) {
        const el = document.getElementById(id)

        if(el == null){
            throw new Error('画布不存在')
        }

        this.canvas = el as HTMLCanvasElement;

        const gl = this.canvas.getContext('webgl2')

        if(!gl){
            throw new Error('不支持webgl2')
        }
        
        this.gl = gl;
        this.shader = new Shader(this.gl, vertexString, fragString)
        this.scene = []
        this.transformShader = null
        this.camera = new Camera();
        this.light = new Light();
        this.eventSystem = new EventSystem(this);
        this.animateid = null;
    }
    /** 
     *  添加鼠标移动监听
     * @param callback 监听回调函数
    */
    addMouseMoveListener(callback:(degx: number, degy: number)=> void) {
        this.eventSystem.addMoveEventListener(callback);
    }
    /**
     *  移除鼠标移动监听
     */
    removeMouseMoveListener() {
        this.eventSystem.removeMoveEventListener();
    }

    /** 添加Mesh */
    addGeo(geo: Mesh){
        this.scene.push(geo)
    }

    /**设置 摄像机 */
    setCamera(camera: Camera) {
        this.camera = camera;
    }
    /**设置 光照 */
    setLight(light: Light) {
        this.light = light;
    }

    drawInit() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.shader.program)
        this.drawInitCamera();
        this.drawInitLight();
    }

    drawInitCamera() {
        // this.shader.setUniform3fv('uTheta', geo.roateTheta)
        // this.shader.setUniform3fv('uTranslate', geo.tranlate)
        // this.shader.setUniform3fv('uScale', geo.scale)
        // Camera
        this.shader?.setUniform3fv('viewPosition', this.camera.viewPosition)
        this.shader?.setUniformMat4fv('modelViewMatrix', this.camera.modelViewMatrix)
        this.shader?.setUniformMat4fv('projectionMatrix', this.camera.projectionMatrix)

    }

    drawInitLight () {
        // Light
        
        this.shader.setUniform3fv( "incidentVector", this.light.incidentVector );
        this.shader.setUniformf( "incidentTheta", this.light.inTheta );
        this.shader.setUniformf( "incidentPhi", this.light.inPhi );
        this.shader.setUniformf( "brightness", this.light.brightness );
        this.shader.setUniformf( "gamma", this.light.gamma );
        this.shader.setUniformf( "exposure", this.light.exposure );
        this.shader.setUniformf( "useNDotL", this.light.useNDotL ? 1.0 : 0.0 );
    }

  
    /**引擎管线：渲染函数 */
    render( ) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        this.scene.forEach((mesh:Mesh)=> {
            mesh.draw(this.shader)
            mesh.material.draw(this.shader);
        })


       this.animateid = requestAnimationFrame(this.render.bind(this))


    }
    /**引擎管线：清除动画 */
    clearAnimate() {
        if(this.animateid){
            window.cancelAnimationFrame(this.animateid)
        }
    }
    /**引擎管线：清除场景和动画 */
    clear() {
        this.scene = []
        this.clearAnimate();
    }
}
