export function cross(v1: number[], v2: number[]) {
        return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]]
}

export function sub(v1: number[], v2: number[]) {
    return [v1[0]-v2[0], v1[1]-v2[1],v1[2]-v2[2]]
}

export function normalize(v: number[]) {
    const dis = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])

    if(dis === 0){
        return [0,0,0]
    }
    return [ v[0]/dis, v[1]/dis, v[2]/dis]
}

export function parseOBJ(text: string) {
    // 因为索引是从 1 开始的，所以填充索引为 0 的位置
    const objPositions:number[][] = [];
    const objTexcoords:number[][] = [];
    const objNormals:number[][] = [];

    const vertIndices:number[] = []

    // 和 `f` 一样的索引顺序
    const objVertexData = [
        objPositions,
        objTexcoords,
        objNormals,
    ];

    // 和 `f` 一样的索引顺序
    let webglVertexData: number[][] = [
        [],   // positions
        [],   // texcoords
        [],   // normals
    ];

    function addVertex(vert: string) {
        const ptn = vert.split('/');
        ptn.forEach((objIndexStr, i) => {
            if (!objIndexStr) {
                return;
            }
            const objIndex = parseInt(objIndexStr) - 1;

            if(i === 0){
                vertIndices.push(objIndex)
            }
            const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
            webglVertexData[i].push(...objVertexData[i][index]);
        });
    }

    const keywords : { [key:string] : (parts:string[])=>void } = {
        'v': (parts: string[]) => {
            objPositions.push(parts.map(parseFloat));
        },
        'vn': (parts: string[]) => {
            objNormals.push(parts.map(parseFloat));
        },
        'vt': (parts: string[]) => {
            objTexcoords.push(parts.map(parseFloat));
        },
        'f': (parts: string[]) => {
            const numTriangles = parts.length - 2;
            for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
                
            }
        },
    }

    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        const line = lines[lineNo].trim();
        if (line === '' || line.startsWith('#')) {
            continue;
        }
        const m = keywordRE.exec(line);
        if (!m) {
            continue;
        }
        const [, keyword, unparsedArgs] = m;
        const parts = line.split(/\s+/).slice(1);
        const handler = keywords[keyword];
        if (!handler) {
            console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
            continue;
        }
        handler(parts);
    }

    if(webglVertexData[2].length === 0){
  
        for( let i = 1; i < objPositions.length - 1; i++ ) {
            const v1= sub( objPositions[ vertIndices[0]], objPositions[ vertIndices[i]] )
            const v2= sub( objPositions[ vertIndices[0]], objPositions[ vertIndices[i+1]] )
            const v3 = normalize(cross(v1,v2))

            if(Number.isNaN(v3[0])){
                console.log(v1)
                console.log(v2)
                console.log(i,i+1)
            }

            webglVertexData[2].push(v3[0]);
            webglVertexData[2].push(v3[1]);
            webglVertexData[2].push(v3[2]);

        }

    }

    return {
        position: webglVertexData[0],
        texcoord: webglVertexData[1],
        normal: webglVertexData[2],
    };
}