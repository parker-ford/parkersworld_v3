import { Mesh } from "./Mesh.js";
import { Renderer } from "./Renderer.js";
export class PlaneMesh extends Mesh {
    constructor(options){
        super();
        
        this.calculateVertices(options);
        this.setupVertexBuffer();

        //Hard coded for now
        this.vertexCount = 6;
    }

    //Hard coded for now
    calculateVertices(options){

        // this.positions = new Float32Array(
        //     [
        //         [-0.25, -0.5 * Math.sqrt(3) / 4, 0.0, 1.0],
        //         [0, 0.5 * Math.sqrt(3) / 4, 0.0, 1.0],
        //         [0.25, -0.5 * Math.sqrt(3) / 4, 0.0, 1.0]
        //     ].flat()
        // );
        this.positions = new Float32Array(
            [
                [-0.5, -0.5, 0.0, 1.0],
                [-0.5,  0.5, 0.0, 1.0],
                [ 0.5, -0.5, 0.0, 1.0],

                [-0.5,  0.5, 0.0, 1.0],
                [ 0.5,  0.5, 0.0, 1.0],
                [ 0.5, -0.5, 0.0, 1.0]
            ].flat()
        );

        this.colors = new Float32Array(
            [
                [1.0, 0.0, 0.0, 1.0], 
                [0.0, 1.0, 0.0, 1.0], 
                [0.0, 0.0, 1.0, 1.0],
                [1.0, 0.0, 0.0, 1.0], 
                [0.0, 1.0, 0.0, 1.0], 
                [0.0, 0.0, 1.0, 1.0]
            ].flat()
        )
    }

    //Will add additional vertex data such as normals, uvs, etc.
    setupVertexBuffer(){
        let vertexData = new Float32Array(this.positions.length + this.colors.length);
        for (let i = 0, j = 0; i < this.positions.length; i += 4, j += 8) {
            vertexData.set(this.positions.subarray(i, i + 4), j);
            vertexData.set(this.colors.subarray(i, i + 4), j + 4);
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
}