import { mat4, vec3, quat } from "gl-matrix";



export class Transform {
    constructor(options) {

        if(options.position){
            this.position = options.position;
        }
        else{
            this.position = vec3.create();
        }

        if(options.rotation){
            this.rotation = options.rotation;
        }
        else{
            this.rotation = quat.create();
            quat.identity(this.rotation);
        }

        if(options.scale){
            this.scale = options.scale;
        }
        else{
            this.scale = vec3.fromValues(1,1,1);
        }

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

    update(){
        this.updateTRS();
    }
}