import { Mesh } from "./Mesh.js";
import { Renderer } from "./Renderer.js";
export class PlaneMesh extends Mesh {
    constructor(options){
        super();
        this.wireframe = options.wireframe || false; 
        this.calculateVertices();
        this.setupVertexBuffer(options);

        //Hard coded for now
        this.vertexCount = 6;
    }


    //Hard coded for now
    getVertexCount(){
        return this.wireframe ? 10 : 6;
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
        this.vertexCoordinates = [
            [-0.5, -0.5, 0.0, 1.0], //0
            [-0.5,  0.5, 0.0, 1.0], //1
            [ 0.5, -0.5, 0.0, 1.0], //2
            [ 0.5,  0.5, 0.0, 1.0]  //3
        ]
        this.positionsTriangle = new Float32Array(
            [
                this.vertexCoordinates[0],
                this.vertexCoordinates[1],
                this.vertexCoordinates[2],

                this.vertexCoordinates[1],
                this.vertexCoordinates[3],
                this.vertexCoordinates[2],

            ].flat()
        );

        this.colorsTriangle = new Float32Array(
            [
                [1.0, 0.0, 0.0, 1.0], 
                [0.0, 1.0, 0.0, 1.0], 
                [0.0, 0.0, 1.0, 1.0],
                [1.0, 0.0, 0.0, 1.0], 
                [0.0, 1.0, 0.0, 1.0], 
                [0.0, 0.0, 1.0, 1.0]
            ].flat()
        );

        this.positionsLine = new Float32Array(
            [
                this.vertexCoordinates[0],
                this.vertexCoordinates[1],

                this.vertexCoordinates[1],
                this.vertexCoordinates[2],

                this.vertexCoordinates[2],
                this.vertexCoordinates[0],

                this.vertexCoordinates[1],
                this.vertexCoordinates[3],

                this.vertexCoordinates[3],
                this.vertexCoordinates[2],
            ].flat()
        );

        this.colorsLine = new Float32Array(
            [
                [1.0, 0.0, 0.0, 1.0], 
                [1.0, 0.0, 0.0, 1.0], 

                [0.0, 1.0, 0.0, 1.0], 
                [0.0, 1.0, 0.0, 1.0], 

                [0.0, 0.0, 1.0, 1.0],
                [0.0, 0.0, 1.0, 1.0],

                [1.0, 0.0, 0.0, 1.0], 
                [1.0, 0.0, 0.0, 1.0], 

                [0.0, 1.0, 0.0, 1.0], 
                [0.0, 1.0, 0.0, 1.0], 
            ].flat()
        )

    }

    //Will add additional vertex data such as normals, uvs, etc.
    setupVertexBuffer(){

        let vertexData;

        if(this.wireframe == false){
            vertexData = new Float32Array(this.positionsTriangle.length + this.colorsTriangle.length);
            for (let i = 0, j = 0; i < this.positionsTriangle.length; i += 4, j += 8) {
                vertexData.set(this.positionsTriangle.subarray(i, i + 4), j);
                vertexData.set(this.colorsTriangle.subarray(i, i + 4), j + 4);
            }
        }
        else{
            vertexData = new Float32Array(this.positionsLine.length + this.colorsLine.length);
            for (let i = 0, j = 0; i < this.positionsLine.length; i += 4, j += 8) {
                vertexData.set(this.positionsLine.subarray(i, i + 4), j);
                vertexData.set(this.colorsLine.subarray(i, i + 4), j + 4);
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
}