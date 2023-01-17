import { Geometric } from "./Geometric"
import { Vec4,Vec3, Vec2 } from "./math/Vector"
import fragString from '../shader/PBR.frag.glsl?raw'
import vertexString from '../shader/PBR.vertex.glsl?raw'
import {Shader} from "./Shader"
import { Camera } from "./Camera"
import {  PbrLight } from "./Light"
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
    scene: Geometric[]

    /** camera 摄像机 */
    camera: Camera

    /** light 光照 */
    light: PbrLight

    /** 基础着色器 */
    transformShader: Shader | null
    
    /** 事件系统 */
    eventSystem:EventSystem

    /** 渲染循环ID */
    animateid:number| null

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
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
        gl.enable(gl.DEPTH_TEST);
        
        this.gl = gl;
        this.scene = []
        this.transformShader = null
        this.camera = new Camera();
        this.light = new PbrLight();
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
    addGeo(geo: Geometric){
        this.scene.push(geo)
    }


    flatten(vecs : Vec4[]) {
        const buffer =  new Float32Array(vecs.length * 4)
        vecs.forEach((child, i)=> {
            buffer[0 + 4*i] = child.x
            buffer[1 + 4*i] = child.y
            buffer[2 + 4*i] = child.z
            buffer[3 + 4*i] = child.r
        })

        return buffer
    }

    flattenV3(vecs : Vec3[]) {
        const buffer =  new Float32Array(vecs.length * 3)
        vecs.forEach((child, i)=> {
            buffer[0 + 3*i] = child.x
            buffer[1 + 3*i] = child.y
            buffer[2 + 3*i] = child.z
        })

        return buffer
    }

    flattenV2(vecs : Vec2[]) {
        const buffer =  new Float32Array(vecs.length * 2)
        vecs.forEach((child, i)=> {
            buffer[0 + 2*i] = child.x
            buffer[1 + 2*i] = child.y
        })

        return buffer
    }

    /**设置 摄像机 */
    setCamera(camera: Camera) {
        this.camera = camera;
    }
    /**设置 光照 */
    setLight(light: PbrLight) {
        this.light = light;
    }
    /**引擎管线：设置着色器属性 */
    pipelineSetShaderAttr(shader: Shader, geo: Geometric) {

        const {gl} = this;
        gl.useProgram(shader.program);

        //法向量
        const nBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flattenV3(geo.normals), gl.STATIC_DRAW)

        const nLoc = gl.getAttribLocation(shader.program, "aNormal");
        gl.vertexAttribPointer(nLoc, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(nLoc)

        // const cBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
        // gl.bufferData(gl.ARRAY_BUFFER, this.flatten(geo.colors), gl.STATIC_DRAW)

        // const cLoc = gl.getAttribLocation(shader.program, 'aColor')
        // gl.vertexAttribPointer( cLoc, 4, gl.FLOAT, false, 0, 0)
        // gl.enableVertexAttribArray(cLoc) 


        // 顶点位置
        const vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flattenV3(geo.positions), gl.STATIC_DRAW)

        const pLoc = gl.getAttribLocation(shader.program, "aPosition");
        gl.vertexAttribPointer(pLoc, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pLoc)


        //纹理坐标
        const textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flattenV2(geo.textureCoords), gl.STATIC_DRAW) 

        const textureLoc = gl.getAttribLocation(shader.program, "aTextureCoord");
        gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(textureLoc)

        //法相切线
        const tangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flattenV3(geo.tagents), gl.STATIC_DRAW) 

        const tanagentLoc = gl.getAttribLocation(shader.program, "aTangent");
        gl.vertexAttribPointer(tanagentLoc, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(tanagentLoc)

        //次切线
        const bitanBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bitanBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,  this.flattenV3(geo.bitagents), gl.STATIC_DRAW) 

        const bitanLoc = gl.getAttribLocation(shader.program, "aBitangent");
        gl.vertexAttribPointer(bitanLoc, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(bitanLoc)
        
        if(geo.indices.length > 0){
            const elementBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geo.indices), gl.STATIC_DRAW);
        }

    }
    /**引擎管线：初始化着色器 */
    pipelineTransformShaderInit(geo: Geometric) {
        this.transformShader = new Shader(this.gl, 
            ['uTheta', 'uTranslate', 'uScale', 
             'uModelView', 'uProject',
             'uLightAmbient', 'uLightDiffuse', 'uLightSpecular','uLightColor',
             'uLightPosition', 'uShininess', 'uViewPosition', 'uLightType','uLightItensity','ulightInvRadius',
             'uMaterialDiffuse','uMaterialSpecular', 'uMaterialNormalMap',
             'metallic', 'subsurface', 'specular', 'roughness', 'specularTint', 'anisotropic', 'sheen', 'sheenTint', 'clearcoat', 'clearcoatGloss'
        ], vertexString, fragString )

        this.pipelineSetShaderAttr(this.transformShader, geo) 
        // 模视 和 投影变换

        


        // 光照
        this.transformShader.setUniform4fv('uLightColor', this.light.lightColor )
        this.transformShader.setUniform4fv('uLightAmbient', this.light.lightAmbient )
        this.transformShader.setUniform4fv('uLightDiffuse', this.light.lightDiffuse )
        this.transformShader.setUniform4fv('uLightSpecular', this.light.lightSpecular )
        // this.transformShader.setUniform4fv('uLightPosition', this.light.lightPosition)
         this.transformShader.setUniform3fv('uLightPosition', this.light.position)
         this.transformShader.setUniformi('uLightType', this.light.type)
         this.transformShader.setUniformf('uLightItensity', this.light.itensity)
         this.transformShader.setUniformf('ulightInvRadius', this.light.falloffradius)
         this.transformShader.setUniform3fv('uLightColor', this.light.color)
        
        // 材质
        this.transformShader.setUniformf('uShininess', geo.pbrmaterial.materialShininess)
        // PBR 材质
        this.transformShader.setUniformf('metallic', geo.pbrmaterial.metallic)
        this.transformShader.setUniformf('subsurface', geo.pbrmaterial.subsurface)
        this.transformShader.setUniformf('specular', geo.pbrmaterial.specular)
        this.transformShader.setUniformf('roughness', geo.pbrmaterial.roughness)
        this.transformShader.setUniformf('specularTint', geo.pbrmaterial.specularTint)
        this.transformShader.setUniformf('sheen', geo.pbrmaterial.sheen)
        this.transformShader.setUniformf('sheenTint', geo.pbrmaterial.sheenTint)
        this.transformShader.setUniformf('clearcoat', geo.pbrmaterial.clearcoat)
        this.transformShader.setUniformf('clearcoatGloss', geo.pbrmaterial.clearcoatGloss)



        
        // 漫反射贴图
        this.gl.activeTexture(this.gl.TEXTURE0)
        this.gl.bindTexture(this.gl.TEXTURE_2D, geo.pbrmaterial.matrialDiffuseTexture.texture)
        this.transformShader.setUniformi('uMaterialDiffuse', 0)

        // 镜面反色贴图
        // this.gl.activeTexture(this.gl.TEXTURE1)
        // this.gl.bindTexture(this.gl.TEXTURE_2D, geo.material.matrialSpecularTexture.texture)
        // this.transformShader.setUniformi('uMaterialSpecular', 1)

        // 法向贴图
        this.gl.activeTexture(this.gl.TEXTURE1)
        this.gl.bindTexture(this.gl.TEXTURE_2D, geo.pbrmaterial.normalMap.texture)
        this.transformShader.setUniformi('uMaterialNormalMap', 1)
    
    }
    /**引擎管线：设置基础着色器通用变量 */
    pipelineTransformRender(geo: Geometric) {
        if(this.transformShader){
            this.transformShader.setUniform3fv('uTheta', geo.roateTheta)
            this.transformShader.setUniform3fv('uTranslate', geo.tranlate)
            this.transformShader.setUniform3fv('uScale', geo.scale)
            this.transformShader?.setUniform3fv('uViewPosition', this.camera.viewPosition)
            this.transformShader?.setUniformMat4fv('uModelView', this.camera.modelViewMatrix)
            this.transformShader?.setUniformMat4fv('uProject', this.camera.projectionMatrix)
        }
    }
    /**引擎管线：渲染函数 */
    pipelineRender( ) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        this.scene.forEach((geo)=> {
            this.pipelineTransformShaderInit(geo);
            this.pipelineTransformRender(geo)
            geo.draw(this.gl)
        })


       this.animateid = requestAnimationFrame(this.pipelineRender.bind(this))


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
