import {Mesh} from './Meshes/Mesh.js';
import {Material} from './Materials/Material.js';
import {Transform} from './Transform.js';

export class Renderable{
    constructor(options){

        if (!(options.mesh instanceof Mesh)) {
            throw new Error('Renderable must be constructed with an instance of Mesh');
        }
        this.mesh = options.mesh;

        if (!(options.material instanceof Material)) {
            throw new Error('Renderable must be constructed with an instance of Material');
        }
        this.material = options.material;
        this.material.init({
            vertexBufferDescriptors: this.mesh.vertexBufferDescriptors,
            wireframe: this.mesh.wireframe
        });

        this.transform = new Transform({});
    }

    update(){
        this.transform.update();
    }


}