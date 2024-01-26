import {PerspectiveCamera} from './PerspectiveCamera.js';

export class Scene {
    constructor() {
        this.objects = [];
        this.object_count = 0;
        this.object_data = new Float32Array();

        //Debug
        this.print = true;
    }

    add(object) {
        this.objects.push(object);
        this.object_count++;
        if(object.transform && !(object instanceof PerspectiveCamera)){
            this.object_count++;
            this.object_data = new Float32Array(this.object_data.length + 16);
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
                    console.log("---")
                }
                for(var i = 0; i < 16; i++){
                    this.object_data[16 * transformOffset + i] = element.transform.TRS.at(i);
                }
                transformOffset++;
            }
        });
        this.print = false;
    }
}