import { Mesh } from "./Mesh.js";
export class PlaneMesh extends Mesh {
    constructor(options){
        super(options);
        this.width = options.width || 1;
        this.height = options.height || 1; 
        this.calculateVertices();
        this.setupVertexBuffer();

    }

    calculateVertices(){
        this.calculateVertexCoordinates();
        this.calculateTriangleVertices();
        this.calculateLineVertices();
    }
    

    calculateVertexCoordinates(){
        this.vertexCoordinates = [];
        const widthInterval = 1 / this.width;
        const heightInterval = 1 / this.height;
        for(let i = 0; i < this.width + 1; i++){
            for(let j = 0; j < this.height + 1; j++){
                this.vertexCoordinates.push([ -0.5 + i * widthInterval, -0.5 + j * heightInterval, 0, 1]);
            }
        }
    }

    calculateTriangleVertices(){
        this.triangleCoordinates = [];

        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
            
                //Top Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[j + (i * (this.height + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + (i * (this.height + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.height + 1))]);

                //Bottom Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.height + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[j + ((i + 1) * (this.height + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[j + (i * (this.height + 1))]);

            }
        }

        this.triangleVertices = new Float32Array(this.triangleCoordinates.flat());

        this.triangleColors = new Float32Array(
            Array(this.triangleVertices.length).fill(1.0)
        );
        this.triangleUVs = new Float32Array(
            Array(this.triangleCoordinates.length * 2).fill(1.0)
        );
        this.triangleNormals = new Float32Array(
            Array(this.triangleCoordinates.length * 3).fill(1.0)
        );

    }

    calculateLineVertices(){
        let lines = [];
        for(let i = 0; i < this.triangleCoordinates.length; i+=3){
            //Line 1
            lines.push(this.triangleCoordinates[i]);
            lines.push(this.triangleCoordinates[i+1]);

            //Line 2
            lines.push(this.triangleCoordinates[i + 1]);
            lines.push(this.triangleCoordinates[i + 2]);

            //Line 3
            lines.push(this.triangleCoordinates[i + 2]);
            lines.push(this.triangleCoordinates[i]);
        }

        this.lineVertices = new Float32Array(lines.flat());

        this.lineColors = new Float32Array(
            Array(this.lineVertices.length).fill(1.0)
        );
        this.lineUVs = new Float32Array(
            Array(lines.length * 2).fill(1.0)
        );
        this.lineNormals = new Float32Array(
            Array(lines.length * 3).fill(1.0)
        );
    }
}