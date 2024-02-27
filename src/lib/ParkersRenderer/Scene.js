import {PerspectiveCamera} from './PerspectiveCamera.js';
import {Light} from './Lights/Light.js';
import { DirectionalLight } from './Lights/DirectionalLight.js';
import { PointLight } from './Lights/PointLight.js';

export class Scene {
    constructor() {
        this.objects = [];
        this.directional_lights = [];
        this.point_lights = [];
        this.object_count = 0;
        this.object_data = new Float32Array();
        this.directional_light_data = new Float32Array();
        this.point_light_data = new Float32Array();
        this.directional_light_count = 0;
        this.point_light_count = 0;

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
            this.directional_light_data = new Float32Array(this.directional_light_data.length + 8);
        }
        if(object instanceof PointLight){
            this.point_lights.push(object);
            this.point_light_count++;
            this.point_light_data = new Float32Array(this.point_light_data.length + 12);
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
                this.directional_light_data[8 * directionalLightOffset + i] = light.lightDir[i];
            }
            this.directional_light_data[8 * directionalLightOffset + 3] = light.intensity;
            for(var i = 0; i < 4; i++){
                this.directional_light_data[8 * directionalLightOffset + 4 + i] = light.color[i];
            }
            directionalLightOffset++;
        });

        var pointLightOffset = 0;
        this.point_lights.forEach(light => {
            for(var i = 0; i < 3; i++){
                this.point_light_data[12 * pointLightOffset + i] = light.transform.position[i];
            }
            this.point_light_data[12 * pointLightOffset + 3] = light.intensity;
            for(var i = 0; i < 4; i++){
                this.point_light_data[12 * pointLightOffset + 4 + i] = light.color[i];
            }
            this.point_light_data[12 * pointLightOffset + 8] = light.fallOff;
            this.point_light_data[12 * pointLightOffset + 9] = light.maxDistance;
            pointLightOffset++;
        })

        this.print = false;
    }
}