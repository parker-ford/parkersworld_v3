import { mat4, vec3, quat } from "gl-matrix";



export class Transform {
    constructor(options) {

        this.position = vec3.create();

        this.rotation = quat.create();
        quat.identity(this.rotation);

        this.scale = vec3.fromValues(1,1,1);

        this.up = vec3.fromValues(0,1,0);
        this.forward = vec3.fromValues(0,0,1);
        this.right = vec3.fromValues(1,0,0);

        this.TRS = mat4.create();
        this.updateTRS();
    }

    updateTRS(){
        mat4.identity(this.TRS);

        let translation = mat4.create();
        mat4.fromTranslation(translation, this.position);
        mat4.multiply(this.TRS, this.TRS, translation);

        let rotation = mat4.create();
        mat4.fromQuat(rotation, this.rotation);
        mat4.multiply(this.TRS, this.TRS, rotation);

        let scale = mat4.create();
        mat4.fromScaling(scale, this.scale);
        mat4.multiply(this.TRS, this.TRS, scale);
    }

    updateDirectionVectors(){
        vec3.transformQuat(this.up, vec3.fromValues(0,1,0), this.rotation);
        vec3.transformQuat(this.forward, vec3.fromValues(0,0,1), this.rotation);
        vec3.transformQuat(this.right, vec3.fromValues(1,0,0), this.rotation);
    }

    update(){
        this.updateTRS();
        this.updateDirectionVectors();
    }
}