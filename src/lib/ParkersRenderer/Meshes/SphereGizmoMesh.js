import { Mesh } from './Mesh.js';

export class SphereGizmoMesh extends Mesh {
    constructor(options){
        super(options);
        this.wireframe = true;
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
        for(let i = 0; i < 45; i++){
            this.vertexCoordinates.push([Math.cos(i * 8 * Math.PI / 180), Math.sin(i * 8 * Math.PI / 180), 0]);
        }
        for(let i = 0; i < 45; i++){
            this.vertexCoordinates.push([0, Math.sin(i * 8 * Math.PI / 180), Math.cos(i * 8 * Math.PI / 180)]);
        }
        for(let i = 0; i < 45; i++){
            this.vertexCoordinates.push([Math.sin(i * 8 * Math.PI / 180), 0, Math.cos(i * 8 * Math.PI / 180)]);
        }
        
    }

    calculateTriangleVertices(){
        this.triangleVertices = new Float32Array();
        this.triangleUVs = new Float32Array();
        this.triangleNormals = new Float32Array();
    }

    calculateLineVertices(){
        let lines = [];
        for(let i = 0; i < 44; i++){
            lines.push(this.vertexCoordinates[i]);
            lines.push(this.vertexCoordinates[i + 1]);
        }
        lines.push(this.vertexCoordinates[44]);
        lines.push(this.vertexCoordinates[0]);

        for(let i = 0; i < 44; i++){
            lines.push(this.vertexCoordinates[45 + i]);
            lines.push(this.vertexCoordinates[45 + i + 1]);
        }
        lines.push(this.vertexCoordinates[45 + 44]);
        lines.push(this.vertexCoordinates[45 + 0]);

        for(let i = 0; i < 44; i++){
            lines.push(this.vertexCoordinates[90 + i]);
            lines.push(this.vertexCoordinates[90 + i + 1]);
        }
        lines.push(this.vertexCoordinates[90 + 44]);
        lines.push(this.vertexCoordinates[90 + 0]);


        this.lineVertices = new Float32Array(lines.flat());
        this.lineUVs = new Float32Array(
            Array(lines.length * 2).fill(1.0)
        );
        this.lineNormals = new Float32Array(
            Array(lines.length * 3).fill(1.0)
        );
    }
}