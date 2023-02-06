export interface BufferAttachment {
    owned: boolean;
    buffer: WebGLFramebuffer | WebGLTexture | null
}

export class FBO {

    lastBuffer: WebGLFramebuffer | null = null;
    colorAttachments: BufferAttachment[] = [];
    depthAttachment: BufferAttachment | null = null;
    width: number;
    height: number;
    fbo: WebGLFramebuffer | null;

    viewport: number[] = [];
    name: string = ""
    gl: WebGL2RenderingContext

    constructor(gl: WebGL2RenderingContext, width: number, height: number, name:string) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.fbo = this.gl.createFramebuffer();
        this.name = name;
    }   

    bind() {
        this.lastBuffer = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)
        // this.gl.getBufferParameter(this)
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);

        this.viewport = this.gl.getParameter(this.gl.VIEWPORT)
        this.gl.viewport(0, 0, this.width, this.height)
    }

    unbind() {
        const x = this.viewport[0]
        const y = this.viewport[1]
        const w = this.viewport[2]
        const h = this.viewport[3]

        this.gl.viewport(x, y, w, h)
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.lastBuffer)
    }

    clear() {
        let mask = 0;
        if (this.colorAttachments.length) {
            mask |= this.gl.COLOR_BUFFER_BIT
        }
        if (this.depthAttachment?.buffer) {
            mask |= this.gl.DEPTH_BUFFER_BIT
        }
        this.gl.clear(mask);
    }

    enableOutPutBuffers(buf0 = -1, buf1 = -1, buf2 = -1, buf3 = -1,
        buf4 = -1, buf5 = -1, buf6 = -1, buf7 = -1) {

        const outputBuffers: number[] = []
        if (buf0 >= 0) { outputBuffers[0] = this.gl.COLOR_ATTACHMENT0 + buf0; }
        if (buf1 >= 0) { outputBuffers[1] = this.gl.COLOR_ATTACHMENT0 + buf1; }
        if (buf2 >= 0) { outputBuffers[2] = this.gl.COLOR_ATTACHMENT0 + buf2; }
        if (buf3 >= 0) { outputBuffers[3] = this.gl.COLOR_ATTACHMENT0 + buf3; }
        if (buf4 >= 0) { outputBuffers[4] = this.gl.COLOR_ATTACHMENT0 + buf4; }
        if (buf5 >= 0) { outputBuffers[5] = this.gl.COLOR_ATTACHMENT0 + buf5; }
        if (buf6 >= 0) { outputBuffers[6] = this.gl.COLOR_ATTACHMENT0 + buf6; }
        if (buf7 >= 0) { outputBuffers[7] = this.gl.COLOR_ATTACHMENT0 + buf7; }

        this.gl.drawBuffers(outputBuffers)
    }

    addColorBuffer(index: number) {
        this.bind();

        // Now setup a texture to render to
        const texture = this.gl.createTexture();

        if (texture) {
            if (!this.colorAttachments[index]) {
                this.colorAttachments[index] = {
                    buffer: texture,
                    owned: true
                }
            } else {
                this.colorAttachments[index].buffer = texture;
            }
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorAttachments[index].buffer);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
            this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        }

        // to (eventually) get mipmapping working, we'll need to do something like:
        // this.gl.glTexParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        // this.gl.glTexParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        // this.gl.glGenerateMipmapEXT(this.gl.TEXTURE_2D);

        // And attach it to the FBO so we can render to it
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0 + index, this.gl.TEXTURE_2D, this.colorAttachments[index].buffer, 0);

        this.unbind();
    }

    addDepthBuffer() {
        const texture = this.gl.createTexture();
        if (!this.depthAttachment) {
            this.depthAttachment = {
                buffer: texture,
                owned: true
            }
        } else {
            this.depthAttachment.buffer = texture;
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthAttachment.buffer);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT24, this.width, this.height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_INT, null);
        this.bind();
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthAttachment.buffer, 0);
        this.unbind();
    }

    attachExistingColorBuffer(index: number, buffer: WebGLFramebuffer | WebGLTexture, takeOwnership: boolean) {
        // attach the given buffer to the FBO

        if (!this.colorAttachments[index]) {
            this.colorAttachments[index] = {
                buffer: buffer,
                owned: takeOwnership
            }
        } else {
            this.colorAttachments[index].buffer = buffer;
            this.colorAttachments[index].owned = takeOwnership;
        }


        this.bind();
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0 + index, this.gl.TEXTURE_2D, this.colorAttachments[index].buffer, 0);
        this.unbind();
    }

    attachExistingDepthBuffer(buffer: WebGLFramebuffer | WebGLTexture, takeOwnership: boolean) {
        if (!this.depthAttachment) {
            this.depthAttachment = {
                buffer: buffer,
                owned: takeOwnership
            }
        } else {
            this.depthAttachment.buffer = buffer;
            this.depthAttachment.owned = takeOwnership;
        }


        this.bind();
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, buffer, 0);
        this.unbind();
    }

    checkStatus() {
        this.bind();
        const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)

        if (status != this.gl.FRAMEBUFFER_COMPLETE) {
            switch (status) {
                case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw new Error("An attachment could not be bound to frame buffer object!");
                    break;
                case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw new Error("Attachments are missing! At least one image (texture) must be bound to the frame buffer object!");
                    break;
                case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw new Error(" Height and width of the attachment are not the same");
                    break;
                case this.gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                    throw new Error("All images must have the same number of multisample samples.");
                    break;
                case this.gl.FRAMEBUFFER_UNSUPPORTED:
                    throw new Error("Attempt to use an unsupported format combinaton!");
                    break;
                default:
                    throw new Error(status + "::Unknown error while attempting to create frame buffer object!");
                    break;
            }
        }

        this.unbind();
        return true
    }


}