import { mat4, vec3 } from "gl-matrix";
import { Transform } from "./Transform";

export class PerspectiveCamera {
    constructor(options) {

        this.position = [0, 0, 1]; //Hard coded for now
        this.transform = new Transform( {} );

        this.fov = options.fov * Math.PI / 180 //Input is deg, convert to radians
        this.aspect = options.aspect;
        this.near = options.near;
        this.far = options.far;

        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);

        this.viewMatrix = mat4.create();
    }

    update(){
        this.transform.update();
        let flipZ = mat4.fromScaling(mat4.create(), vec3.fromValues(1, 1, -1));
        mat4.invert(this.viewMatrix, this.transform.TRS);
        mat4.multiply(this.viewMatrix, flipZ, this.viewMatrix);

    }
}

