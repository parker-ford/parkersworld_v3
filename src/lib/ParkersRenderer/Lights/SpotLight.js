import { Light } from "./Light";
import { Transform } from "../Transform";
import { ConeGizmoMesh } from "../Meshes/ConeGizmoMesh";
import { BasicMaterial } from "../Materials/BasicMaterial";
import { vec3 } from "gl-matrix";

export class SpotLight extends Light {
    constructor(options) {
        super();
        this.color = options.color || [1, 1, 1, 1];
        this.intensity = options.intensity || 1;
        this.mesh = new ConeGizmoMesh({wireframe: true});
        this.material = new BasicMaterial({color: this.color});
        this.material.init({
            vertexBufferDescriptors: this.mesh.vertexBufferDescriptors,
            wireframe: this.mesh.wireframe
        });
        this.transform = new Transform({});
        this.fallOff = options.fallOff || 1;
        this.setMaxDistance(options.maxDistance || 5);
        this.umbra = options.umbra || 0.5;
        this.penumbra = options.penumbra || 0.5;

    }

    setMaxDistance(distance){
        this.maxDistance = distance;
        this.mesh.distance = distance;
        this.mesh.updateGizmo();
    }

    update(){
        this.transform.update();
        // console.log(this.transform.forward);
    }
}