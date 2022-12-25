

export class Transform{
    // roateMat: Mat4 
    roateTheta: number[] = [0,0,0]
    tranlate: number[] = [0,0,0]
    scale: number[] = [1,1,1]


    roateX(deg: number) {
        this.roateTheta[0] = deg
    }

    roateY(deg: number) {
        this.roateTheta[1] = deg
    }

    roateZ(deg: number) {
        this.roateTheta[2] = deg
    }

    tranlateX(distance: number){
        this.tranlate[0] = distance
    }
    tranlateY(distance: number){
        this.tranlate[1] = distance
    }

    tranlateZ(distance: number){
        this.tranlate[2] = distance
    }

    scaleX(distance: number){
        this.scale[0] = distance
    }
    scaleY(distance: number){
        this.scale[1] = distance
    }

    scaleZ(distance: number){
        this.scale[2] = distance
    }
}