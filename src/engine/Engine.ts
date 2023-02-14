import { Mesh } from "./mesh/Mesh"
import fragString from '../shader/PBR.frag.glsl?raw'
import vertexString from '../shader/PBR.vertex.glsl?raw'
import {Shader} from "./Shader"
import { Camera } from "./Camera"
import {  Light } from "./Light"
import { EventSystem } from './EventSystem'
// import { IBL } from "./ibl/IBL"
import { Env } from "./env/Env"
import { Texture } from "./Texture"
import { Material } from "./Material"
import { CameraView } from "./mesh/CameraView"
import { Vec3 } from "./math/Vector"

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

    cameraviewer:CameraView | null;

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

    // ibl: IBL | null = null

    env: Env | null = null

    enableHover: boolean = false
    hoverPoint:{x: number, y: number} = {x:-10,y:-10} 

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
        this.cameraviewer = null;
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
    addModel(geo: Mesh){
        this.scene.push(geo)
        if(this.env){
            this.env.models = this.scene
        }
    }

    setCameraViewer(cameraviewer: CameraView) {
        this.cameraviewer = cameraviewer;
    }

    /**设置 摄像机 */
    setCamera(camera: Camera) {
        this.camera = camera;
    }
    /**设置 光照 */
    setLight(light: Light) {
        this.light = light;
    }

    updateMaterial(index: number, material: Material) {
        if(this.scene[index]){
            this.scene[index].material.setProps(material)
        }
    }

    updateLight(light:Light) {
         this.light.setProps(light)
         this.drawInitLight();
         this.clearAnimate();
         this.render();
    }

    updateCamera(camera: Camera) {
        this.camera.update(camera)
        this.drawInitCamera();
        this.clearAnimate();
        this.render();
    }

    upateEnv(phi: number, theta:number){
        if(this.env != null){
            this.env.envPhi = phi;
            this.env.envTheta = theta
            this.env.lookAtEnv();
            this.clearAnimate();
            this.render();
        }
    }

    enableHoverByNormal(enable: boolean) {
        if(enable){
            this.enableHover = enable;
            this.gl.canvas.addEventListener('mousemove', (e)=> {
                const {offsetX, offsetY} = e as MouseEvent;
                this.hoverPoint.x = (offsetX/this.gl.canvas.width)*2 - 1;
                this.hoverPoint.y = (offsetY/this.gl.canvas.height)*-2 + 1;
            })
        }
    }

    // setIBL( ibl:IBL ) {
    //     this.ibl = ibl;
    // }

    setEnv(CubeTexture: Texture| null) {
        if(CubeTexture === null){
            this.env = null
            return
        }
        this.env = new Env(this.gl, CubeTexture, this.scene, this.light )
        this.env.models = this.scene
    }

    drawInit() {
        console.log(this.canvas.width, this.canvas.height)
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
        this.shader.enable();
        this.shader?.setUniform3fv('viewPosition', this.camera.viewPosition)
        this.shader?.setUniformMat4fv('viewMatrix', this.camera.modelViewMatrix)
        // const normalMatrix = this.camera.modelViewMatrix.inverse()
        // this.shader?.setUniformMat4fv('normalMatrix', normalMatrix)
        this.shader?.setUniformMat4fv('projectionMatrix', this.camera.projectionMatrix)
    }

    drawInitLight () {
        // Light
        this.shader.enable();
        this.shader.setUniform3fv( "incidentVector", this.light.incidentVector );
        this.shader.setUniformf( "incidentTheta", this.light.inTheta );
        this.shader.setUniformf( "incidentPhi", this.light.inPhi );
        this.shader.setUniformf( "brightness", this.light.brightness );
        this.shader.setUniformf( "gamma", this.light.gamma );
        this.shader.setUniformf( "exposure", this.light.exposure );
        this.shader.setUniformf( "useNDotL", this.light.useNDotL ? 1.0 : 0.0 );
        this.shader.setUniformf( "enableHover", this.enableHover ? 1.0 : 0.0 );
        
    }

  
    /**引擎管线：渲染函数 */
    render(predeal?:()=>void) {

        predeal && predeal();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        this.cameraviewer?.draw();
        
        this.shader.enable();
        if(this.env){
            this.env.draw(this.shader);
        }else {
            this.scene.forEach((mesh:Mesh)=> {

                mesh.material.draw(this.shader);
                if(mesh.hovercheck && this.enableHover){
                    mesh.draw(this.shader, new Vec3(this.hoverPoint.x, this.hoverPoint.y, 0), this.camera.viewPosition, this.camera.projectionMatrix, this.camera.modelViewMatrix)
                }else {
                    mesh.draw(this.shader)
                }
            })
        }

        this.animateid = requestAnimationFrame(this.render.bind(this, predeal))


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
        if(this.env){
            this.env.models = this.scene
        }
        this.clearAnimate();
    }
}
