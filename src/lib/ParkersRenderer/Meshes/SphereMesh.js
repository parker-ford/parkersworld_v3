import { Mesh } from "./Mesh.js";
export class SphereMesh extends Mesh {
    constructor(options){
        super(options);
        this.resolution = options.resolution || 4;
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
        this.uvCoordinates = [];

        const verticalInterval = 1 / this.resolution;
        let r = 0.5;
        //If there are M lines of latitude (horizontal) and N lines of longitude (vertical), then put dots at
        //(x, y, z) = (sin(Pi * m/M) cos(2Pi * n/N), sin(Pi * m/M) sin(2Pi * n/N), cos(Pi * m/M))

        for(let i = 0; i < this.resolution + 1; i++){
            r = Math.sin(Math.PI * i / this.resolution) / 2;
            for(let j = 0; j < this.resolution + 1; j++){
                const x = Math.sin(Math.PI * i / this.resolution) * Math.cos(2 * Math.PI * j / this.resolution) * 0.5;
                const z = Math.sin(Math.PI * i / this.resolution) * Math.sin(2 * Math.PI * j / this.resolution) * 0.5;
                const y = Math.cos(Math.PI * i / this.resolution) * 0.5;
                this.vertexCoordinates.push([x, y, z, 1]);

                this.uvCoordinates.push([(j * verticalInterval), 1 - (i * verticalInterval)]);
            }
        }
    }

    calculateTriangleVertices(){
        this.triangleCoordinates = [];
        this.uvs = [];

        for(let i = 0; i < this.resolution; i++){
            for(let j = 0; j < this.resolution; j++){
            
                //Top Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[j + (i * (this.resolution + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + (i * (this.resolution + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.resolution + 1))]);

                this.uvs.push(this.uvCoordinates[j + (i * (this.resolution + 1))]);
                this.uvs.push(this.uvCoordinates[(j + 1) + (i * (this.resolution + 1))]);
                this.uvs.push(this.uvCoordinates[(j + 1) + ((i + 1) * (this.resolution + 1))]);

                //Bottom Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[(j + 1) + ((i + 1) * (this.resolution + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[j + ((i + 1) * (this.resolution + 1))]);
                this.triangleCoordinates.push(this.vertexCoordinates[j + (i * (this.resolution + 1))]);

                this.uvs.push(this.uvCoordinates[(j + 1) + ((i + 1) * (this.resolution + 1))]);
                this.uvs.push(this.uvCoordinates[j + ((i + 1) * (this.resolution + 1))]);
                this.uvs.push(this.uvCoordinates[j + (i * (this.resolution + 1))]);

            }
        }

        this.triangleVertices = new Float32Array(this.triangleCoordinates.flat());

        this.triangleColors = new Float32Array(
            Array(this.triangleVertices.length).fill(1.0)
        );
        this.triangleUVs = new Float32Array(this.uvs.flat());
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