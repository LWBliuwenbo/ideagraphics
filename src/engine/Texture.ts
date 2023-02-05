
// 纹理类 

export let GLOBAL_INDEX = -1;


interface TextureIndexMap {
    [key: string]: number
}
const getTextureIndex = (gl: WebGL2RenderingContext, index: number): number | undefined => {

    const TEXTURE_INDEX_MAP: TextureIndexMap = {
        0: gl.TEXTURE0,
        1: gl.TEXTURE1,
        2: gl.TEXTURE2,
        3: gl.TEXTURE3,
        4: gl.TEXTURE4,
        5: gl.TEXTURE5,
        6: gl.TEXTURE6,
        7: gl.TEXTURE7,
        8: gl.TEXTURE8,
        9: gl.TEXTURE9,
        10: gl.TEXTURE10,
        11: gl.TEXTURE11,
        12: gl.TEXTURE12,
    }

    return TEXTURE_INDEX_MAP[index]
}

export class Texture {

    texture: WebGLTexture | null = null;

    textureType: number = 0

    textureIndex: number = 0


    image: ImageData | null = null;

    w() {
        if (this.image) {
            return this.image.width
        }
        return 0
    }

    h() {
        if (this.image) {
            return this.image.height
        }

        return 0
    }

    static createTexture(gl: WebGL2RenderingContext, imageUrl: string) {
        return new Promise((resolve) => {

            const image = new Image();
            const result = new Texture();
            const texture = gl.createTexture();
            const texture_index = getTextureIndex(gl, ++GLOBAL_INDEX)

            if (texture_index !== undefined) {
                result.textureIndex = texture_index;
                result.textureType = gl.TEXTURE_2D
            }

            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


                // Prevents s-coordinate wrapping (repeating).
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                // Prevents t-coordinate wrapping (repeating).
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);

                result.texture = texture;
                resolve(result)
            }

            image.src = imageUrl;

        })

    }

    static createTextureWithImageData(gl: WebGL2RenderingContext, imageData: ImageData) {


        const result = new Texture();

        const texture_index = getTextureIndex(gl, ++GLOBAL_INDEX)

        if (texture_index !== undefined) {
            result.textureIndex = texture_index;
            result.textureType = gl.TEXTURE_2D
        }

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);


        // Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // Prevents t-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        result.texture = texture;
        return result;

    }

    static createCubeTexture(gl: WebGL2RenderingContext, width: number, height: number, imageUrls: string[]) {
        const targets =
            [gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
        let load_finish = false;
        // const texImageData = new ImageData(6 * width, height);
        return new Promise((resolve) => {
            const result = new Texture();
            const texture_index = getTextureIndex(gl, ++GLOBAL_INDEX)

            result.textureType = gl.TEXTURE_CUBE_MAP
            if (texture_index !== undefined) {
                result.textureIndex = texture_index;
            }

            const cubeEnvTex = gl.createTexture();

            const faceNum = imageUrls.length
            for (let i = 0; i < faceNum; i++) {
                const image = new Image();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeEnvTex)

                image.onload = () => {
                    console.log(width,height)
                    gl.texImage2D(targets[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);


                    // if (imagegl) {
                    //     imagegl.drawImage(image, 0, 0, width, height);
                    //     const imageData = imagegl.getImageData(0, 0, width, height);
                    //     if (!imageData) {
                    //         return
                    //     }
                    //     for (let row = 0; row < height; row++) {

                    //         for (let col = 0; col < width; col++) {

                    //             const base_px_index = (row  * width  + col) * 4;
                    //             const target_px_index = (width * faceNum * (row - 1) + i * width + col)*4;
                    //             texImageData.data[target_px_index] = imageData.data[base_px_index]
                    //             texImageData.data[target_px_index + 1] = imageData.data[base_px_index + 1]
                    //             texImageData.data[target_px_index + 2] = imageData.data[base_px_index + 2]
                    //             texImageData.data[target_px_index + 3] = imageData.data[base_px_index + 3]

                    //         }
                    //     }



                        if (i === imageUrls.length - 1) {
                            load_finish = true;
                        }

                        if (load_finish) {
                            // gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    
                            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                            result.texture = cubeEnvTex;
                            resolve(result)
                        }
                    // }
                }
                image.src = imageUrls[i];
            }
        })

    }


}