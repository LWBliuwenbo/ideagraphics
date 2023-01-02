
// 纹理类 
export class Texture {
    
    static createTexture(gl: WebGL2RenderingContext, imageUrl: string) {
        const image = new Image();
        const texture = gl.createTexture();
        image.onload = ()=> {

        }


    }
}