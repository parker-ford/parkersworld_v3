import { Mesh } from "./Mesh.js";
import { Renderer } from "./Renderer.js";
export class PlaneMesh extends Mesh {
    constructor(options){
        super();
        this.wireframe = options.wireframe || false;
        this.width = options.width || 1;
        this.height = options.height || 1; 
        this.calculateVertices();
        this.setupVertexBuffer();

        //Hard coded for now
        this.vertexCount = 6;
    }


    //Hard coded for now
    getVertexCount(){
        // return this.wireframe ? (this.width * this.height * 2 * 3 * 2) : (this.width * this.height * 2 * 3);
        // return this.wireframe ? 6 : 14;
        return this.wireframe ? this.positionsLine.length / 4: this.positionsTriangle.length / 4;
    }

    //Hard coded for now
    calculateVertices(){

        this.vertexCoordinates = [];
        const widthInterval = 1 / this.width;
        const heightInterval = 1 / this.height;
        for(let i = 0; i < this.width + 1; i++){
            for(let j = 0; j < this.height + 1; j++){
                this.vertexCoordinates.push([-0.5 + j * widthInterval, -0.5 + i * heightInterval, 0, 1]);
            }
        }

        let coordinates = [];

        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                // // Triangle 1
                // coordinates.push(this.vertexCoordinates[i * (this.width + 1) + j]);
                // coordinates.push(this.vertexCoordinates[i * (this.width + 1) + j + 1]);
                // coordinates.push(this.vertexCoordinates[(i + 1) * (this.width + 1) + j]);

                // // Triangle 2
                // coordinates.push(this.vertexCoordinates[i * (this.width + 1) + j + 1]);
                // coordinates.push(this.vertexCoordinates[(i + 1) * (this.width + 1) + j + 1]);
                // coordinates.push(this.vertexCoordinates[(i + 1) * (this.width + 1) + j]);

                //Top Triangle
                coordinates.push(this.vertexCoordinates[j + (i * (this.width + 1))]);
                coordinates.push(this.vertexCoordinates[(j + 1) + (i * (this.width + 1))]);
                coordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.width + 1))]);

                //Bottom Triangle
                // coordinates.push(this.vertexCoordinates[]);
                coordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.width + 1))]);
                coordinates.push(this.vertexCoordinates[j + ((i + 1) * (this.width + 1))]);
                coordinates.push(this.vertexCoordinates[j + (i * (this.width + 1))]);

            }
        }

        this.positionsTriangle = new Float32Array(coordinates.flat());
   
        this.colorsTriangle = new Float32Array(
            Array(this.width * this.height * 2 * 3).fill([1.0, 1.0, 1.0, 1.0]).flat()
        );


        let lines = [];
        for(let i = 0; i < coordinates.length; i+=3){
            //Line 1
            lines.push(coordinates[i]);
            lines.push(coordinates[i+1]);

            //Line 2
            lines.push(coordinates[i + 1]);
            lines.push(coordinates[i + 2]);

            //Line 3
            lines.push(coordinates[i + 2]);
            lines.push(coordinates[i]);
        }

        this.positionsLine = new Float32Array(lines.flat());

        this.colorsLine = new Float32Array(
            Array(this.positionsLine.length).fill(1.0)
        );


        
        // let lines = [];
        // for(let i = 0; i < this.width; i++){
        //     for(let j = 0; j < this.height; j++){
        //         // Horizontal lines
        //         lines.push(this.vertexCoordinates[i * (this.width + 1) + j]);
        //         lines.push(this.vertexCoordinates[i * (this.width + 1) + j + 1]);
        
        //         // Vertical lines
        //         lines.push(this.vertexCoordinates[i * (this.width + 1) + j]);
        //         lines.push(this.vertexCoordinates[(i + 1) * (this.width + 1) + j]);
        
        //         // Diagonal lines
        //         lines.push(this.vertexCoordinates[i * (this.width + 1) + j]);
        //         lines.push(this.vertexCoordinates[(i + 1) * (this.width + 1) + j + 1]);
        //     }
        // }
        // this.positionsLine = new Float32Array(lines.flat());
        // console.log(this.positionsLine.length / 4);

        // this.colorsLine = new Float32Array(
        //     Array(this.width * this.height * 3 * 2 * 4).fill(1.0)
        // );

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