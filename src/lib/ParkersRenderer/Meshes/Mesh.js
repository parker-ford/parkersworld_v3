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
            for (let i = 0, j = 0; i < this.triangleVertices.length; i += 4, j += 13) {
                vertexData.set(this.triangleVertices.subarray(i, i + 4), j);
                vertexData.set(this.triangleColors.subarray(i, i + 4), j + 4);
                vertexData.set(this.triangleUVs.subarray(i/2, i/2 + 2), j + 8);
                vertexData.set(this.triangleNormals.subarray(i, i + 3), j + 10);
            }
        }
        else{
            vertexData = new Float32Array(this.lineVertices.length + this.lineColors.length + this.lineUVs.length + this.lineNormals.length);
            for (let i = 0, j = 0; i < this.lineVertices.length; i += 4, j += 13) {
                vertexData.set(this.lineVertices.subarray(i, i + 4), j);
                vertexData.set(this.lineColors.subarray(i, i + 4), j + 4);
                vertexData.set(this.lineUVs.subarray(i/2, i/2 + 2), j + 8);
                vertexData.set(this.lineNormals.subarray(i, i + 3), j + 10);
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