import {Vec2, Vec3, Vec4} from './math/Vector'
export function flattenV4(vecs : Vec4[]) {
    const buffer =  new Float32Array(vecs.length * 4)
    vecs.forEach((child, i)=> {
        buffer[0 + 4*i] = child.x
        buffer[1 + 4*i] = child.y
        buffer[2 + 4*i] = child.z
        buffer[3 + 4*i] = child.r
    })

    return buffer
}

export function flatten(vecs : Vec3[]) {
    const buffer =  new Float32Array(vecs.length * 3)
    vecs.forEach((child, i)=> {
        buffer[0 + 3*i] = child.x
        buffer[1 + 3*i] = child.y
        buffer[2 + 3*i] = child.z
    })

    return buffer
}

export function flattenV2(vecs : Vec2[]) {
    const buffer =  new Float32Array(vecs.length * 2)
    vecs.forEach((child, i)=> {
        buffer[0 + 2*i] = child.x
        buffer[1 + 2*i] = child.y
    })

    return buffer
}