import { mat4, vec3 } from "gl-matrix";
import { Transform } from "./Transform";
import { Input } from "./Input";
import { Time } from "./Time";

export class PerspectiveCamera {
    constructor(options) {

        this.position = [0, 0, 1]; //Hard coded for now
        this.transform = new Transform( {} );

        this.fov = options.fov * Math.PI / 180 //Input is deg, convert to radians
        this.aspect = options.aspect;
        this.near = options.near;
        this.far = options.far;

        this.useControlls = true;
        this.speed = 5;

        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);

        this.viewMatrix = mat4.create();
    }

    update(){

        if(this.useControlls){
            this.controllsUpdate();
        }

        this.transform.update();
        let flipZ = mat4.fromScaling(mat4.create(), vec3.fromValues(1, 1, -1));
        mat4.invert(this.viewMatrix, this.transform.TRS);
        mat4.multiply(this.viewMatrix, flipZ, this.viewMatrix);
    }

    controllsUpdate(){
        if(Input.isKeyDown('w')){
            this.transform.position[2] += this.speed * Time.deltaTime;
        }
        if(Input.isKeyDown('s')){
            this.transform.position[2] -= this.speed * Time.deltaTime;
        }
        if(Input.isKeyDown('a')){
            this.transform.position[0] -= this.speed * Time.deltaTime;
        }
        if(Input.isKeyDown('d')){
            this.transform.position[0] += this.speed * Time.deltaTime;
        }
        if(Input.isKeyDown('q')){
            this.transform.position[1] -= this.speed * Time.deltaTime;
        }
        if(Input.isKeyDown('e')){
            this.transform.position[1] += this.speed * Time.deltaTime;
        }
    }
}

