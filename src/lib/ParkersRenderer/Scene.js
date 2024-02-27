import {PerspectiveCamera} from './PerspectiveCamera.js';
import {Light} from './Lights/Light.js';
import { DirectionalLight } from './Lights/DirectionalLight.js';

export class Scene {
    constructor() {
        this.objects = [];
        this.directional_lights = [];
        this.object_count = 0;
        this.object_data = new Float32Array();
        this.directional_light_data = new Float32Array();
        this.directional_light_count = 0;

        //Debug
        this.print = false;
    }

    add(object) {
        this.objects.push(object);
        this.object_count++;
        if(object.transform && !(object instanceof PerspectiveCamera)){
            this.object_count++;
            this.object_data = new Float32Array(this.object_data.length + 32);
        }
        if(object instanceof DirectionalLight){
            this.directional_lights.push(object);
            this.directional_light_count++;
            this.directional_light_data = new Float32Array(this.directional_light_data.length + 7);
        }
    }

    clear() {
        this.objects = [];
        this.object_count = 0;
    }


    update(){
        var transformOffset = 0;
        this.objects.forEach(element => {
            
            if(typeof element.update === 'function'){
                element.update();
            }

            if(element.transform && !(element instanceof PerspectiveCamera)){
                if(this.print){
                    console.log(element);
                    console.log(element.transform.TRS);
                    console.log(element.transform.TRS_I_T);
                    console.log("---")
                }
                for(var i = 0; i < 16; i++){
                    this.object_data[32 * transformOffset + i] = element.transform.TRS.at(i);
                }
                for(var i = 0; i < 16; i++){
                    this.object_data[32 * transformOffset + 16 + i] = element.transform.TRS_I_T.at(i);
                }
                transformOffset++;
            }
        });

        var directionalLightOffset = 0;
        this.directional_lights.forEach(light => {
            for(var i = 0; i < 3; i++){
                this.directional_light_data[7 * directionalLightOffset + i] = light.lightDir[i];
                //console.log(light);
                // console.log(light.lightDir)
                // this.directional_light_data[7 * directionalLightOffset + i] = 1.0;
            }
            for(var i = 0; i < 4; i++){
                this.directional_light_data[7 * directionalLightOffset + 3 + i] = light.color[i];
                // this.directional_light_data[7 * directionalLightOffset + 3 + i] = 1.0;
            }
            directionalLightOffset++;
            // console.log(directionalLightOffset)
        });

        this.print = false;
    }
}