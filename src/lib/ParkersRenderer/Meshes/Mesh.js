import {Renderer} from "../Renderer"

export class Mesh {
    constructor(options){
        this.vertices = null; // vertices will be assigned in subclasses
        this.vertexBuffer = null; // vertexBuffer will be assigned in subclasses

        this.triangleVertices = null;
        this.triangleColors = null;
        this.triangleUVs = null;
        this.triangleNormals = null;

        this.lineVertices = null;
        this.lineColors = null;
        this.lineUVs = null;
        this.lineNormals = null;

        this.vertexCoordinates = null;
        this.wireframe = options.wireframe || false;
    }
    
    //Will add additional vertex data such as normals, uvs, etc.
    setupVertexBuffer(){

        let vertexData;

        if(this.wireframe == false){
            vertexData = new Float32Array(this.triangleVertices.length + this.triangleColors.length + this.triangleUVs.length + this.triangleNormals.length);
            for (let i = 0, vertex = 0, color = 0, uv = 0, normal = 0; i < vertexData.length; i += 13, vertex += 4, color += 4, uv += 2, normal += 3) {
                vertexData[i] = this.triangleVertices[vertex];
                vertexData[i + 1] = this.triangleVertices[vertex + 1];
                vertexData[i + 2] = this.triangleVertices[vertex + 2];
                vertexData[i + 3] = this.triangleVertices[vertex + 3];

                vertexData[i + 4] = this.triangleColors[color];
                vertexData[i + 5] = this.triangleColors[color + 1];
                vertexData[i + 6] = this.triangleColors[color + 2];
                vertexData[i + 7] = this.triangleColors[color + 3];

                vertexData[i + 8] = this.triangleUVs[uv];
                vertexData[i + 9] = this.triangleUVs[uv + 1];

                vertexData[i + 10] = this.triangleNormals[normal];
                vertexData[i + 11] = this.triangleNormals[normal + 1];
                vertexData[i + 12] = this.triangleNormals[normal + 2];
            }
        }
        else{
            vertexData = new Float32Array(this.lineVertices.length + this.lineColors.length + this.lineUVs.length + this.lineNormals.length);
            // for (let i = 0, j = 0; i < this.lineVertices.length; i += 4, j += 13) {
            //     vertexData.set(this.lineVertices.subarray(i, i + 4), j);
            //     vertexData.set(this.lineColors.subarray(i, i + 4), j + 4);
            //     vertexData.set(this.lineUVs.subarray(i/2, i/2 + 2), j + 8);
            //     vertexData.set(this.lineNormals.subarray(i, i + 3), j + 10);
            // }
            for (let i = 0, vertex = 0, color = 0, uv = 0, normal = 0; i < vertexData.length; i += 13, vertex += 4, color += 4, uv += 2, normal += 3) {
                vertexData[i] = this.lineVertices[vertex];
                vertexData[i + 1] = this.lineVertices[vertex + 1];
                vertexData[i + 2] = this.lineVertices[vertex + 2];
                vertexData[i + 3] = this.lineVertices[vertex + 3];

                vertexData[i + 4] = this.lineColors[color];
                vertexData[i + 5] = this.lineColors[color + 1];
                vertexData[i + 6] = this.lineColors[color + 2];
                vertexData[i + 7] = this.lineColors[color + 3];

                vertexData[i + 8] = this.lineUVs[uv];
                vertexData[i + 9] = this.lineUVs[uv + 1];

                vertexData[i + 10] = this.lineNormals[normal];
                vertexData[i + 11] = this.lineNormals[normal + 1];
                vertexData[i + 12] = this.lineNormals[normal + 2];
            }
        }

        this.vertexBuffer = Renderer.instance.getDevice().createBuffer({
            size: vertexData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        new Float32Array(this.vertexBuffer.getMappedRange()).set(vertexData);
        this.vertexBuffer.unmap();

        this.vertexBufferDescriptors = [
            {
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format: "float32x4"
                    },
                    {
                        shaderLocation: 1,
                        offset: 16,
                        format: "float32x4"
                    },
                    {
                        shaderLocation: 2,
                        offset: 32,
                        format: "float32x2"
                    },
                    {
                        shaderLocation: 3,
                        offset: 40,
                        format: "float32x3"
                    }
                ],
                arrayStride: 52,
                stepMode: "vertex",
            }
        ];
    }

    getVertexCount(){
        return this.wireframe ? this.lineVertices.length / 4: this.triangleVertices.length / 4;
    }

}