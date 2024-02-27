import { Light } from "./Light";
import { Transform } from "../Transform";
import { SphereGizmoMesh } from "../Meshes/SphereGizmoMesh";
import { BasicMaterial } from "../Materials/BasicMaterial";
import { vec3 } from "gl-matrix";
import { CylinderMesh } from "../Meshes/CylinderMesh";

export class PointLight extends Light {
    constructor(options) {
        super();
        this.color = options.color || [1, 1, 1, 1];
        this.intensity = options.intensity || 1;
        this.mesh = new SphereGizmoMesh({wireframe: true});
        // this.mesh = new CylinderMesh({width: 6, height: 1, wireframe: true});
        this.material = new BasicMaterial({color: this.color});
        this.material.init({
            vertexBufferDescriptors: this.mesh.vertexBufferDescriptors,
            wireframe: this.mesh.wireframe
        });
        this.transform = new Transform({});
        this.transform.scale = vec3.fromValues(0.3, 0.3, 0.3);
        this.fallOff = options.fallOff || 1;
    }

    update(){
        this.transform.update();
    }
}