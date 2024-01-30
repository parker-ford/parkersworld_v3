import { Mesh } from "./Mesh.js";
export class ConeMesh extends Mesh {
    constructor(options){
        super(options);
        this.width = options.width || 6;
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
        const heightInterval = 1 / this.height;
        let r = 0.5;

        //Sides
        for(let i = 0; i < this.height + 1; i++){
            r = 0.5 - i * heightInterval * 0.5;
            for(let j = 0; j < this.width + 1; j++){
                const x = r * Math.cos(2 * Math.PI * j / this.width);
                const y = -0.5 + i * heightInterval;
                const z = r * Math.sin(2 * Math.PI * j / this.width);
                this.vertexCoordinates.push([x, y, z, 1]);
            }
        }

        //Bot
        this.vertexCoordinates.push([0, -0.5, 0, 1]);

    }

    calculateTriangleVertices(){
        this.triangleCoordinates = [];

        //Sides
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
            
                //Top Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[j + (i * (this.width + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + (i * (this.width + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.width + 1))]);

                //Bottom Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.width + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[j + ((i + 1) * (this.width + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[j + (i * (this.width + 1))]);

            }
        }

        //Bot
        for(let i = 0; i < this.width; i++){
            this.triangleCoordinates.push(this.vertexCoordinates[this.vertexCoordinates.length - 1]);
            this.triangleCoordinates.push(this.vertexCoordinates[i]);
            this.triangleCoordinates.push(this.vertexCoordinates[i + 1]);
        }


        this.triangleVertices = new Float32Array(this.triangleCoordinates.flat());

        this.triangleColors = new Float32Array(
            Array(this.triangleVertices.length).fill(1.0)
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
    }
}