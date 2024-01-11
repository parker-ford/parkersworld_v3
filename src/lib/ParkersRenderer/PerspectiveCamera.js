import { mat4 } from "gl-matrix";

export class PerspectiveCamera {
    constructor(options) {
        this.position = [0, 0, 1]; //Hard coded for now
        this.fov = options.fov * Math.PI / 180 //Input is deg, convert to radians
        this.aspect = options.aspect;
        this.near = options.near;
        this.far = options.far;

        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);

        this.viewMatrix = mat4.create();
    }

    update(){

       mat4.lookAt(this.viewMatrix, this.position, [0,0,0], [0, 1, 0]);
    }
}

