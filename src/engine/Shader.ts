import { Mat4 } from "./math/Mat"
import { Vec3,Vec4 } from "./math/Vector"

export class Shader {
    uniforms: string[]
    uniformLocs: { [uniform: string]: WebGLUniformLocation } = {}
    program: WebGLProgram
    gl: WebGL2RenderingContext
    constructor(gl: WebGL2RenderingContext, uniforms: string[], vertexShader?: string, fragmentShader?: string) {
        this.uniforms = uniforms
        this.gl = gl;
        this.program = this.initShaders(gl, vertexShader, fragmentShader)
        this.getUniformsLocation();
    }
    setUniformf(uniform: string, value: number) {
        this.gl.uniform1f(this.uniformLocs[uniform], value)
    }
    setUniform3fv(uniform: string, value: Vec3) {
        this.gl.uniform3fv(this.uniformLocs[uniform], value.flattrn())
    }
    setUniform4fv(uniform: string, value: Vec4) {
        this.gl.uniform4fv(this.uniformLocs[uniform], value.flattrn())
    }
    setUniformi(uniform: string, i: number) {
        this.gl.uniform1i(this.uniformLocs[uniform], i)
    }
    setUniformMat4fv(uniform:string, mat4: Mat4 ) {
        this.gl.uniformMatrix4fv(this.uniformLocs[uniform], false, mat4.flattrn());
    }
    getUniformsLocation() {
       this.uniforms.forEach((uniform) => {
            const loc = this.gl.getUniformLocation(this.program, uniform)
            if (loc === null) {
                return
            }
            this.uniformLocs[uniform] = loc;
        })
    }

    initShaders(gl: WebGL2RenderingContext, vertexShader?: string, fragmentShader?: string) {
        let vertShdr;
        let fragShdr;

        let program = gl.createProgram();

        if (program == null) throw new Error('创建着色器program失败')

        if (vertexShader) {
            vertShdr = gl.createShader(gl.VERTEX_SHADER);
            if (vertShdr == null) throw new Error('创建顶点着色器失败')
            gl.shaderSource(vertShdr, vertexShader);
            gl.compileShader(vertShdr);
            if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
                let msg = "Vertex shader '"
                    + "' failed to compile.  The error log is:\n\n"
                    + gl.getShaderInfoLog(vertShdr);

                throw new Error(msg)
            }
            gl.attachShader(program, vertShdr);
        }


        if (fragmentShader) {

            fragShdr = gl.createShader(gl.FRAGMENT_SHADER);

            if (fragShdr == null) throw new Error('创建顶点着色器失败')
            gl.shaderSource(fragShdr, fragmentShader);
            gl.compileShader(fragShdr);
            if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
                let msg = "Fragment shader '"
                    + "' failed to compile.  The error log is:\n\n"
                    + gl.getShaderInfoLog(fragShdr);
                throw new Error(msg)
            }
            gl.attachShader(program, fragShdr);
        }



        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            let msg = "Shader program failed to link.  The error log is:\n\n"
                + gl.getProgramInfoLog(program);
            throw new Error(msg)
        }

        return program
    }
}