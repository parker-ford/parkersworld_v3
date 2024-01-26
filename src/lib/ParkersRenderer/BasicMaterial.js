import { Material } from './Material.js';
import { Renderer } from './Renderer.js';
import basicMaterialShader from './shaders/basicMaterialShader.wgsl?raw';

export class BasicMaterial extends Material {
    static pipeline = null;
    constructor(options) {
        super();
        this.color = options.color;
    }

    init(options){
        if(!BasicMaterial.pipeline) {
            BasicMaterial.pipeline = this.createPipeline(options);
        }
    }

    createPipeline(options){
        //Not sure about this, but will leave it for now
        const pipelineLayout = Renderer.instance.getDevice().createPipelineLayout({
            bindGroupLayouts: [Renderer.instance.bindGroupLayout]
        })

        const shaderModule = Renderer.instance.getDevice().createShaderModule({ code: basicMaterialShader });
        const pipeline = Renderer.instance.getDevice().createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: "vertex_main",
                buffers: options.vertexBufferDescriptors
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fragment_main",
                targets: [
                    { format: Renderer.instance.presentationFormat }
                ],
                primitive: {
                    topology: 'triangle-list',
                }
            },

            //Depth stencil may need to be per material rather than per renderer
            depthStencil: Renderer.instance.depthStencilState,
        });

        return pipeline;
    }

    getPipeline(){
        return BasicMaterial.pipeline;
    }
}