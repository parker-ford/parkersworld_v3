import { Mesh } from "./Mesh.js";
export class TorusMesh extends Mesh {
    constructor(options){
        super(options);
        this.innerRadius = options.innerRadius || 0.25;

        this.ringSubdivisions = options.ringSubdivisions || 15;
        this.tubeSubdivisions = options.tubeSubdivisions || 15;

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

        const outerRadius = 0.5;

        //Ring radius
        let phi = 0.0;
        const dp = (2 * Math.PI) / this.ringSubdivisions;

        //torus radius
        let theta = 0.0;
        const dt = (2 * Math.PI) / this.tubeSubdivisions
        for(let i = 0; i < this.tubeSubdivisions; i++){
            theta = dt * i;
            for(let j = 0; j < this.ringSubdivisions; j++){
                phi = dp * j;
                const x = Math.cos(theta) * (outerRadius + Math.cos(phi) * this.innerRadius);
                const z = Math.sin(theta) * (outerRadius + Math.cos(phi) * this.innerRadius);
                const y = Math.sin(phi) * this.innerRadius;
                this.vertexCoordinates.push([x, y, z, 1]);
            }
        }

       
    }

    calculateTriangleVertices(){
        this.triangleCoordinates = [];
    
        for(let stack = 0; stack < this.tubeSubdivisions; stack++){
            for(let slice = 0; slice < this.ringSubdivisions; slice++){
    
                const t1 = stack * this.ringSubdivisions + slice;
                const t2 = ((stack + 1) % this.tubeSubdivisions) * this.ringSubdivisions + slice;
                const t3 = stack * this.ringSubdivisions + (slice + 1) % this.ringSubdivisions;
                const t4 = ((stack + 1) % this.tubeSubdivisions) * this.ringSubdivisions + (slice + 1) % this.ringSubdivisions;
    
                //Top Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[t1]);
                this.triangleCoordinates.push(this.vertexCoordinates[t3]);
                this.triangleCoordinates.push(this.vertexCoordinates[t4]);
    
                //Bottom Triangle
                this.triangleCoordinates.push(this.vertexCoordinates[t1]);
                this.triangleCoordinates.push(this.vertexCoordinates[t4]);
                this.triangleCoordinates.push(this.vertexCoordinates[t2]);
            }
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