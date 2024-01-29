import {Renderer} from "./Renderer"

export class Mesh {
    constructor(options){
        this.vertices = null; // vertices will be assigned in subclasses
        this.vertexBuffer = null; // vertexBuffer will be assigned in subclasses
        this.triangleVertices = null;
        this.triangleColors = null;
        this.lineVertices = null;
        this.lineColors = null;
        this.vertexCoordinates = null;
        this.wireframe = options.wireframe || false;
    }
    
    //Will add additional vertex data such as normals, uvs, etc.
    setupVertexBuffer(){

        let vertexData;

        if(this.wireframe == false){
            vertexData = new Float32Array(this.triangleVertices.length + this.triangleColors.length);
            for (let i = 0, j = 0; i < this.triangleVertices.length; i += 4, j += 8) {
                vertexData.set(this.triangleVertices.subarray(i, i + 4), j);
                vertexData.set(this.triangleColors.subarray(i, i + 4), j + 4);
            }
        }
        else{
            vertexData = new Float32Array(this.lineVertices.length + this.lineColors.length);
            for (let i = 0, j = 0; i < this.lineVertices.length; i += 4, j += 8) {
                vertexData.set(this.lineVertices.subarray(i, i + 4), j);
                vertexData.set(this.lineColors.subarray(i, i + 4), j + 4);
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
                ],
                arrayStride: 32,
                stepMode: "vertex",
            }
        ];
    }

    getVertexCount(){
        return this.wireframe ? this.lineVertices.length / 4: this.triangleVertices.length / 4;
    }

}